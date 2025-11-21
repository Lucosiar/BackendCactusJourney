import { Injectable, NestMiddleware } from '@nestjs/common';
import rateLimit from 'express-rate-limit';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });

  use(req: Request, res: Response, next: NextFunction): void {
    this.limiter(req, res, next);
  }
}
