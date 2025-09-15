import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { CreateDonationDto } from './dto/create-donation.dto';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  async create(@Body() createDonationDto: CreateDonationDto) {
    return await this.donationsService.create(createDonationDto);
  }

  @Get()
  async findAll() {
    return await this.donationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.donationsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDonationDto: UpdateDonationDto,
  ) {
    return await this.donationsService.update(+id, updateDonationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.donationsService.remove(+id);
  }
}
