import { Injectable } from '@angular/core';
import { CommonLogicService } from '../general/common-logic.service';
import { AddCityModel, CitiesFilterModel, UpdateCityModel } from '../../models/city.models';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  constructor(
    private commonLogic: CommonLogicService,
  ) { }

  getCities(filterObject: CitiesFilterModel) {
    const endPoint = `/api/Cities`;
    return this.commonLogic.getEndPoints(endPoint, filterObject)
  }

  addCity(cityObject: AddCityModel) {
    const endPoint = `/api/Cities`;
    return this.commonLogic.addAndEditEndPoints(endPoint, cityObject, 'post')
  }

  updateCity(cityObject: UpdateCityModel) {
    const endPoint = `/api/Cities/${cityObject.id}`;
    return this.commonLogic.addAndEditEndPoints(endPoint, cityObject, 'put')
  }

  deleteCiteis(ids: string[] | number[]) {
    const endPoint = `/api/Cities`;
    return this.commonLogic.deleteArrayEndPoints(endPoint, ids)
  }


}
