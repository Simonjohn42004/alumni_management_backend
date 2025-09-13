import { Controller, Get, Post, Body, Patch, Query, Delete } from '@nestjs/common';
import { PostLikesService } from './post-likes.service';
import { CreatePostLikeDto } from './dto/create-post-likes.dto';

@Controller('post-likes')
export class PostLikesController {
  constructor(private readonly postLikesService: PostLikesService) {}

  @Post()
  create(@Body() createPostLikeDto: CreatePostLikeDto) {
    return this.postLikesService.create(createPostLikeDto);
  }

  @Get()
  findAll() {
    return this.postLikesService.findAll();
  }

  /**
   * Since PostLikes uses composite keys, findOne uses query params.
   */
  @Get('status')
  findOne(@Query('postId') postId: string, @Query('userId') userId: string) {
    return this.postLikesService.findOne(+postId, userId);
  }

  /**
   * Update is unsupported - route kept for completeness.
   */
  @Patch()
  update(
    @Query('postId') postId: string,
    @Query('userId') userId: string,
    @Body() updatePostLikeDto: any,
  ) {
    return this.postLikesService.update(+postId, userId, updatePostLikeDto);
  }

  @Delete()
  remove(@Query('postId') postId: string, @Query('userId') userId: string) {
    return this.postLikesService.remove(+postId, userId);
  }

  /**
   * New endpoint - get the count of likes for a post
   */
  @Get('count')
  count(@Query('postId') postId: string) {
    return this.postLikesService.countLikes(+postId);
  }
}
