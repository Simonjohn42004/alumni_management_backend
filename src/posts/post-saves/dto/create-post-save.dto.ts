import { IsInt, IsString } from 'class-validator';

export class CreatePostSaveDto {
  @IsInt()
  postId: number;

  @IsString()
  savedBy: string;
}
