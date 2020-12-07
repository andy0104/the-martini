import { Request, Response, NextFunction } from 'express';
import CustomError from '../errors/customerror';

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
  // console.error(err.stack);
  // console.log(err.name);
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      error: true,
      msg: err.serializeErrors()
    });
  }

  return res.status(500).json({
      error: true,
      msg: [{ message: err.message }]
    });
}