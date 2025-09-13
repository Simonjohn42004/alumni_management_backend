import { IsInt, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostCommentDto {
  @IsInt()
  postId: number;

  @IsString()
  @IsNotEmpty()
  commenterId: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsOptional()
  createdAt?: Date; // usually optional, defaults to DB now()
}
