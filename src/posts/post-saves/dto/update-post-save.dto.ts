import { PartialType } from '@nestjs/mapped-types';
import { CreatePostCommentDto } from 'src/posts/post-comments/dto/create-post-comment.dto';
import { CreatePostSaveDto } from './create-post-save.dto';

export class UpdatePostSaveDto extends PartialType(CreatePostSaveDto) {}
