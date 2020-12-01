import { AbstractRepository, EntityRepository } from "typeorm";
import { Company } from "../entity/Company";
import { Project } from "../entity/Project";

@EntityRepository(Project)
export class ProjectRepository extends AbstractRepository<Project> {
  createProject(project_name: string, company: Company) {
    const project = new Project();
    project.project_name = project_name;
    project.company = Promise.resolve(company);
    return this.manager.save(project);
  }

  checkProjectExist(project_name: string) {
    return this.repository.findOne({ project_name });
  }

  getProjectById(projectId: string) {
    return this.repository.findOne({ id: projectId });
  }
}