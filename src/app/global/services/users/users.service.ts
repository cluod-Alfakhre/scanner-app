import { Injectable } from '@angular/core';
import { CommonLogicService } from '../general/common-logic.service';
import { AddUserModel, UpdateUserModel, UsersFilterModel } from '../../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private commonLogic: CommonLogicService,
  ) { }

  getUsers(filterObject: UsersFilterModel) {
    const endPoint = `/api/Users`;
    return this.commonLogic.getEndPoints(endPoint, filterObject)
  }

  addUser(userObject: AddUserModel) {
    const endPoint = `/api/Auth/register`;
    return this.commonLogic.addAndEditEndPoints(endPoint, userObject, 'post')
  }

  updateUser(userObject: UpdateUserModel) {
    const endPoint = `/api/Users/${userObject?.id}`;
    return this.commonLogic.addAndEditEndPoints(endPoint, userObject, 'put')
  }

  deleteUser(id: string | number) {
    const endPoint = `/api/Users/${id}`;
    return this.commonLogic.deleteEndPoints(endPoint)
  }

}
