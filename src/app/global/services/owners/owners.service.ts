import { Injectable } from '@angular/core';
import { CommonLogicService } from '../general/common-logic.service';
import { AddOwnerModel, OwnersFilterModel, UpdateOwnerModel } from '../../models/owner.models';

@Injectable({
  providedIn: 'root'
})
export class OwnersService {

  constructor(
    private commonLogic: CommonLogicService,
  ) { }

  getOwners(filterObject: OwnersFilterModel) {
    const endPoint = `/api/Owners`;
    return this.commonLogic.getEndPoints(endPoint, filterObject)
  }

  addOwner(ownerObject: AddOwnerModel) {
    const endPoint = `/api/Owners`;
    return this.commonLogic.addAndEditEndPoints(endPoint, ownerObject, 'post')
  }

  updateOwner(ownerObject: UpdateOwnerModel) {
    const endPoint = `/api/Owners/${ownerObject.id}`;
    return this.commonLogic.addAndEditEndPoints(endPoint, ownerObject, 'put')
  }

  deleteOwners(ids: string[] | number[]) {
    const endPoint = `/api/Owners`;
    return this.commonLogic.deleteArrayEndPoints(endPoint, ids)
  }

}
