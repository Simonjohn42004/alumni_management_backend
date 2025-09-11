import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EducationService } from './education.service';
import { Prisma } from 'generated/prisma';
import { EducationDto } from './dto/create-educations.dto';
import { UpdateEducationDto } from './dto/update-educations.dto';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  create(@Body() createEducationDto: EducationDto) {
    return this.educationService.create(createEducationDto);
  }

  @Get()
  findAll(@Query('id') id?: string) {
    return this.educationService.findAll(id);
  }

  // Composite key: id, schoolName, degree
  @Get(':id/:schoolName/:degree')
  findOne(
    @Param('id') id: string,
    @Param('schoolName') schoolName: string,
    @Param('degree') degree: string,
  ) {
    return this.educationService.findOne(id, schoolName, degree);
  }

  @Patch(':id/:schoolName/:degree')
  update(
    @Param('id') id: string,
    @Param('schoolName') schoolName: string,
    @Param('degree') degree: string,
    @Body() updateEducationDto: UpdateEducationDto,
  ) {
    return this.educationService.update(
      id,
      schoolName,
      degree,
      updateEducationDto,
    );
  }

  @Delete(':id/:schoolName/:degree')
  remove(
    @Param('id') id: string,
    @Param('schoolName') schoolName: string,
    @Param('degree') degree: string,
  ) {
    return this.educationService.remove(id, schoolName, degree);
  }
}
