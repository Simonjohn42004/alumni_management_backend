import { PartialType } from '@nestjs/mapped-types';
import { EducationDto } from './create-educations.dto';

export class UpdateEducationDto extends PartialType(EducationDto) {}
