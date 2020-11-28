import { AbstractRepository, EntityRepository } from "typeorm";
import { Company } from "../entity/Company";
import { User } from "../entity/User";

@EntityRepository(Company)
export class CompanyRepository extends AbstractRepository<Company> {  
  createCompany(company_name: string, user: User) {
    const company = new Company();
    company.company_name = company_name;
    company.user = Promise.resolve(user);
    return this.manager.save(company);
  }

  updateCompany(company: Company) {
    return this.manager.save(company);
  }
}