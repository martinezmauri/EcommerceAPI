import { NextFunction, Request, Response } from 'express';

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const now = new Date();
  console.log(
    `[${now}]Estas ejecutando un metodo ${req.method} en la ruta ${req.url}`,
  );
  next();
}
