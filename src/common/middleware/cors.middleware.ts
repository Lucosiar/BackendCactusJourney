import { Injectable, NestMiddleware } from '@nestjs/common';
import cors from 'cors';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  private readonly corsHandler = cors({
    origin: process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) || '*',
    credentials: true,
    optionsSuccessStatus: 204,
  });

  use(req: Request, res: Response, next: NextFunction): void {
    this.corsHandler(req, res, next);
  }
}
