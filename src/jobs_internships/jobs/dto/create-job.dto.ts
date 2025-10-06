import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsPositive } from 'class-validator';
import { EmploymentType } from 'generated/prisma';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  salary?: number;

  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @IsString()
  @IsNotEmpty()
  postedById: string;

  @IsOptional()
  tags?: string[];

  @IsOptional()
  isActive?: boolean;
}
