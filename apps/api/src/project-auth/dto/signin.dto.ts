import { IsEmail, IsString } from 'class-validator';
import type { SignInInput } from '@apiDatabase/types';

export class SignInDto implements SignInInput {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
