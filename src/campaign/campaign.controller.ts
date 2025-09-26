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
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  PermissionsGuard,
  RequiredPermission,
} from 'src/auth/guards/roles.guard';
import { GenericOwnershipGuard } from 'src/auth/guards/generic-ownership.guard';
import { FeatureName } from 'generated/prisma/client';
import { RequirePermissions } from 'src/auth/decorators/permission.decorator';

@ApiTags('campaign')
@ApiBearerAuth()
@Controller('campaign')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @RequirePermissions({ feature: FeatureName.fundraising, action: 'create' })
  create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignService.create(createCampaignDto);
  }

  @Get()
  @RequirePermissions({ feature: FeatureName.fundraising, action: 'read' })
  findAll() {
    return this.campaignService.findAll();
  }

  @Get(':id')
  @RequirePermissions({ feature: FeatureName.fundraising, action: 'read' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.campaignService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(GenericOwnershipGuard)
  @RequirePermissions({ feature: FeatureName.fundraising, action: 'updateOwn' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCampaignDto: CreateCampaignDto,
  ) {
    return this.campaignService.update(id, updateCampaignDto);
  }

  @Delete(':id')
  @UseGuards(GenericOwnershipGuard)
  @RequirePermissions({ feature: FeatureName.fundraising, action: 'deleteOwn' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.campaignService.remove(id);
  }
}
