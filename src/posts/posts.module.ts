import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaDatabaseModule } from 'src/prisma-database/prisma-database.module';

@Module({
  imports: [PrismaDatabaseModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
