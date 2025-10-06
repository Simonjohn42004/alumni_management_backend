import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { Prisma, Job } from 'generated/prisma/client';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaDatabaseService) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const prismaInput: Prisma.JobCreateInput = {
      title: createJobDto.title,
      description: createJobDto.description,
      location: createJobDto.location,
      salary: createJobDto.salary,
      employmentType: createJobDto.employmentType,
      postedBy: {
        connect: { id: createJobDto.postedById },
      },
      postedAt: new Date(),
      tags: createJobDto.tags,
      isActive: createJobDto.isActive ?? true,
    };

    return await this.prisma.job.create({
      data: prismaInput,
    });
  }

  async findAll(): Promise<Job[]> {
    return await this.prisma.job.findMany();
  }

  async findOne(id: number): Promise<Job | null> {
    const job = await this.prisma.job.findUnique({
      where: { id },
    });
    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }
    return job;
  }

  async update(id: number, updateJobDto: UpdateJobDto): Promise<Job> {
    // Ownership validation should be done via guard or additional param check here

    // Verify that job exists
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    return await this.prisma.job.update({
      where: { id },
      data: updateJobDto as Prisma.JobUpdateInput,
    });
  }

  async remove(id: number): Promise<Job> {
    // Ownership validation should be done via guard or additional param check here

    // Verify that job exists
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    return await this.prisma.job.delete({
      where: { id },
    });
  }
}
