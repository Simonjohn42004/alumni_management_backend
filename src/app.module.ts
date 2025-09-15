import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';
import { PrismaDatabaseModule } from './prisma-database/prisma-database.module';
import { RolesModule } from './roles/roles.module';
import { EducationsModule } from './profile/educations/educations.module';
import { PostsModule } from './posts/posts.module';
import { PostCommentsModule } from './posts/post-comments/post-comments.module';
import { PostLikesModule } from './posts/post-likes/post-likes.module';
import { PostSavesModule } from './posts/post-saves/post-saves.module';
import { PostTagsModule } from './posts/post-tags/post-tags.module';
import { CampaignModule } from './campaign/campaign.module';
import { DonationsModule } from './campaign/donations/donations.module';
import { PaymentDetailsModule } from './campaign/payment-details/payment-details.module';
import { RewardsModule } from './campaign/rewards/rewards.module';
import { CampaignUpdatesModule } from './campaign/campaign-updates/campaign-updates.module';

@Module({
  imports: [ProfileModule, PrismaDatabaseModule, RolesModule, EducationsModule, PostsModule, PostCommentsModule, PostLikesModule, PostSavesModule, PostTagsModule, CampaignModule, DonationsModule, PaymentDetailsModule, RewardsModule, CampaignUpdatesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
