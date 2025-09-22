import { SetMetadata } from '@nestjs/common';
import { RequiredPermission, PERMISSIONS_KEY } from '../guards/roles.guard';

export const RequirePermissions = (...permissions: RequiredPermission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
