import { Injectable } from '@nestjs/common';
import { PrismaDatabaseService } from 'src/prisma-database/prisma-database.service';
import { RoleDto } from './dto/roles.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaDatabaseService) {}

  async findRoleWithPermissions(roleId: number): Promise<RoleDto> {
    const role = await this.prisma.roles.findUnique({
      where: { id: roleId },
      include: { Permissions: true },
    });

    if (!role) {
      throw new Error('Role not found');
    }

    return new RoleDto({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.Permissions.map(
        (p) =>
          ({
            featureName: p.featureName,
            canCreate: p.canCreate,
            canRead: p.canRead,
            canUpdateOwn: p.canUpdateOwn,
            canUpdateAny: p.canUpdateAny,
            canDeleteOwn: p.canDeleteOwn,
            canDeleteAny: p.canDeleteAny,
          }) as any,
      ),
    });
  }
}
