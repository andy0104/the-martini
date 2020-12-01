import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./Project";
import { User } from "./User";

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company_name: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => "CURRENT_TIMESTAMP"
  })
  create_date: Date;

  @OneToOne(type => User)
  @JoinColumn()
  user: Promise<User>;

  @OneToMany(type => Project, project => project.company)
  projects: Promise<Project[]>;
}