import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getCustomRepository } from 'typeorm';
import { Project } from '../entity/Project';
import DuplicateEntryError from '../errors/duplicateentryerror';
import RequestValidationError from '../errors/requestvalidationerror';
import Unauthorized from '../errors/unauthorized';
import { CompanyRepository } from '../repository/CompanyRepository';
import ProjectInviteRepository from '../repository/ProjectInviteRepository';
import { ProjectRepository } from '../repository/ProjectRepository';
import { UserRepository } from '../repository/UserRepository';
import email from '../services/email';
import { checkUserActiveLocked } from '../services/utility';

export const createProject = async (req: Request, res: Response): Promise<Response<any>> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // return res.status(422).json(errors.array());
    throw new RequestValidationError(errors.array());
  }

  const { project_name, payload: { sub }} = req.body;

  // Check if user has added company
  const userRepo = getCustomRepository(UserRepository);
  const user = await userRepo.getUserById(sub);

  if (checkUserActiveLocked(user)){
    const company = await user.company;
    const projRepo = getCustomRepository(ProjectRepository);

    if (company) {      
      const existProject = await projRepo.checkProjectExist(project_name);

      if (existProject) {
        const projCompany = await existProject.company;        
        if (projCompany && JSON.stringify(company) === JSON.stringify(projCompany)) {          
          throw new DuplicateEntryError('Project name is already being used');
        }
      }

      // Save the project
      const project = await projRepo.createProject(project_name, company);

      return res
              .status(200)
              .json({
                error: false,
                msg: [{ message: 'Project saved successfully' }],
                data: {
                  project: {
                    id: project.id,
                    name: project.project_name
                  }
                }
              });
    } else {
      throw new Error('You must create a company before you want to create projects');
    }    
  } else {
    throw new Error('Invalid user account or account is locked');
  }
}

export const sendProjectInvites = async (req: Request, res: Response): Promise<Response<any>> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  const { emails, payload: {sub, role} } = req.body;
  const project_id = req.params.projectId;
  console.log(emails, project_id, sub, role);

  // Check if the project exist
  const projRepo = getCustomRepository(ProjectRepository);
  const userRepo = getCustomRepository(UserRepository);  
  const projInviteRepo = getCustomRepository(ProjectInviteRepository);

  const project = await projRepo.getProjectById(project_id);
  const projCompany = await project.company;
  const user = await userRepo.getUserById(sub);
  const company = await user.company;

  if (project && company && JSON.stringify(projCompany) === JSON.stringify(company)) {
    // const emailSendingStatus = emails.split(',').map(email => {
    //                             console.log(email, project_id);
    //                             return Promise.resolve(saveProjectInvite(email, project));
    //                           });
    const emailArray = emails.split(',');
    emailArray.forEach(async (email, index) => {
      console.log(email, index);
      try {
        const invite = await projInviteRepo.saveInvites(email, project);
        if (emailArray.length === (index + 1)) {
          console.log('Loop is finished');
          return res
              .status(200)
              .json({
                error: false,
                msg: [{ message: 'Project invitation send successfully' }],
                data: {
                  invites: []
                }
              });
        }  
      } catch (error) {
        console.log(error);
        throw new DuplicateEntryError(`${email} has already been invited`);
      }
    });

    // return res
    //         .status(200)
    //         .json({
    //           error: false,
    //           msg: [{ message: 'Project invitation send successfully' }],
    //           data: {
    //             invites: []
    //           }
    //         });
  } else {
    throw new Unauthorized('Unauthorized access');
  } 
}

const saveProjectInvite = async (email: string, project: Project) => {
  const projInviteRepo = getCustomRepository(ProjectInviteRepository);

  try {
    const invite = await projInviteRepo.saveInvites(email, project);
    return true;
  } catch (error) {
    throw new DuplicateEntryError(`${email} is already invited to the project`);
  }  
}