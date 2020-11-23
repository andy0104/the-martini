import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import DeviceDetector from 'node-device-detector';

import { UserRepository } from '../repository/UserRepository';

export const getCurrentUser = async (req: Request, res: Response): Promise<Response<any>> => {  
  // const deviceDetector = new DeviceDetector();
  // const result = deviceDetector.detect(req.headers['user-agent']);
  // console.log(result);
  const { payload: { sub } } = req.body;  

  // Check if user exists or not
  const userRepo = getCustomRepository(UserRepository);
  const user = await userRepo.getUserById(sub);  

  return res
          .status(200)
          .json({
            msg: 'User profile found',
            profile: {
              firstname: user.firstName,
              lastname: user.lastName,
              email: user.email,
              username: user.username,
              role: user.role
            }
          });
}

export const signUpUser = async (req: Request, res: Response): Promise<Response<any>> => {
  const errors = validationResult(req);  

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  } else {

    try {
      const { firstname, lastname, username, email, password, userrole } = req.body;

      // Hash the password
      const salt = await bcrypt.genSalt(10);      
      const hashPassword = await bcrypt.hash(password, salt);      

      // Check if username is already taken
      const userRepo = getCustomRepository(UserRepository);
      const userName = await userRepo.getUserByUsername(username);      

      // Check if email is already registered
      const userEmail = await userRepo.getUserByEmail(email);      

      if (!userName && !userEmail) {
        const newUser = await userRepo.createAndSave(firstname, lastname, username, email, userrole, hashPassword);

        const jwtPayload = {
          sub: newUser.id,          
          role: newUser.role
        };

        const token = await jwt.sign(jwtPayload, process.env.JWT_TOKEN_SECRET, {
          expiresIn: process.env.JWT_TOKEN_EXPIRE
        });

        const refreshToken = await jwt.sign(jwtPayload, process.env.JWT_REFRESH_SECRET, {
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE
        });

        return res
              .status(200)
              .json({ msg: 'User signup is successful', 
                token, 
                refresh: refreshToken,
                profile: {              
                  firstname: userName.firstName,
                  lastname: userName.lastName,
                  email: userName.email,
                  username: userName.username,
                  role: userName.role
                }
              });
      } else {
        return res
              .status(422)
              .json({ msg: 'Username or Email id are already taken'});
      }

    } catch (error) {
      return res.status(422).json({ msg: error });
    }    
  }
}

export const signInUser = async (req: Request, res: Response): Promise<Response<any>> => {
  const errors = validationResult(req);  

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  } else {
    const { username, password } = req.body;

    // Check if username does exist or not
    const userRepo = getCustomRepository(UserRepository);
    const userName = await userRepo.getUserByUsername(username);    

    // Compare the supplied password with the stored password
    if (userName && await bcrypt.compare(password, userName.password)) {
      const jwtPayload = {
        sub: userName.id,          
        role: userName.role
      };

      const token = await jwt.sign(jwtPayload, process.env.JWT_TOKEN_SECRET, {
        expiresIn: process.env.JWT_TOKEN_EXPIRE
      });

      const refreshToken = await jwt.sign(jwtPayload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE
      });

      return res
            .status(200)
            .json({ msg: 'User login successful', 
              token, 
              refresh: refreshToken, 
              profile: {              
                firstname: userName.firstName,
                lastname: userName.lastName,
                email: userName.email,
                username: userName.username,
                role: userName.role
              }
            });
    } else {
      return res
              .status(422)
              .json({ msg: 'Username or password is incorrect'});
    }
  }
}

export const refreshAccessToken = async (req: Request, res: Response): Promise<Response<any>> => {
  const { payload: { sub, role } } = req.body;

  const jwtPayload = { sub, role };

  const token = await jwt.sign(jwtPayload, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE
  });

  return res
        .status(200)
        .json({ msg: 'Access token re-generation successful', 
          token          
        });
}