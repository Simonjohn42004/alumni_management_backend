import {
  IsString,
  IsOptional,
  IsDate,
  IsDecimal,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEducationDto {
  @IsString()
  userId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  schoolName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  degree: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  fieldOfStudy?: string;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsString() // Prisma Decimal is represented as string in JS/TS
  cgpa: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
