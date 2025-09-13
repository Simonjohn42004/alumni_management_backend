import { Module } from '@nestjs/common';
import { PostSavesService } from './post-saves.service';
import { PostSavesController } from './post-saves.controller';
import { PrismaDatabaseModule } from 'src/prisma-database/prisma-database.module';

@Module({
  imports: [PrismaDatabaseModule],
  controllers: [PostSavesController],
  providers: [PostSavesService],
})
export class PostSavesModule {}
