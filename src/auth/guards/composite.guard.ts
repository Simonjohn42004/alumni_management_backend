import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PermissionsGuard } from './roles.guard';

@Injectable()
export class CompositeAuthGuard implements CanActivate {
  constructor(
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly permissionsGuard: PermissionsGuard,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true; // Skip guard for public routes like login
    }

    const jwtResult = await this.jwtAuthGuard.canActivate(context);
    if (!jwtResult) return false;

    return this.permissionsGuard.canActivate(context);
  }
}
