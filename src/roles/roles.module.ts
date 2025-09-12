import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismaDatabaseModule } from 'src/prisma-database/prisma-database.module';

@Module({
  imports: [PrismaDatabaseModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
