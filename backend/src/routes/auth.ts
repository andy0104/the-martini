import { Router, Request, Response } from 'express';
import { check } from 'express-validator';

import { verifyAccessToken, verifyResfreshToken } from '../services/verifytoken';
import { UserRole } from '../services/userroles';
import { getCurrentUser, signUpUser, signInUser, refreshAccessToken } from '../controllers/Auth';

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
  
  .get('/token', verifyResfreshToken, refreshAccessToken);


export default router;