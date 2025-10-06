import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/roles.guard';
import { GenericOwnershipGuard } from '../../auth/guards/generic-ownership.guard'; // Import ownership guard
import { FeatureName } from 'generated/prisma';
import { RequirePermissions } from 'src/auth/decorators/permission.decorator';

@Controller('jobs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @RequirePermissions({ feature: FeatureName.jobs, action: 'create' })
  async create(@Body() createJobDto: CreateJobDto) {
    return await this.jobsService.create(createJobDto);
  }

  @Get()
  @RequirePermissions({ feature: FeatureName.jobs, action: 'read' })
  async findAll() {
    return await this.jobsService.findAll();
  }

  @Get(':id')
  @RequirePermissions({ feature: FeatureName.jobs, action: 'read' })
  async findOne(@Param('id') id: number) {
    return await this.jobsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(GenericOwnershipGuard) // Ownership guard for updateOwn
  @RequirePermissions({ feature: FeatureName.jobs, action: 'updateOwn' })
  async update(@Param('id') id: number, @Body() updateJobDto: UpdateJobDto) {
    return await this.jobsService.update(id, updateJobDto);
  }

  @Delete(':id')
  @UseGuards(GenericOwnershipGuard) // Ownership guard for deleteOwn
  @RequirePermissions({ feature: FeatureName.jobs, action: 'deleteOwn' })
  async remove(@Param('id') id: number) {
    return await this.jobsService.remove(id);
  }
}
