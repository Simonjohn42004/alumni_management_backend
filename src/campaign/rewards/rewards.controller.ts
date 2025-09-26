import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/roles.guard';
import { GenericOwnershipGuard } from 'src/auth/guards/generic-ownership.guard';
import { FeatureName } from 'generated/prisma/client';
import { RequirePermissions } from 'src/auth/decorators/permission.decorator';

@ApiTags('rewards')
@ApiBearerAuth()
@Controller('rewards')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  @RequirePermissions({ feature: FeatureName.rewards, action: 'create' })
  async create(@Body() createRewardDto: CreateRewardDto) {
    return await this.rewardsService.create(createRewardDto);
  }

  @Get()
  @RequirePermissions({ feature: FeatureName.rewards, action: 'read' })
  async findAll() {
    return await this.rewardsService.findAll();
  }

  @Get(':id')
  @RequirePermissions({ feature: FeatureName.rewards, action: 'read' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.rewardsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(GenericOwnershipGuard)
  @RequirePermissions({ feature: FeatureName.rewards, action: 'updateOwn' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRewardDto: UpdateRewardDto,
  ) {
    return await this.rewardsService.update(id, updateRewardDto);
  }

  @Delete(':id')
  @UseGuards(GenericOwnershipGuard)
  @RequirePermissions({ feature: FeatureName.rewards, action: 'deleteOwn' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.rewardsService.remove(id);
  }
}
