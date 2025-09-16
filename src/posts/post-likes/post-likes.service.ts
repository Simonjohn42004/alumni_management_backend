import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { CreatePostLikeDto } from './dto/create-post-likes.dto';

@Injectable()
export class PostLikesService {
  constructor(private readonly prisma: PrismaDatabaseService) {}

  // Like a post
  async create(createPostLikeDto: CreatePostLikeDto) {
    try {
      return await this.prisma.postLikes.create({
        data: {
          postId: createPostLikeDto.postId,
          userId: createPostLikeDto.userId,
        },
      });
    } catch (e) {
      // Handle unique constraint violation (already liked)
      if (e.code === 'P2002') {
        return { message: 'Post already liked by this user' };
      }
      throw e;
    }
  }

  async countLikes(postId: number): Promise<number> {
    return await this.prisma.postLikes.count({ where: { postId } });
  }

  async findPostIdsLikedByUser(userId: string): Promise<number[]> {
    const likes = await this.prisma.postLikes.findMany({
      where: { userId },
      select: { postId: true }, // select only postId to optimize
    });

    return likes.map((like) => like.postId);
  }

  async findAll(postId?: number) {
    const whereClause = postId !== undefined ? { postId } : {};

    return this.prisma.postLikes.findMany({
      where: whereClause,
    });
  }

  // Get a post like by composite key simulated by returning the first match by postId or userId
  async findOne(postId: number, userId: string) {
    const like = await this.prisma.postLikes.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (!like) {
      throw new NotFoundException(
        `Like for post ${postId} by user ${userId} not found`,
      );
    }
    return like;
  }

  // PostLikes usually don't have update operation; thrown here for completion
  async update(postId: number, userId: string, updatePostLikeDto: any) {
    throw new NotFoundException('PostLikes update is not supported');
  }

  // Unlike (delete) a post like
  async remove(postId: number, userId: string) {
    try {
      return await this.prisma.postLikes.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
    } catch (e) {
      throw new NotFoundException(
        `Like for post ${postId} by user ${userId} not found`,
      );
    }
  }
}
