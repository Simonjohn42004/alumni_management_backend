import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
@Injectable()
export class PostCommentsService {
  findAllByPostId(id: number) {
    const comments = this.prisma.postComments.findMany({
      where: { postId: id },
      include: {
        commenter: {
          select: {
            fullName: true,
            profilePicture: true,
            roleId: true,
            department: true,
          },
        },
      },
    });
    if (!comments) {
      throw new NotFoundException(`Comments for Post with id ${id} not found`);
    }
    return comments;
  }
  constructor(private readonly prisma: PrismaDatabaseService) {}

  async create(createPostCommentDto: CreatePostCommentDto) {
    return this.prisma.postComments.create({
      data: {
        ...createPostCommentDto,
      },
    });
  }

  async findAll() {
    return this.prisma.postComments.findMany({
      include: {
        post: true,
        commenter: true,
        PostTags: true,
      },
    });
  }

  // async findOne(id: number) {
  //   const comment = await this.prisma.postComments.findUnique({
  //     where: { id },
  //     include: {
  //       post: true,
  //       commenter: true,
  //       PostTags: true,
  //     },
  //   });
  //   if (!comment) {
  //     throw new NotFoundException(`Post comment with id ${id} not found`);
  //   }
  //   return comment;
  // }

  async update(id: number, updatePostCommentDto: UpdatePostCommentDto) {
    try {
      return await this.prisma.postComments.update({
        where: { id: id },
        data: {
          ...updatePostCommentDto,
        },
      });
    } catch (e) {
      throw new NotFoundException(`Post comment with id ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.postComments.delete({
        where: { id },
      });
    } catch (e) {
      throw new NotFoundException(`Post comment with id ${id} not found`);
    }
  }
}
