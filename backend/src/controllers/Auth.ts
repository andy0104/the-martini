import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import DeviceDetector from 'node-device-detector';

import { UserRepository } from '../repository/UserRepository';

export const getCurrentUser = async (req: Request, res: Response) => {  
  const deviceDetector = new DeviceDetector();
  const result = deviceDetector.detect(req.headers['user-agent']);
  console.log(result);
  
  return res
          .status(200)
          .json({ msg: 'From auth/getCurrentUser controller'});
}

export const signUpUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  console.log(req.body);

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  } else {

    try {
      const { firstname, lastname, username, email, password, userrole } = req.body;
      const salt = await bcrypt.genSalt(10);
      console.log(salt);
      const hashPassword = await bcrypt.hash(password, salt);
      console.log(hashPassword);

      // Check if username is already taken
      const userRepo = getCustomRepository(UserRepository);
      const userName = await userRepo.getUserByUsername(username);
      console.log(userName);

      // Check if email is already registered
      const userEmail = await userRepo.getUserByEmail(email);
      console.log(userEmail);

      if (!userName && !userEmail) {
        const newUser = await userRepo.createAndSave(firstname, lastname, username, email, userrole, hashPassword);

        const jwtPayload = {
          sub: newUser.id,          
          role: newUser.role
        };

        const token = await jwt.sign(jwtPayload, process.env.JWT_SECRET, {
          expiresIn: 300
        });

        const refreshToken = await jwt.sign(jwtPayload, process.env.JWT_SECRET, {
          expiresIn: '7d'
        });

        return res
              .status(200)
              .json({ msg: 'From auth/signUpUser controller', token, refresh: refreshToken });
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