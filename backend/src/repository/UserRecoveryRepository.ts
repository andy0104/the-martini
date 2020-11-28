import { AbstractRepository, EntityRepository } from "typeorm";
import { User } from "../entity/User";
import { Userrecovery } from "../entity/Userrecovery";

@EntityRepository(Userrecovery)
export class UserRecoveryRepository extends AbstractRepository<Userrecovery> {
  
  saveRecoveryCode(code: string, user: User) {
    const recovery = new Userrecovery();
    recovery.recovery_code = code;
    recovery.user = Promise.resolve(user);
    return this.manager.save(recovery);
  }
  
  checkUserRecoveryCode(recovery_code: string) {
    return this.repository.findOne({ recovery_code });
  }

  updateRecoveryCode(recovery: Userrecovery) {
    return this.manager.save(recovery);
  }
}