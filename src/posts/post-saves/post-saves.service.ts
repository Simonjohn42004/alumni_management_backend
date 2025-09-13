import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdatePostSaveDto } from './dto/update-post-save.dto';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { CreatePostSaveDto } from './dto/create-post-save.dto';

@Injectable()
export class PostSavesService {
  constructor(private readonly prisma: PrismaDatabaseService) {}

  async create(createPostSaveDto: CreatePostSaveDto) {
    try {
      return await this.prisma.postSaves.create({
        data: {
          postId: createPostSaveDto.postId,
          savedBy: createPostSaveDto.savedBy,
        },
      });
    } catch (e) {
      // Handle unique constraint violation (already saved)
      if (e.code === 'P2002') {
        return { message: 'Post already saved by this user' };
      }
      throw e;
    }
  }

  async findAll(savedBy?: string) {
    return this.prisma.postSaves.findMany({
      where: savedBy ? { savedBy } : undefined,
      include: {
        post: true,
      },
    });
  }

  async findOne(postId: number, savedBy: string) {
    const save = await this.prisma.postSaves.findUnique({
      where: {
        postId_savedBy: {
          postId,
          savedBy,
        },
      },
      include: {
        post: true,
      },
    });
    if (!save) {
      throw new NotFoundException(
        `Post save for post ${postId} by user ${savedBy} not found`,
      );
    }
    return save;
  }

  // Typically, post saves are not updated, only created or deleted.
  async update(
    postId: number,
    savedBy: string,
    updatePostSaveDto: UpdatePostSaveDto,
  ) {
    throw new NotFoundException('PostSaves update is not supported');
  }

  async remove(postId: number, savedBy: string) {
    try {
      return await this.prisma.postSaves.delete({
        where: {
          postId_savedBy: {
            postId,
            savedBy,
          },
        },
      });
    } catch (e) {
      throw new NotFoundException(
        `Post save for post ${postId} by user ${savedBy} not found`,
      );
    }
  }
}
