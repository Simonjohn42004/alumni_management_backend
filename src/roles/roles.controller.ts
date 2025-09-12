import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleDto } from './dto/roles.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get(':id/permissions')
  async getRoleWithPermissions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RoleDto> {
    try {
      const role = await this.rolesService.findRoleWithPermissions(id);
      return role;
    } catch (error) {
      if (error.message === 'Role not found') {
        throw new NotFoundException(`Role with id ${id} not found`);
      }
      throw error; // propagate other errors
    }
  }
}
