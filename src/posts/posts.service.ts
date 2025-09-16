import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaDatabaseService) {}

  async create(createPostDto: CreatePostDto) {
    if (!createPostDto.title || !createPostDto.authorId) {
      throw new BadRequestException('Title and authorId are required');
    }
    // Default empty array if mediaUrls is not provided
    const mediaUrls = createPostDto.media_urls ?? [];

    return this.prisma.posts.create({
      data: {
        title: createPostDto.title,
        authorId: createPostDto.authorId,
        content: createPostDto.content ?? null,
        media_urls: mediaUrls,
        collegeId: createPostDto.collegeId,
        // assume collegeId is handled elsewhere or add validation here if mandatory
      },
    });
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
        author: true,
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
    const updateData: Partial<typeof updatePostDto> = {};

    if (updatePostDto.title !== undefined)
      updateData.title = updatePostDto.title;
    if (updatePostDto.content !== undefined)
      updateData.content = updatePostDto.content;
    if (updatePostDto.media_urls !== undefined)
      updateData.media_urls = updatePostDto.media_urls;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException(
        'At least one field (title, content, mediaUrls) must be provided to update',
      );
    }

    try {
      return await this.prisma.posts.update({
        where: { id },
        data: updateData,
      });
    } catch {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.posts.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }
}
