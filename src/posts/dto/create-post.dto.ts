import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  authorId: string;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsInt()
  collegeId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  media_urls: string[];
}
