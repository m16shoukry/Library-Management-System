import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ValidateDatesMiddleware implements NestMiddleware {

  async use(req: Request, res: Response, next: NextFunction) {
    const startDate = new Date(String(req.query.startDate));
    const endDate = new Date(String(req.query.endDate));

    if (endDate < startDate) {
      throw new BadRequestException('This Dates Are Not Acceptable');
    }

    next();
  }
}
