import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FeatureName } from 'generated/prisma/client';
import {
  PERMISSIONS_KEY,
  RequiredPermission,
} from 'src/auth/guards/roles.guard';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';

@Injectable()
export class GenericOwnershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaDatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      RequiredPermission[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredPermissions) {
      // No permissions required, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return false;
    }

    // We assume single permission for simplicity; extend as needed
    const permission = requiredPermissions[0];
    if (!permission) return false;

    if (
      permission.action !== 'updateOwn' &&
      permission.action !== 'deleteOwn'
    ) {
      // Ownership check not needed; allow
      return true;
    }

    const resourceIdParam = request.params.id;
    if (!resourceIdParam) {
      // No resource id in params
      throw new ForbiddenException('Resource ID parameter missing');
    }
    const resourceId = isNaN(resourceIdParam)
      ? resourceIdParam
      : Number(resourceIdParam);

    let resourceOwnerId: string | undefined;

    switch (permission.feature) {
      case FeatureName.posts:
        const post = await this.prisma.posts.findUnique({
          where: { id: resourceId as number },
          select: { authorId: true },
        });
        if (!post) throw new NotFoundException('Post not found');
        resourceOwnerId = post.authorId;
        break;

      case FeatureName.postComments:
        const comment = await this.prisma.postComments.findUnique({
          where: { id: resourceId as number },
          select: { commenterId: true },
        });
        if (!comment) throw new NotFoundException('Post comment not found');
        resourceOwnerId = comment.commenterId;
        break;

      // Add other post-related features here, e.g. likes, shares, etc.

      default:
        throw new ForbiddenException('Ownership not handled for this resource');
    }

    if (!resourceOwnerId) {
      throw new ForbiddenException('Resource owner ID not found');
    }

    if (resourceOwnerId !== user.userId) {
      throw new ForbiddenException('You do not own this resource');
    }

    return true;
  }
}
