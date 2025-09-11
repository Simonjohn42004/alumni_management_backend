import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsEmail,
  IsOptional,
  IsEnum,
  IsArray,
  IsDate,
  MaxLength,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';

// Enum from your Prisma schema
export enum Department {
  COMPUTER_SCIENCE_ENGINEERING = 'COMPUTER_SCIENCE_ENGINEERING',
  COMPUTER_SCIENCE_BUSINESS_SYSTEMS = 'COMPUTER_SCIENCE_BUSINESS_SYSTEMS',
  ARTIFICIAL_INTELLIGENCE_DATA_SCIENCE = 'ARTIFICIAL_INTELLIGENCE_DATA_SCIENCE',
  ARTIFICIAL_INTELLIGENCE_MACHINE_LEARNING = 'ARTIFICIAL_INTELLIGENCE_MACHINE_LEARNING',
  MECHANICAL_AUTOMATION_ENGINEERING = 'MECHANICAL_AUTOMATION_ENGINEERING',
  INTERNET_OF_THINGS = 'INTERNET_OF_THINGS',
  CYBERSECURITY = 'CYBERSECURITY',
  COMPUTER_COMMUNICATION_ENGINEERING = 'COMPUTER_COMMUNICATION_ENGINEERING',
  ELECTRICAL_INSTRUMENTATION_ENGINEERING = 'ELECTRICAL_INSTRUMENTATION_ENGINEERING',
  INSTRUMENTATION_CONTROL_ENGINEERING = 'INSTRUMENTATION_CONTROL_ENGINEERING',
  INFORMATION_TECHNOLOGY = 'INFORMATION_TECHNOLOGY',
  MECHANICAL_ENGINEERING = 'MECHANICAL_ENGINEERING',
  ELECTRICAL_ELECTRONICS_ENGINEERING = 'ELECTRICAL_ELECTRONICS_ENGINEERING',
  CIVIL_ENGINEERING = 'CIVIL_ENGINEERING',
  ELECTRONICS_COMMUNICATION_ENGINEERING = 'ELECTRONICS_COMMUNICATION_ENGINEERING',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsInt()
  @Min(1)
  @Max(3)
  roleId: number;

  @IsString()
  @MaxLength(255)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(255)
  passwordHash: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  phoneNumber: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsInt()
  graduationYear: number;

  @IsOptional()
  @IsString()
  currentPosition?: string;

  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @IsInt()
  collegeId: number;

  @IsEnum(Department)
  department: Department;

  @IsArray()
  @IsString({ each: true })
  skillSets: string[];
}
