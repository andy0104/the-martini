import { AbstractRepository, EntityRepository } from "typeorm";
import { Project } from "../entity/Project";
import { Projectinvites } from "../entity/Projectinvites";

@EntityRepository(Projectinvites)
export default class ProjectInviteRepository extends AbstractRepository<Projectinvites> {
  saveInvites(email: string, project: Project) {
    const invite = new Projectinvites();
    invite.email = email;
    invite.project = Promise.resolve(project);
    return this.manager.save(invite);
  }
}