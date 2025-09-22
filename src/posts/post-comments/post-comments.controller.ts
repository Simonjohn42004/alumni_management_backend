// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   ParseIntPipe,
// } from '@nestjs/common';
// import { PostCommentsService } from './post-comments.service';
// import { CreatePostCommentDto } from './dto/create-post-comment.dto';
// import { UpdatePostCommentDto } from './dto/update-post-comment.dto';

// @Controller('post-comments')
// export class PostCommentsController {
//   constructor(private readonly postCommentsService: PostCommentsService) {}

//   @Post()
//   create(@Body() createPostCommentDto: CreatePostCommentDto) {
//     return this.postCommentsService.create(createPostCommentDto);
//   }

//   @Get()
//   findAll() {
//     return this.postCommentsService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id', ParseIntPipe) id: number) {
//     return this.postCommentsService.findOne(id);
//   }

//   @Patch(':id')
//   update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updatePostCommentDto: UpdatePostCommentDto,
//   ) {
//     return this.postCommentsService.update(id, updatePostCommentDto);
//   }

//   @Delete(':id')
//   remove(@Param('id', ParseIntPipe) id: number) {
//     return this.postCommentsService.remove(id);
//   }
// }

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostCommentsService } from './post-comments.service';
import { RequirePermissions } from 'src/auth/decorators/permission.decorator';
import { FeatureName } from 'generated/prisma/client';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/roles.guard';
import { GenericOwnershipGuard } from 'src/auth/guards/generic-ownership.guard';

@ApiTags('post-comments')
@ApiBearerAuth()
@Controller('post-comments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PostCommentsController {
  constructor(private readonly postCommentsService: PostCommentsService) {}

  @Get()
  @RequirePermissions({ feature: FeatureName.postComments, action: 'read' })
  findAll() {
    return this.postCommentsService.findAll();
  }

  @Get(':id')
  @RequirePermissions({ feature: FeatureName.postComments, action: 'read' })
  findAllById(@Param('id', ParseIntPipe) id: number) {
    return this.postCommentsService.findAllByPostId(id);
  }

  // @Get(':id')
  // @RequirePermissions({ feature: FeatureName.posts, action: 'read' })
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.postCommentsService.findOne(id);
  // }

  @Post()
  @RequirePermissions({ feature: FeatureName.postComments, action: 'create' })
  create(@Body() createPostCommentDto: CreatePostCommentDto) {
    return this.postCommentsService.create(createPostCommentDto);
  }

  @Patch(':id')
  @UseGuards(GenericOwnershipGuard)
  @RequirePermissions({
    feature: FeatureName.postComments,
    action: 'updateOwn',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostCommentDto: UpdatePostCommentDto,
  ) {
    return this.postCommentsService.update(id, updatePostCommentDto);
  }

  @Delete(':id')
  @UseGuards(GenericOwnershipGuard)
  @RequirePermissions({
    feature: FeatureName.postComments,
    action: 'deleteOwn',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postCommentsService.remove(id);
  }
}
