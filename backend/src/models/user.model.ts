// src/users/user.model.ts

import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  Matches,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUser {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class UpdateUser extends PartialType(CreateUser) {}
