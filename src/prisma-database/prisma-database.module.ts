import { Module } from '@nestjs/common';
import { PrismaDatabaseService } from './prisma-database.service';

@Module({
  imports: [PrismaDatabaseModule],
  providers: [PrismaDatabaseService],
  exports: [PrismaDatabaseService],
})
export class PrismaDatabaseModule {}
