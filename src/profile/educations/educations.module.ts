import { Module } from '@nestjs/common';
import { EducationsService } from './educations.service';
import { EducationsController } from './educations.controller';
import { PrismaDatabaseModule } from 'src/prisma-database/prisma-database.module';

@Module({
  imports: [PrismaDatabaseModule],
  controllers: [EducationsController],
  providers: [EducationsService],
})
export class EducationsModule {}
