import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FeatureName } from 'generated/prisma/client';

export interface RequiredPermission {
  feature: FeatureName;
  action:
    | 'create'
    | 'read'
    | 'updateOwn'
    | 'updateAny'
    | 'deleteOwn'
    | 'deleteAny';
  resourceOwnerId?: string; // For checking ownership in updateOwn/deleteOwn
}

export const PERMISSIONS_KEY = 'permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);
  private readonly prefix = '[PermissionsGuard]';

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      RequiredPermission[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    this.logger.debug(
      `${this.prefix} Required permissions for this handler: ${JSON.stringify(requiredPermissions)}`,
    );

    if (!requiredPermissions) {
      this.logger.debug(`${this.prefix} No required permissions set, allowing access`);
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      this.logger.warn(`${this.prefix} No user found on request, denying access`);
      return false;
    }

    this.logger.debug(`${this.prefix} User permissions: ${JSON.stringify(user.permissions)}`);

    const hasPermission = requiredPermissions.every((permission) =>
      this.checkPermission(user, permission, context),
    );

    if (!hasPermission) {
      this.logger.warn(
        `${this.prefix} User ${user.id} does not have sufficient permissions: ${JSON.stringify(requiredPermissions)}`,
      );
      throw new ForbiddenException('Insufficient permissions');
    }

    this.logger.debug(`${this.prefix} User ${user.id} has all required permissions`);
    return true;
  }

  private checkPermission(
    user: any,
    required: RequiredPermission,
    context: ExecutionContext,
  ): boolean {
    const userPermissions = user.permissions;
    const featurePermission = userPermissions.find(
      (p: any) => p.featureName === required.feature,
    );

    this.logger.debug(
      `${this.prefix} Checking permission for feature "${required.feature}" and action "${required.action}"`,
    );
    this.logger.debug(
      `${this.prefix} Found feature permission: ${JSON.stringify(featurePermission)}`,
    );

    if (!featurePermission) {
      this.logger.debug(
        `${this.prefix} User does not have any permissions for feature "${required.feature}"`,
      );
      return false;
    }

    switch (required.action) {
      case 'create':
        this.logger.debug(`${this.prefix} Can create: ${featurePermission.canCreate}`);
        return featurePermission.canCreate;
      case 'read':
        this.logger.debug(`${this.prefix} Can read: ${featurePermission.canRead}`);
        return featurePermission.canRead;
      case 'updateOwn':
        if (featurePermission.canUpdateAny) {
          this.logger.debug(`${this.prefix} Can update any - allowed`);
          return true;
        }
        if (featurePermission.canUpdateOwn) {
          // Optional: Add ownership check here if desired
          this.logger.debug(`${this.prefix} Can update own - allowed`);
          return true;
        }
        this.logger.debug(`${this.prefix} Update own not allowed`);
        return false;
      case 'updateAny':
        this.logger.debug(`${this.prefix} Can update any: ${featurePermission.canUpdateAny}`);
        return featurePermission.canUpdateAny;
      case 'deleteOwn':
        if (featurePermission.canDeleteAny) {
          this.logger.debug(`${this.prefix} Can delete any - allowed`);
          return true;
        }
        if (featurePermission.canDeleteOwn) {
          // Optional: Add ownership check here if desired
          this.logger.debug(`${this.prefix} Can delete own - allowed`);
          return true;
        }
        this.logger.debug(`${this.prefix} Delete own not allowed`);
        return false;
      case 'deleteAny':
        this.logger.debug(`${this.prefix} Can delete any: ${featurePermission.canDeleteAny}`);
        return featurePermission.canDeleteAny;
      default:
        this.logger.warn(`${this.prefix} Unknown action "${required.action}" requested`);
        return false;
    }
  }
}
