import { IsEmail, IsString } from 'class-validator';
import type { LoginInput } from '@apiDatabase/types';

export class LoginDto implements LoginInput {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
