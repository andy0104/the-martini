import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
import bcrypt from 'bcryptjs';
import os from 'os';

import { verifyAccessToken, verifyResfreshToken } from '../services/verifytoken';
import { UserRole } from '../services/userroles';
import { getCurrentUser, signUpUser, signInUser, refreshAccessToken, sendPasswordRecovery, verifyRecoveryCode, resetPassword } from '../controllers/Auth';

const router = Router();

router
  .get('/', verifyAccessToken, getCurrentUser)
  
  .post('/signup', [
    check('firstname').not().isEmpty().trim().escape(),
    check('lastname').not().isEmpty().trim().escape(),
    check('username').not().isEmpty().trim().escape(),
    check('email').isEmail().normalizeEmail(),
    check('password').trim().isLength({ min: 8, max: 20 }).withMessage('Password should be of minimum 8 characters').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i").withMessage('Password should have at least one letter, one number and one special character'),
    check('confirmpassword').trim().custom((value, { req }) => (value === req.body.password )).withMessage('Confirm password does not match with the password'),
    check('userrole').not().isEmpty().trim().escape().custom((value) => value in UserRole).withMessage('Invalid value for user role'),
  ], signUpUser)

  .post('/signin', [
    check('username').not().isEmpty().trim().escape().withMessage('Username field is required'),
    check('password').not().isEmpty().trim().escape().withMessage('Password field is required')
  ], signInUser)
  
  .get('/token', verifyResfreshToken, refreshAccessToken)
  
  .get('/send-recovery-code', [
    check('username').not().isEmpty().trim().escape().withMessage('Username field is required')
  ], sendPasswordRecovery)
  
  .post('/verify-recovery-code', [
    check('recovery_code').not().isEmpty().trim().escape().withMessage('Recovery code field is required')
  ], verifyRecoveryCode)
  
  .post('/reset-password', [
    check('recovery_code').not().isEmpty().trim().escape().withMessage('Recovery code field is required'),
    check('user_password').trim().isLength({ min: 8, max: 20 }).withMessage('Password should be of minimum 8 characters').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i").withMessage('Password should have at least one letter, one number and one special character')
  ], resetPassword)
  
  .get('/cores', (req, res) => {
    console.log(`Logical count: ${os.cpus().length}`);
    console.log(os.cpus());
    return res.status(200).json({ });
  })

  .get('/pulse', async (req, res) => {
    return res.status(200).json({ message: 'pulse'});
  })
  
  .get('/stress', async (req, res) => {
    const hash = await bcrypt.hash('this is a long password', 10);
    return res.status(200).json({ message: 'stress', hash });
  });

export default router;