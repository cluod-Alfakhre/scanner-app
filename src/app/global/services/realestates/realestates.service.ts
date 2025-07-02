import { Injectable, signal, WritableSignal } from '@angular/core';
import { CommonLogicService } from '../general/common-logic.service';
import { AddRealestateModel, RealestateItemModel, RealestatesFilterModel, UpdateRealestateModel } from '../../models/realestate.models';
import { HttpClient } from '@angular/common/http';
import { ConfigsService } from '../general/configs.service';

@Injectable({
  providedIn: 'root'
})
export class RealestatesService {

  realestateData: WritableSignal<RealestateItemModel | null> = signal(null);

  constructor(
    private commonLogic: CommonLogicService,
    private http: HttpClient,
    private configs: ConfigsService,
  ) {
    const realestateStrg = localStorage.getItem('realestateData');
    if (realestateStrg) {
      this.realestateData.update(v => JSON.parse(realestateStrg))
    }
  }

  getFilesTree() {
    const endPoint = `/api/FarmDocuments/tree`;
    return this.commonLogic.getEndPoints(endPoint)
  }

  getRealestates(filterObject: RealestatesFilterModel) {
    const endPoint = `/api/Farms`;
    return this.commonLogic.getEndPoints(endPoint, filterObject)
  }

  getRealestateFiles(farmId: string | number) {
    const endPoint = `/api/FarmDocuments/${farmId}`;
    return this.commonLogic.getEndPoints(endPoint)
  }

  getDocument(documentId: string | number) {
    const endPoint = `/api/FarmDocuments/preview/${documentId}`;
    return this.commonLogic.getEndPointsWithOptions(endPoint, {
      responseType: 'blob',
      Accept: '*/*',
    })
  }

  uploadFarmFiles(farmFiles: FormData) {
    const endPoint = `/api/FarmDocuments/upload`;
    return this.http.post(`${this.configs.getAPILink() + endPoint}`, farmFiles, {})
  }

  deleteRealestateFile(documentId: string | number) {
    const endPoint = `/api/FarmDocuments/${documentId}`;
    return this.commonLogic.deleteEndPoints(endPoint)
  }

  addRealestate(realestateObject: AddRealestateModel) {
    console.log(realestateObject);
    
    const endPoint = `/api/Farms`;
    return this.commonLogic.addAndEditEndPointsWithFormData(endPoint, realestateObject, 'post')
  }

  updateRealestate(realestateObject: UpdateRealestateModel) {
    const endPoint = `/api/Farms`;
    return this.commonLogic.addAndEditEndPoints(endPoint, realestateObject, 'put')
  }

  deleteRealestate(ids: string[] | number[]) {
    const endPoint = `/api/Farms`;
    return this.commonLogic.deleteArrayEndPoints(endPoint, ids)
  }

  getRealestateBranches(farmId: string | number) {
    const endPoint = `/api/FarmBranches/farm/${farmId}`;
    return this.commonLogic.getEndPoints(endPoint)
  }

}
