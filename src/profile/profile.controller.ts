// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { ProfileService } from './profile.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

// @Controller('profile')
// export class ProfileController {
//   constructor(private readonly profileService: ProfileService) {}

//   @Post()
//   async create(@Body() createProfileDto: CreateUserDto) {
//     return await this.profileService.create(createProfileDto);
//   }

//   @Get()
//   async findAll() {
//     return await this.profileService.findAll();
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     return await this.profileService.findOne(id);
//   }

//   @Patch(':id')
//   async update(
//     @Param('id') id: string,
//     @Body() updateProfileDto: UpdateUserDto,
//   ) {
//     return await this.profileService.update(id, updateProfileDto);
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: string) {
//     return await this.profileService.remove(id);
//   }
// }




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
import { ProfileService } from './profile.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/roles.guard';
import { FeatureName } from 'generated/prisma';
import { RequirePermissions } from 'src/auth/decorators/permission.decorator';

@Controller('profile')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @RequirePermissions({ feature: FeatureName.profiles, action: 'create' })
  async create(@Body() createProfileDto: CreateUserDto) {
    // Optionally link createdBy/owner to requesting user if applicable
    return await this.profileService.create(createProfileDto);
  }

  @Get()
  @RequirePermissions({ feature: FeatureName.profiles, action: 'read' })
  async findAll() {
    return await this.profileService.findAll();
  }

  @Get(':id')
  @RequirePermissions({ feature: FeatureName.profiles, action: 'read' })
  async findOne(@Param('id') id: string) {
    return await this.profileService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions({ feature: FeatureName.profiles, action: 'updateOwn' })
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateUserDto,
  ) {
    // Check if current user owns this profile (or has updateAny permission via guard)
    return await this.profileService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @RequirePermissions({ feature: FeatureName.profiles, action: 'deleteOwn' })
  async remove(@Param('id') id: string) {
    return await this.profileService.remove(id);
  }
}
