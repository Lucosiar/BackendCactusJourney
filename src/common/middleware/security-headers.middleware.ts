import { Injectable, NestMiddleware } from '@nestjs/common';
import helmet from 'helmet';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  private readonly helmetInstance = helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'no-referrer' },
    frameguard: { action: 'deny' },
  });

  use(req: Request, res: Response, next: NextFunction): void {
    this.helmetInstance(req, res, next);
  }
}
