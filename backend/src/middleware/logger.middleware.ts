// src/middleware/logger.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as morgan from 'morgan';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: any;

  constructor() {
    this.logger = morgan('combined');
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.logger(req, res, next);
  }
}