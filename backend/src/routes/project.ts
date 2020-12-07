import { Router } from 'express';
import { check } from 'express-validator';
import { createProject, sendProjectInvites, testMiddleware } from '../controllers/Project';
import { verifyAccessToken, verifyIfAdmin } from '../services/verifytoken';
import sendResponse from '../services/response';

const router = Router();

router
  .post('/create', [
    check('project_name').not().isEmpty().trim().escape().withMessage('Project name field is required')
  ], verifyAccessToken, verifyIfAdmin, createProject)

  .post('/send-invite/:projectId', [
    check('emails').not().isEmpty().trim().escape().withMessage('Email ids are required')
    .custom(( value ) => {
      const emailArray = value.split(',');
      console.log(emailArray);
      const x = emailArray.map(email => {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
      });
      console.log(x);
      if (x.includes(false)) {
        return false;
      } else {
        return true;
      }
    }).withMessage('All the values must be a valid email id')
  ], verifyAccessToken, verifyIfAdmin, sendProjectInvites)
  
  .get('/test-middleware', testMiddleware, sendResponse);

export default router;