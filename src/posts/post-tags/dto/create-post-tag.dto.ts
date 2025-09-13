import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreatePostTagDto {
  @IsInt()
  @Min(1)
  postId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  commentId?: number | null;

  @IsString()
  @IsUUID()
  taggedUserId: string;

  @IsString()
  @IsUUID()
  taggedBy: string;
}
