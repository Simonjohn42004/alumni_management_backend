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
import { CampaignUpdatesService } from './campaign-updates.service';
import { CreateCampaignUpdateDto } from './dto/create-campaign-update.dto';
import { UpdateCampaignUpdateDto } from './dto/update-campaign-update.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/roles.guard';
import { GenericOwnershipGuard } from 'src/auth/guards/generic-ownership.guard';
import { FeatureName } from 'generated/prisma/client';
import { RequirePermissions } from 'src/auth/decorators/permission.decorator';

@ApiTags('campaign-updates')
@ApiBearerAuth()
@Controller('campaign-updates')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CampaignUpdatesController {
  constructor(
    private readonly campaignUpdatesService: CampaignUpdatesService,
  ) {}

  @Post()
  @RequirePermissions({
    feature: FeatureName.campaignUpdates,
    action: 'create',
  })
  async create(@Body() createCampaignUpdateDto: CreateCampaignUpdateDto) {
    return await this.campaignUpdatesService.create(createCampaignUpdateDto);
  }

  @Get()
  @RequirePermissions({ feature: FeatureName.campaignUpdates, action: 'read' })
  async findAll() {
    return await this.campaignUpdatesService.findAll();
  }

  @Get(':id')
  @RequirePermissions({ feature: FeatureName.campaignUpdates, action: 'read' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.campaignUpdatesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(GenericOwnershipGuard)
  @RequirePermissions({
    feature: FeatureName.campaignUpdates,
    action: 'updateOwn',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCampaignUpdateDto: UpdateCampaignUpdateDto,
  ) {
    return await this.campaignUpdatesService.update(
      id,
      updateCampaignUpdateDto,
    );
  }

  @Delete(':id')
  @UseGuards(GenericOwnershipGuard)
  @RequirePermissions({
    feature: FeatureName.campaignUpdates,
    action: 'deleteOwn',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.campaignUpdatesService.remove(id);
  }
}
