import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getCustomRepository } from 'typeorm';
import { CompanyRepository } from '../repository/CompanyRepository';
import { UserRepository } from '../repository/UserRepository';
import { checkUserActiveLocked } from '../services/utility';
import RequestValidationError from '../errors/requestvalidationerror';

export const createCompany = async (req: Request, res: Response): Promise<Response<any>> => {

  const errors = validationResult(req);  

  if (!errors.isEmpty()) {
    // return res.status(422).json(errors.array());
    throw new RequestValidationError(errors.array());
  }

  const { company_name, payload } = req.body;

  // Check if user has added company
  const userRepo = getCustomRepository(UserRepository, process.env.NODE_ENV);
  const user = await userRepo.getUserById(payload.sub);    

  if (checkUserActiveLocked(user)) {
    const companyRepo = getCustomRepository(CompanyRepository, process.env.NODE_ENV);
    let company = await user.company;    

    if (!company) {      
      company = await companyRepo.createCompany(company_name, user);
    } else {
      company.company_name = company_name;
      company = await companyRepo.updateCompany(company);
    }
    
    // Update the user for company created
    user.companyCreated = true;
    await userRepo.updateUser(user);

    return res
            .status(200)
            .json({
              error: false,
              msg: [{ message: 'Company name saved successfully' }],
              data: {
                company: {
                  id: company.id,
                  name: company.company_name
                },
                user: {
                  company_created: user.companyCreated
                }
              }
            });
  } else {
    throw new Error('Invalid user account or account is locked');
  }
}