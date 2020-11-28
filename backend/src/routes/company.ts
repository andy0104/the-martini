import { Router } from 'express';
import { check } from 'express-validator';
import { createCompany } from '../controllers/Company';
import { verifyAccessToken, verifyIfAdmin } from '../services/verifytoken';

const router = Router();

router
  .post('/create', [
      check('company_name').not().isEmpty().trim().escape().withMessage('Company name field is required')
    ], verifyAccessToken, verifyIfAdmin, createCompany);

export default router;