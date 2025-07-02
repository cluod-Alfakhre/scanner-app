import { Injectable } from '@angular/core';
import { CitiesFilterModel } from '../../models/city.models';
import { CitiesService } from '../cities/cities.service';
import { OwnersService } from '../owners/owners.service';
import { RealestatesService } from '../realestates/realestates.service';
import { ProjectsService } from '../projects/projects.service';
import { ProjectsFilterModel } from '../../models/project.model';
import { RealestatesFilterModel } from '../../models/realestate.models';
import { OwnersFilterModel } from '../../models/owner.models';
import { CommonLogicService } from '../general/common-logic.service';

@Injectable({
  providedIn: 'root'
})
export class ListDataService {

  constructor(
    private citiesService: CitiesService,
    private ownersService: OwnersService,
    private realestatesService: RealestatesService,
    private projectsService: ProjectsService,
    private commonLogic: CommonLogicService,
  ) { }

  getCities(filterObject: CitiesFilterModel) {
    filterObject.SkipPaged = true;
    return this.citiesService.getCities(filterObject);
  }

  getProjects(filterObject: ProjectsFilterModel) {
    filterObject.SkipPaged = true;
    return this.projectsService.getProjects(filterObject);
  }

  getRealestates(filterObject: RealestatesFilterModel) {
    filterObject.SkipPaged = true;
    return this.realestatesService.getRealestates(filterObject);
  }

  getOwners(filterObject: OwnersFilterModel) {
    filterObject.SkipPaged = true;
    return this.ownersService.getOwners(filterObject);
  }

  getRealestateBranchNames() {
    const endPoint = `/api/Enum/branch-names`;
    return this.commonLogic.getEndPoints(endPoint)
  }

}
