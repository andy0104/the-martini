import {Entity, PrimaryGeneratedColumn, Column, Timestamp} from "typeorm";
import { UserRole } from '../services/userroles';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  password: string;

  @Column({
    unique: true
  })
  username: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER_COLLABORATOR
  })
  role: UserRole

  @Column({
    default: true
  })
  active: boolean;

  @Column({
    type: 'int'
    width: 2,
    unsigned: true,
    default: 0
  })
  numLoginAttempts: number;

  @Column({
    default: false
  })
  accountLocked: boolean;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => "CURRENT_TIMESTAMP"    
  })
  createDate: Date;

  @Column({
    type: 'timestamp',
    nullable: true
  })
  updateDate: Date;
}
