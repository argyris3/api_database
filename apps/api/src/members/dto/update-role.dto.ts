import { IsEnum } from 'class-validator';
import { ORG_ROLES } from '@apiDatabase/constants';
import type { OrgRole } from '@apiDatabase/types';

export class UpdateRoleDto {
  @IsEnum(ORG_ROLES)
  role!: OrgRole;
}
