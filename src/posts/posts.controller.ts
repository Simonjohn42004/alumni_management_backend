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
// import { PostsService } from './posts.service';
// import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';

// @Controller('posts')
// export class PostsController {
//   constructor(private readonly postsService: PostsService) {}

//   @Post()
//   create(@Body() createPostDto: CreatePostDto) {
//     return this.postsService.create(createPostDto);
//   }

//   @Get()
//   findAll() {
//     return this.postsService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id', ParseIntPipe) id: number) {
//     return this.postsService.findOne(id);
//   }

//   @Patch(':id')
//   update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updatePostDto: UpdatePostDto,
//   ) {
//     return this.postsService.update(id, updatePostDto);
//   }

//   @Delete(':id')
//   remove(@Param('id', ParseIntPipe) id: number) {
//     return this.postsService.remove(id);
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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/roles.guard';
import { PostsService } from './posts.service';
import { RequirePermissions } from 'src/auth/decorators/permission.decorator';
import { FeatureName } from 'generated/prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  @RequirePermissions({ feature: FeatureName.posts, action: 'read' })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @RequirePermissions({ feature: FeatureName.posts, action: 'read' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Post()
  @RequirePermissions({ feature: FeatureName.posts, action: 'create' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Put(':id')
  @RequirePermissions({ feature: FeatureName.posts, action: 'updateOwn' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @RequirePermissions({ feature: FeatureName.posts, action: 'deleteOwn' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
