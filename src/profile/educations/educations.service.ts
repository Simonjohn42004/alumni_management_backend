import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { Prisma } from 'generated/prisma/client';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationsService {
  constructor(private readonly prisma: PrismaDatabaseService) {}

  async create(createEducationDto: CreateEducationDto) {
    return this.prisma.educations.create({
      data: {
        ...createEducationDto,
        cgpa: new Prisma.Decimal(createEducationDto.cgpa),
      },
    });
  }

  async findAll() {
    return this.prisma.educations.findMany();
  }

  async findOne(id: number) {
    const education = await this.prisma.educations.findUnique({
      where: { id },
    });
    if (!education) {
      throw new NotFoundException(`Education with id ${id} not found`);
    }
    return education;
  }

  async update(id: number, updateEducationDto: UpdateEducationDto) {
    try {
      return await this.prisma.educations.update({
        where: { id },
        data: {
          ...updateEducationDto,
          ...(updateEducationDto.cgpa && {
            cgpa: new Prisma.Decimal(updateEducationDto.cgpa),
          }),
        },
      });
    } catch (e) {
      throw new NotFoundException(`Education with id ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.educations.delete({ where: { id } });
    } catch (e) {
      throw new NotFoundException(`Education with id ${id} not found`);
    }
  }
}
