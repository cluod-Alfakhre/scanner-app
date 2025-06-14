import { Injectable } from '@angular/core';
import { CommonLogicService } from '../general/common-logic.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private commonLogic: CommonLogicService,
  ) { }

  getUsers(filterObject: any) {
    const endPoint = `/api/Owners`;
    return this.commonLogic.getEndPoints(endPoint, filterObject)
  }

  addUser(ownerObject: any) {
    const endPoint = `/api/Owners`;
    return this.commonLogic.addAndEditEndPoints(endPoint, ownerObject, 'post')
  }

  updateUser(ownerObject: any) {
    const endPoint = `/api/Owners`;
    return this.commonLogic.addAndEditEndPoints(endPoint, ownerObject, 'put')
  }

  deleteUsers(ids: string[] | number[]) {
    const endPoint = `/api/Owners`;
    return this.commonLogic.deleteArrayEndPoints(endPoint, ids)
  }

}
