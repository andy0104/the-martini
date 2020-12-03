import { AbstractRepository, EntityRepository } from "typeorm";
import { Project } from "../entity/Project";
import { Projectinvites } from "../entity/Projectinvites";

@EntityRepository(Projectinvites)
export default class ProjectInviteRepository extends AbstractRepository<Projectinvites> {
  saveInvites(email: string, inviteCode: string, project: Project) {
    const invite = new Projectinvites();
    invite.email = email;
    invite.code = inviteCode;
    invite.project = Promise.resolve(project);
    return this.manager.save(invite);
  }

  checkInviteAlreadySend(email: string, project: Project) {
    return this.createQueryBuilder('projectinvites')
            .where('projectinvites.projectId = :projectId', { projectId: project.id })
            .andWhere('projectinvites.email = :email', { email: email })
            .getOne();
  }

  updateInvite(project: Project) {
    return this.manager.save(project);
  }
}