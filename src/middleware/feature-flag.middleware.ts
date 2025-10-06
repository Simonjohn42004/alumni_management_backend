import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Flagsmith } from 'flagsmith-nodejs';

@Injectable()
export class FeatureFlagMiddleware implements NestMiddleware {
  private readonly logger = new Logger(FeatureFlagMiddleware.name);
  private readonly prefix = '[FeatureFlagMiddleware]';

  private flagsmith;

  private routeFeatureMap: Record<string, string> = {
    '/api/profile': 'profile',
    '/api/posts': 'posts',
    '/api/campaigns': 'fundraising',
    '/api/jobs' : 'jobs_internships'
  };

  constructor() {
    this.flagsmith = new Flagsmith({
      environmentKey: 'kseSsgyYkm5ujFZhJxeHK7',
    });
    this.logger.log(`${this.prefix} Flagsmith client initialized`);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const matchedRoute = Object.keys(this.routeFeatureMap).find((route) =>
        req.path.startsWith(route),
      );

      this.logger.debug(
        `${this.prefix} Incoming request path: ${req.path}, matched route: ${matchedRoute}`,
      );

      if (matchedRoute) {
        const userId = req.headers['x-user-id']?.toString() || 'anonymous';

        this.logger.debug(`${this.prefix} Fetching flags for user: ${userId}`);

        // Get all feature flags for the user/context
        const flagsResponse = await this.flagsmith.getEnvironmentFlags({
          identifier: userId,
        });

        this.logger.debug(
          `${this.prefix} Flags received: ${JSON.stringify(
            Object.entries(flagsResponse.flags).map(([key, flag]) => ({
              key,
              enabled: (flag as any).enabled,
            })),
          )}`,
        );

        const featureKey = this.routeFeatureMap[matchedRoute];

        // Check if the feature flag is enabled
        if (!flagsResponse.isFeatureEnabled(featureKey)) {
          this.logger.warn(
            `${this.prefix} Feature flag "${featureKey}" is disabled for user: ${userId}`,
          );
          return res.status(403).json({ message: 'Feature not enabled' });
        }

        this.logger.log(
          `${this.prefix} Feature flag "${featureKey}" is enabled for user: ${userId}`,
        );
      } else {
        this.logger.debug(
          `${this.prefix} No matching feature flag mapping for path`,
        );
      }

      next();
    } catch (error) {
      this.logger.error(`${this.prefix} Error in feature flag check:`, error);
      next(error);
    }
  }
}
