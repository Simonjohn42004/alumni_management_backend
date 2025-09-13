import { Module } from '@nestjs/common';
import { PostTagsService } from './post-tags.service';
import { PostTagsController } from './post-tags.controller';
import { PrismaDatabaseModule } from 'src/prisma-database/prisma-database.module';

@Module({
  imports: [PrismaDatabaseModule],
  controllers: [PostTagsController],
  providers: [PostTagsService],
})
export class PostTagsModule {}
