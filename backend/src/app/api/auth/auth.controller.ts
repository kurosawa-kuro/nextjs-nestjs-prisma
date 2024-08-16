import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@/guards/auth.guard';
import { AuthService } from '@/app/api/auth/auth.service';
import { CreateUser } from '@/models/auth.model';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BaseController } from '@/lib/base.controller';

@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController extends BaseController<CreateUser> {
  constructor(private authService: AuthService) {
    super(authService, 'Auth');
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new account' })
  @ApiBody({ type: CreateUser })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() body: CreateUser) {
    return super.create(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', format: 'password' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { user, token } = await this.authService.login(email, password);
      response.cookie('jwt', token, { httpOnly: true });
      return user;
    } catch (error) {
      throw new BadRequestException('Login failed');
    }
  }

  @UseGuards(AuthGuard)
  @Get('user')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'User details retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async user(@Req() request: Request) {
    return this.authService.getCurrentUser(request);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Log out' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async logout(@Res({ passthrough: true }) response: Response) {
    try {
      this.authService.logout(response);
      return { message: 'Success' };
    } catch (error) {
      throw new BadRequestException('Logout failed');
    }
  }
}
