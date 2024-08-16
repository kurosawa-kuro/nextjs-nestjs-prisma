import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { UsersService } from '@/app/api/users/users.service';
import * as bcrypt from 'bcryptjs';
import { TokenUtility } from '@/helpers/token.util';
import { CreateUser } from '@/models/auth.model';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(registerDto: CreateUser) {
    if (registerDto.password !== registerDto.passwordConfirm) {
      throw new BadRequestException('Passwords do not match!');
    }

    const hashed = await bcrypt.hash(registerDto.password, 12);

    return this.usersService.register({
      name: registerDto.name,
      email: registerDto.email,
      password: hashed,
    });
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: any; token: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({ id: user.id });

    return { user, token };
  }

  async getCurrentUser(request: Request) {
    const token = TokenUtility.extractTokenFromRequest(request);
    const payload = await this.jwtService.verifyAsync(token);
    const user = await this.usersService.find(payload.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Exclude password without using destructuring
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => key !== 'password'),
    );
  }

  logout(response: Response) {
    response.clearCookie('jwt');
  }
}
