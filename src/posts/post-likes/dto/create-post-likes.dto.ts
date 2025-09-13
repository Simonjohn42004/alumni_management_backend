import { IsInt, IsString } from 'class-validator';

export class CreatePostLikeDto {
  @IsInt()
  postId: number;

  @IsString()
  userId: string;
}
