import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  const { message, data, status } = res.locals;    
  console.log(data);
  return res
          .status(status || 200)
          .json({
            error: false,
            msg: [{ message }],
            data
          });
};