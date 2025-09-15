import { Module } from '@nestjs/common';
import { CampaignUpdatesService } from './campaign-updates.service';
import { CampaignUpdatesController } from './campaign-updates.controller';
import { PrismaDatabaseModule } from 'src/prisma-database/prisma-database.module';

@Module({
  imports: [PrismaDatabaseModule],
  controllers: [CampaignUpdatesController],
  providers: [CampaignUpdatesService],
})
export class CampaignUpdatesModule {}
