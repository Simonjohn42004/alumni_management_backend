import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FeatureName } from 'generated/prisma/client';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { PERMISSIONS_KEY, RequiredPermission } from './roles.guard';

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

    // Assume single permission for simplicity; extend as needed
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

      // New feature cases with ownership logic
      case FeatureName.fundraising:
        const campaign = await this.prisma.campaign.findUnique({
          where: { id: resourceId as number },
          select: { creatorId: true },
        });
        if (!campaign) throw new NotFoundException('Campaign not found');
        resourceOwnerId = campaign.creatorId;
        break;

      case FeatureName.campaignUpdates:
        const campaignUpdate = await this.prisma.campaignUpdate.findUnique({
          where: { id: resourceId as number },
          select: { userId: true },
        });
        if (!campaignUpdate)
          throw new NotFoundException('Campaign update not found');
        resourceOwnerId = campaignUpdate.userId;
        break;

      case FeatureName.donations:
        const donation = await this.prisma.donation.findUnique({
          where: { id: resourceId as number },
          select: { donorId: true },
        });
        if (!donation) throw new NotFoundException('Donation not found');
        resourceOwnerId = donation.donorId;
        break;

      case FeatureName.paymentDetails:
        // Since paymentDetails relate to donations owned by donors,
        // fetch donation via paymentDetails to get donorId
        const paymentDetail = await this.prisma.paymentDetails.findUnique({
          where: { id: resourceId as number },
          select: {
            donation: {
              select: { donorId: true },
            },
          },
        });
        if (!paymentDetail || !paymentDetail.donation)
          throw new NotFoundException('Payment detail not found');
        resourceOwnerId = paymentDetail.donation.donorId;
        break;

      case FeatureName.rewards:
        // ownership via campaign creator (assuming reward owner is campaign owner)
        const reward = await this.prisma.reward.findUnique({
          where: { id: resourceId as number },
          select: {
            campaign: {
              select: { creatorId: true },
            },
          },
        });
        if (!reward || !reward.campaign)
          throw new NotFoundException('Reward not found');
        resourceOwnerId = reward.campaign.creatorId;
        break;

      case FeatureName.campaignCategories:
        // campaignCategories related to campaigns, ownership via campaign's creator
        const campaignCategory = await this.prisma.campaignCategory.findUnique({
          where: { id: resourceId as number },
          select: {
            campaign: {
              select: { creatorId: true },
            },
          },
        });
        if (!campaignCategory || !campaignCategory.campaign)
          throw new NotFoundException('Campaign category not found');
        resourceOwnerId = campaignCategory.campaign.creatorId;
        break;

      case FeatureName.jobs:
        const job = await this.prisma.job.findUnique({
          where: { id: resourceId as number },
          select: { postedById: true },
        });
        if (!job) throw new NotFoundException('Job not found');
        resourceOwnerId = job.postedById;
        break;

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
