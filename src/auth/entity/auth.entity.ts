import { ApiProperty } from '@nestjs/swagger';
import { FeatureName } from 'generated/prisma';
export class AuthEntity {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: {
    id: string;
    fullName: string;
    email: string;
    roleId: number;
    permissions: UserPermission[];
  };
}

export interface UserPermission {
  featureName: FeatureName;
  canCreate: boolean;
  canRead: boolean;
  canUpdateOwn: boolean;
  canUpdateAny: boolean;
  canDeleteOwn: boolean;
  canDeleteAny: boolean;
}
