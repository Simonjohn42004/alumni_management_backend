import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionDto } from './permissions.dto';

export class RoleDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];

  constructor(partial: Partial<RoleDto>) {
    Object.assign(this, partial);
  }
}
