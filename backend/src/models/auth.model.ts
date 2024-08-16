// src\auth\auth.model.ts

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUser {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  passwordConfirm: string;
}
