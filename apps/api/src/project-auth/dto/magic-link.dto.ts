import { IsEmail } from 'class-validator';
import type { MagicLinkInput } from '@apiDatabase/types';

export class MagicLinkDto implements MagicLinkInput {
  @IsEmail()
  email!: string;
}
