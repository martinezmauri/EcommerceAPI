import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class validateProductMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { name, description, price, stock, categoryName } = req.body;
    if (!name || !description || !price || !stock || !categoryName) {
      throw new HttpException(
        'Faltan datos requeridos',
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}

@Injectable()
export class validateUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { name, email, password, address, phone, country, city } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !phone ||
      !country ||
      !city
    ) {
      throw new HttpException(
        'Faltan datos requeridos',
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}

export class validateLoginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new HttpException(
        'Faltan datos requeridos',
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
