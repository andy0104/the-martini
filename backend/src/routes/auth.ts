import { Router, Request, Response } from 'express';

import { getCurrentUser, signUpUser } from '../controllers/Auth';

const router = Router();

router
  .get('/', getCurrentUser)
  .post('/signup', signUpUser);

export default router;