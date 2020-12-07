import { AbstractRepository, EntityRepository, getConnection } from "typeorm";
import { Company } from "../entity/Company";
import { User } from "../entity/User";

@EntityRepository(Company)
export class CompanyRepository extends AbstractRepository<Company> {  
  createCompany(company_name: string, user: User) {
    const company = new Company();
    company.company_name = company_name;
    company.user = Promise.resolve(user);
    return getConnection(process.env.NODE_ENV).manager.save(company); // this.manager.save(company);
  }

  updateCompany(company: Company) {
    return getConnection(process.env.NODE_ENV).manager.save(company); // this.manager.save(company);
  }
}