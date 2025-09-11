import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsDate,
  MaxLength,
  IsDecimal,
  Matches,
  ValidateIf,
} from 'class-validator';

export class EducationDto {
  @IsString()
  id: string;

  @IsString()
  @MaxLength(255)
  schoolName: string;

  @IsString()
  @MaxLength(255)
  degree: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  fieldOfStudy?: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  // Validate Decimal as string with precision 3 and scale 2 pattern, e.g. 9.99
  @Matches(/^\d{1}\.\d{2}$/, {
    message:
      'cgpa must have 1 digit before and 2 digits after decimal (e.g. 9.99)',
  })
  cgpa: string;

  @IsOptional()
  @IsString()
  description?: string;
}
