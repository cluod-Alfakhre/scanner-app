import { Injectable } from '@angular/core';
import { CommonLogicService } from '../general/common-logic.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtHelper = new JwtHelperService()

  constructor(
    private commonLogic: CommonLogicService,
    private router: Router,
  ) { }

  login(username: string, password: string) {
    const endPoint = `/api/Auth/login`;
    return this.commonLogic.addAndEditEndPoints(endPoint, { username, password }, 'post')
      .pipe(
        map((res) => {
          localStorage.setItem('auth_token', res.token)
          localStorage.setItem('userData', JSON.stringify(res))
        })
      )
  }

  register(username: string, password: string) {
    const endPoint = `/api/Auth/register`;
    return this.commonLogic.addAndEditEndPoints(endPoint, { username, password }, 'post')
  }

  getUserData() {
    return JSON.parse(localStorage.getItem('userData')!)
  }

  getOrganizationData() {
    const endPoint = `/api/OrganizationInfo`
    return this.commonLogic.getEndPoints(endPoint)
  }

  updateOrganizationData(organizationData: any) {
    const endPoint = `/api/OrganizationInfo`
    return this.commonLogic.addAndEditEndPointsWithFormData(endPoint, organizationData, 'put')
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['/auth'])
  }

  isLoggedIn() {
    const token = localStorage.getItem('auth_token')
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true
    }

    return false
  }

  decodeToken() {
    const token = localStorage.getItem('auth_token')
    return this.jwtHelper.decodeToken(token || '')
  }

  isSuperAdmin() {
    if (this.decodeToken()?.role == 1) {
      return true
    }
    return false
  }

  isAdmin() {
    if (this.decodeToken()?.role == 1 || this.decodeToken()?.role == 2) {
      return true
    }
    return false
  }

}
