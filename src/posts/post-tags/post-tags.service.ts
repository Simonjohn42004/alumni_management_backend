import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UpdatePostTagDto } from './dto/update-post-tag.dto';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { CreatePostTagDto } from './dto/create-post-tag.dto';

@Injectable()
export class PostTagsService {
  constructor(private prisma: PrismaDatabaseService) {}

  async create(createPostTagDto: CreatePostTagDto) {
    const { postId, commentId, taggedUserId, taggedBy } = createPostTagDto;

    if (commentId !== null && commentId !== undefined && commentId <= 0) {
      throw new BadRequestException('Invalid commentId for tagging a comment.');
    }

    return this.prisma.postTags.create({
      data: {
        postId,
        commentId: commentId ?? null,
        taggedUserId,
        taggedBy,
      },
    });
  }

  async findAll() {
    return this.prisma.postTags.findMany({
      include: {
        post: true,
        comment: true,
        taggedUser: true,
        taggedByUser: true,
      },
    });
  }

  async findOne(id: number) {
    const tag = await this.prisma.postTags.findUnique({
      where: { id },
      include: {
        post: true,
        comment: true,
        taggedUser: true,
        taggedByUser: true,
      },
    });
    if (!tag) {
      throw new NotFoundException(`PostTag with ID ${id} not found`);
    }
    return tag;
  }

  async update(id: number, updatePostTagDto: UpdatePostTagDto) {
    const existingTag = await this.prisma.postTags.findUnique({
      where: { id },
    });
    if (!existingTag) {
      throw new NotFoundException(`PostTag with ID ${id} not found`);
    }

    if (
      updatePostTagDto.commentId !== null &&
      updatePostTagDto.commentId !== undefined &&
      updatePostTagDto.commentId <= 0
    ) {
      throw new BadRequestException('Invalid commentId for tagging a comment.');
    }

    return this.prisma.postTags.update({
      where: { id },
      data: {
        postId: updatePostTagDto.postId ?? existingTag.postId,
        commentId: updatePostTagDto.commentId ?? existingTag.commentId,
        taggedUserId: updatePostTagDto.taggedUserId ?? existingTag.taggedUserId,
        taggedBy: updatePostTagDto.taggedBy ?? existingTag.taggedBy,
      },
    });
  }

  async remove(id: number) {
    const existingTag = await this.prisma.postTags.findUnique({
      where: { id },
    });
    if (!existingTag) {
      throw new NotFoundException(`PostTag with ID ${id} not found`);
    }

    return this.prisma.postTags.delete({ where: { id } });
  }
}
