import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { CompanyRepository } from '../repository/CompanyRepository';
import { UserRepository } from '../repository/UserRepository';
import { checkUserActiveLocked } from '../services/utility';

export const createCompany = async (req: Request, res: Response): Promise<Response<any>> => {
  const { company_name, payload } = req.body;

  // Check if user has added company
  const userRepo = getCustomRepository(UserRepository);
  const user = await userRepo.getUserById(payload.sub);    

  if (checkUserActiveLocked(user)) {
    const companyRepo = getCustomRepository(CompanyRepository);
    let company = await user.company;    

    if (!company) {      
      company = await companyRepo.createCompany(company_name, user);
    } else {
      company.company_name = company_name;
      company = await companyRepo.updateCompany(company);
    }    

    return res
            .status(200)
            .json({
              error: false,
              msg: [{ message: 'Company name saved successfully' }],
              data: {
                company: {
                  id: company.id,
                  name: company.company_name
                }
              }
            });
  } else {
    throw new Error('Invalid user account or account is locked');
  }
}