import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from './userroles';

export const verifyAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
  // Get the access token from the request header  
  const bearerToken = req.headers['authorization'];

  if (!bearerToken) {
    return res.status(401).json({ msg: 'Unauthorised access' });
  }

  const token = bearerToken.split(' ')[1].toString();

  if (token) {    
    try {
      const isValidToken = await jwt.verify(token, process.env.JWT_TOKEN_SECRET);
      const decode = await jwt.decode(token);
      req.body.payload = decode;      
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ msg: 'Unauthorised access' });  
    }
  } else {
    return res.status(401).json({ msg: 'Unauthorised access' });
  }
}

export const verifyResfreshToken = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {  
  const refreshToken = req.headers['x-auth-generate-token'];

  if (!refreshToken) {
    return res.status(401).json({ msg: 'Unauthorised access' });
  } else {
    try {
      const isValidToken = await jwt.verify(refreshToken.toString(), process.env.JWT_REFRESH_SECRET);
      const decode = await jwt.decode(refreshToken.toString());
      req.body.payload = decode;      
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ msg: 'Unauthorised access' });  
    }
  }
}

export const verifyIfAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response<any>> => {
  const { payload: { sub, role } } = req.body;
  if (role === UserRole.USER_ADMIN || role === UserRole.SUPER_ADMIN) {
    next();
  } else {
    return res.status(401).json({ msg: 'Unauthorised access' });
  }
}