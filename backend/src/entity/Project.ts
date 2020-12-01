import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./Company";
import { Projectinvites } from "./Projectinvites";

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  project_name: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP'
  })
  create_date: Date;

  @ManyToOne(type => Company, company => company.projects)
  company: Promise<Company>;

  @OneToMany(type => Projectinvites, projectinvites => projectinvites.project)
  invites: Promise<Projectinvites>[];
}