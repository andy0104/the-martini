import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Project } from "./Project";
import { User } from "./User";
import { InviteStatus } from '../services/invitestatus';

@Entity()
@Unique('index_user_project', ['email', 'project'])
export class Projectinvites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  code: string;

  @Column({
    type: 'enum',
    enum: InviteStatus,
    default: InviteStatus.PENDING
  })
  status: InviteStatus;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP'
  })
  create_date: Date;
  
  @ManyToOne(type => Project, project => project.invites)
  project: Promise<Project>;
}