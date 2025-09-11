import { Injectable } from '@nestjs/common';
import { Educations, Prisma } from 'generated/prisma/client';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { EducationDto } from './dto/create-educations.dto';
import { UpdateEducationDto } from './dto/update-educations.dto';
@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaDatabaseService) {}

  // Create a new education record using the CreateEducationDto
  async create(createEducationDto: EducationDto): Promise<Educations> {
    const prismaInput: Prisma.EducationsCreateInput = {
      id: createEducationDto.id,
      schoolName: createEducationDto.schoolName,
      degree: createEducationDto.degree,
      fieldOfStudy: createEducationDto.fieldOfStudy,
      startDate: createEducationDto.startDate,
      endDate: createEducationDto.endDate,
      cgpa: createEducationDto.cgpa,
      description: createEducationDto.description,
    };
    return await this.prisma.educations.create({
      data: prismaInput,
    });
  }

  // Get all education records (optional filter by userId)
  async findAll(userId?: string): Promise<Educations[]> {
    return await this.prisma.educations.findMany({
      where: userId ? { id: userId } : undefined,
    });
  }

  // Get one education record by composite key
  async findOne(
    id: string,
    schoolName: string,
    degree: string,
  ): Promise<Educations | null> {
    return await this.prisma.educations.findUnique({
      where: {
        id_schoolName_degree: {
          id,
          schoolName,
          degree,
        },
      },
    });
  }

  // Update an education record by composite key using UpdateEducationDto
  async update(
    id: string,
    schoolName: string,
    degree: string,
    updateEducationDto: UpdateEducationDto,
  ): Promise<Educations> {
    const prismaUpdateInput: Prisma.EducationsUpdateInput = {
      ...updateEducationDto, // spread properties from DTO which are optional
    };

    return await this.prisma.educations.update({
      where: {
        id_schoolName_degree: {
          id,
          schoolName,
          degree,
        },
      },
      data: prismaUpdateInput,
    });
  }

  // Delete an education record by composite key
  async remove(
    id: string,
    schoolName: string,
    degree: string,
  ): Promise<Educations> {
    return await this.prisma.educations.delete({
      where: {
        id_schoolName_degree: {
          id,
          schoolName,
          degree,
        },
      },
    });
  }
}
