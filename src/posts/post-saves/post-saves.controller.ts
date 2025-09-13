import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Delete,
} from '@nestjs/common';
import { PostSavesService } from './post-saves.service';
import { CreatePostSaveDto } from './dto/create-post-save.dto';
import { UpdatePostSaveDto } from './dto/update-post-save.dto';

@Controller('post-saves')
export class PostSavesController {
  constructor(private readonly postSavesService: PostSavesService) {}

  @Post()
  create(@Body() createPostSaveDto: CreatePostSaveDto) {
    return this.postSavesService.create(createPostSaveDto);
  }
  
  @Get()
  findAll(@Query('savedBy') savedBy?: string) {
    return this.postSavesService.findAll(savedBy);
  }

  /**
   * Use query params to specify composite key: postId and savedBy
   */
  @Get('status')
  findOne(@Query('postId') postId: string, @Query('savedBy') savedBy: string) {
    return this.postSavesService.findOne(+postId, savedBy);
  }

  /**
   * Update is unsupported but included for completeness
   */
  @Patch()
  update(
    @Query('postId') postId: string,
    @Query('savedBy') savedBy: string,
    @Body() updatePostSaveDto: UpdatePostSaveDto,
  ) {
    return this.postSavesService.update(+postId, savedBy, updatePostSaveDto);
  }

  @Delete()
  remove(@Query('postId') postId: string, @Query('savedBy') savedBy: string) {
    return this.postSavesService.remove(+postId, savedBy);
  }
}
