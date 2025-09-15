import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaDatabaseService) {}
  async create(posts: CreatePostDto | CreatePostDto[]) {
    if (Array.isArray(posts)) {
      // createMany expects data array; note it skips nested writes and returns count
      return this.prisma.posts.createMany({
        data: posts,
        skipDuplicates: true, // optional to skip duplicates on unique keys
      });
    } else {
      return this.prisma.posts.create({
        data: posts,
      });
    }
  }

  async findAll() {
    return this.prisma.posts.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        authorId: true,
        createdAt: true,
        title: true,
        content: true,
        media_urls: true,
        author: {
          select: {
            fullName: true,
            department: true,
          },
        },
        _count: {
          select: { postLikes: true, postComments: true, postSaves: true },
        },
        
      },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.posts.findUnique({
      where: { id },
      include: {
        author: true,
        postComments: true,
        postTags: true,
        postSaves: true,
        _count: {
          select: { postLikes: true, postComments: true, postSaves: true },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      return await this.prisma.posts.update({
        where: { id },
        data: {
          ...updatePostDto,
        },
      });
    } catch (e) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.posts.delete({ where: { id } });
    } catch (e) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }
}
