import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import moment from 'moment';
import ejs from 'ejs';
import path from 'path';
import DeviceDetector from 'node-device-detector';

import sendMail from '../services/email';
import { dateDifference } from '../services/utility';
import { UserRepository } from '../repository/UserRepository';
import RequestValidationError from '../errors/requestvalidationerror';
import { UserRecoveryRepository } from '../repository/UserRecoveryRepository';

export const getCurrentUser = async (req: Request, res: Response): Promise<Response<any>> => {  
  // const deviceDetector = new DeviceDetector();
  // const result = deviceDetector.detect(req.headers['user-agent']);
  // console.log(result);
  const { payload: { sub } } = req.body;  

  
    // Check if user exists or not
    const userRepo = getCustomRepository(UserRepository);
    const user = await userRepo.getUserById(sub);  

    if (user && user.active && !user.accountLocked) {
      return res
              .status(200)
              .json({
                error: false,
                msg: [{ message: 'User profile found'}],
                profile: {
                  firstname: user.firstName,
                  lastname: user.lastName,
                  email: user.email,
                  username: user.username,
                  role: user.role
                }
              });
    } else {
      throw new Error('User profile does not exist or account is locked');
    }   
}

export const signUpUser = async (req: Request, res: Response): Promise<Response<any>> => {
  const errors = validationResult(req);  

  if (!errors.isEmpty()) {
    // return res.status(422).json(errors.array());
    throw new RequestValidationError(errors.array());
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
              .json({ 
                error: false,
                msg: [{ message: 'User signup is successful' }], 
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
              .status(409)
              .json({ error: true, msg: [{ message: 'Username or Email id are already taken'}] });
      }

    } catch (error) {
      throw new Error(error);
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

    // Check if the user exists or the account is not locked
    if (userName && userName.active && userName.numLoginAttempts < 8) { 
      // Compare the supplied password with the stored password
      if(await bcrypt.compare(password, userName.password)) {
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
        // Update the number of login attempts
        if (userName.numLoginAttempts >= 8) {
          userName.accountLocked = true;
        } else {
          userName.numLoginAttempts = userName.numLoginAttempts + 1;          
        }

        await userRepo.updateUser(userName);
        console.log(userName);
        return res
                .status(401)
                .json({ msg: 'Username or password is incorrect'});
      }
    } else {
      return res
              .status(401)
              .json({ msg: 'Username or password is incorrect or account has been locked'});
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

export const sendPasswordRecovery = async (req: Request, res: Response): Promise<Response<any>> => {
  const errors = validationResult(req);  

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  } else {

    const { username, password } = req.body;

    // Check if username does exist or not
    const userRepo = getCustomRepository(UserRepository);
    const userName = await userRepo.getUserByUsername(username); 

    if (userName && userName.active && !userName.accountLocked) {
      console.log(userName);
      // Generate the unique recovery code
      const recoveryCode = await bcrypt.genSalt(10);

      // Check if user recovery code is already added
      const recoveryRepo = getCustomRepository(UserRecoveryRepository);
      let recovery = await userName.userrecovery; // await recoveryRepo.getUserRecoveryCode(userName);
      
      if (recovery) {
        recovery.recovery_code = recoveryCode;
        recovery.create_date = new Date();
        recovery = await recoveryRepo.updateRecoveryCode(recovery);
      } else {
        recovery = await recoveryRepo.saveRecoveryCode(recoveryCode, userName);
      }
      
      // Render the email template
      const renderTemplate = await ejs.renderFile(path.join(__dirname, '../../src/templates/email/email.ejs'), {
        name: `${userName.firstName} ${userName.lastName}`,
        subject: 'Password Recovery Email',
        recovery_code: encodeURIComponent(recoveryCode),
      });
      
      // Use the email service to send the email
      sendMail(userName.email, 'Password Recovery Email', renderTemplate);

      return res
              .status(200)
              .json({
                error: false,
                msg: [{ message: 'Password recovery code sent to your email' }] 
              });
    } else {
      throw new Error('Username does not exist or account is locked');
    }    
  }
}

export const verifyRecoveryCode = async (req: Request, res: Response): Promise<Response<any>> => {
  const errors = validationResult(req);  

  if (!errors.isEmpty()) {
    // return res.status(422).json(errors.array());
    throw new RequestValidationError(errors.array());
  }

  const { recovery_code } = req.body;

  // Check if the recovery code is valid
  const recoveryRepo = getCustomRepository(UserRecoveryRepository);
  const userRecovery = await recoveryRepo.checkUserRecoveryCode(decodeURIComponent(recovery_code));
  console.log(decodeURIComponent(recovery_code));
  console.log(userRecovery);

  if (userRecovery && dateDifference(userRecovery.create_date.toString()) <= 30) {
    console.log(dateDifference(userRecovery.create_date.toString()));
    return res
          .status(200)
          .json({
            error: false,
            msg: [{ message: 'Password recovery code is valid' }] 
          });
  }

  throw new Error('Recovery code is invalid or the code has expired');
}

export const resetPassword = async (req: Request, res: Response) => {
  const errors = validationResult(req);  

  if (!errors.isEmpty()) {
    // return res.status(422).json(errors.array());
    throw new RequestValidationError(errors.array());
  }

  const { recovery_code, user_password } = req.body;

  // Check if the recovery code is valid
  const recoveryRepo = getCustomRepository(UserRecoveryRepository);
  const userRecovery = await recoveryRepo.checkUserRecoveryCode(decodeURIComponent(recovery_code));  
  console.log(decodeURIComponent(recovery_code));
  console.log(userRecovery);  

  if (userRecovery && dateDifference(userRecovery.create_date.toString()) <= 30) {
    console.log(dateDifference(userRecovery.create_date.toString()));

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user_password, salt);
    console.log(hashPassword);

    // Save the user password
    const userRepo = getCustomRepository(UserRepository);
    const user = await userRecovery.user;
    console.log(user);
    user.password = hashPassword;
    await userRepo.updateUser(user);

    return res
          .status(200)
          .json({
            error: false,
            msg: [{ message: 'The password has been reset' }] 
          });
  }

  throw new Error('Recovery code is invalid or the code has expired');
}