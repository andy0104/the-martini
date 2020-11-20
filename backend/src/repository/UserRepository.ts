import { EntityRepository, AbstractRepository } from 'typeorm';
import { User } from '../entity/User';
import { UserRole } from '../services/userroles';

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  createAndSave(firstName: string, lastName: string, username: string, email: string, role: UserRole, password: string) {
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.email = email;
    user.role = role;
    user.active = true;
    user.password = password;
    return this.manager.save(user);
  }

  getUserByUsername(userName: string) {
    return this.repository.findOne({ username: userName });
  }

  getUserByEmail(email: string) {
    return this.repository.findOne({ email });
  }
}
