import { IsString, MinLength } from 'class-validator';
import type { CreateOrgInput } from '@apiDatabase/types';

export class CreateOrgDto implements CreateOrgInput {
  @IsString()
  @MinLength(2)
  name!: string;
}
