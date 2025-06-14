import { Injectable } from '@angular/core';
import { CommonLogicService } from '../general/common-logic.service';
import { AddProjectModel, ProjectsFilterModel, UpdateProjectModel } from '../../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(
    private commonLogic: CommonLogicService,
  ) { }

  getProjects(filterObject: ProjectsFilterModel) {
    const endPoint = `/api/Projects`;
    return this.commonLogic.getEndPoints(endPoint, filterObject)
  }

  addProject(projectObject: AddProjectModel) {
    const endPoint = `/api/Projects`;
    return this.commonLogic.addAndEditEndPoints(endPoint, projectObject, 'post')
  }

  updateProject(projectObject: UpdateProjectModel) {
    const endPoint = `/api/Projects/${projectObject.id}`;
    return this.commonLogic.addAndEditEndPoints(endPoint, projectObject, 'put')
  }

  deleteProjects(ids: string[] | number[]) {
    const endPoint = `/api/Projects/DeleteMultiple`;
    return this.commonLogic.deleteArrayEndPoints(endPoint, ids)
  }

}
