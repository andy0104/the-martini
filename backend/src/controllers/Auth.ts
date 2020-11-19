import { Request, Response } from 'express';
import DeviceDetector from 'node-device-detector';

export const getCurrentUser = (req: Request, res: Response) => {  
  const deviceDetector = new DeviceDetector();
  const result = deviceDetector.detect(req.headers['user-agent']);
  console.log(result);
  return res
          .status(200)
          .json({ msg: 'From auth/getCurrentUser controller'});
}

export const signUpUser = (req: Request, res: Response) => {
  return res
          .status(200)
          .json({ msg: 'From auth/signUpUser controller'});
}