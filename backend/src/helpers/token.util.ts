// src\helpers\token.util.ts

import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export class TokenUtility {
  static extractTokenFromRequest(request: Request): string {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      return authHeader.split(' ')[1];
    }
    if (request.cookies && request.cookies.jwt) {
      return request.cookies.jwt;
    }
    throw new UnauthorizedException('No token found');
  }
}
