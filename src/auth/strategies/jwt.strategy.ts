import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';

export interface JwtPayload {
  sub: string;
  userId: string;
  roleId: number;
  permissions: any[];
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaDatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.users.findUnique({
      where: { id: payload.sub },
      include: {
        role: {
          include: {
            Permissions: true,
          },
        },
      },
    });

    const loggerPrefix = '[JwtConstants]';

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error(
        `${loggerPrefix} JWT_SECRET environment variable is not set`,
      );
      throw new Error('JWT_SECRET environment variable is not set');
    } else {
      console.log(`${loggerPrefix} JWT_SECRET loaded successfully`);
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.sub,
      roleId: payload.roleId,
      permissions: payload.permissions,
      fullUser: user,
    };
  }
}
