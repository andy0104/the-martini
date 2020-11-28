import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Userrecovery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  recovery_code: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => "CURRENT_TIMESTAMP"
  })
  create_date: Date;

  @OneToOne(type => User) @JoinColumn()
  user: Promise<User>;
}