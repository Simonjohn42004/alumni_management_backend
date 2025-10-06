import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PermissionsGuard } from './auth/guards/roles.guard';
import { CompositeAuthGuard } from './auth/guards/composite.guard';
import { AuthModule } from './auth/auth.module';
import { FeatureFlagMiddleware } from './middleware/feature-flag.middleware';
import { JobsModule } from './jobs_internships/jobs/jobs.module';
import { ChatGateway } from './chats/chat.gateway';

@Module({
  imports: [
    ProfileModule,
    PrismaDatabaseModule,
    RolesModule,
    EducationsModule,
    PostsModule,
    PostCommentsModule,
    PostLikesModule,
    PostSavesModule,
    PostTagsModule,
    CampaignModule,
    DonationsModule,
    PaymentDetailsModule,
    RewardsModule,
    CampaignUpdatesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule, AuthModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        console.log('JWT_SECRET : ', secret ? secret : 'Not Set');
        if (!secret) {
          throw new Error(
            'JWT_SECRET must be defined in environment variables',
          );
        }
        return {
          secret: secret,
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d',
          },
        };
      },
      inject: [ConfigService],
    }),
    JobsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtAuthGuard,
    PermissionsGuard,
    ChatGateway,
    {
      provide: APP_GUARD,
      useClass: CompositeAuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FeatureFlagMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Apply to all routes
  }
}
