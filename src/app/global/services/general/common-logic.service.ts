import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigsService } from './configs.service';

@Injectable({
  providedIn: 'root'
})
export class CommonLogicService {

  constructor(
    private http: HttpClient,
    private configs: ConfigsService,
  ) {     
  }


  getEndPoints(endPoint: string, filterObject: any = null): Observable<any> {
    filterObject = this.configs.removeNull(filterObject);
    return this.http.get(`${this.configs.getAPILink() + endPoint}`, { params: { ...filterObject } })
  }

  getEndPointsWithOptions(endPoint: string, options: any): Observable<any> {
    options.params = this.configs.removeNull(options.params)
    return this.http.get(`${this.configs.getAPILink() + endPoint}`, options)
  }

  addAndEditEndPoints(endPoint: string, postObject:any, apiMethod: 'post' | 'put' | 'patch', options = null, removeNull = true): Observable<any> {
    if (removeNull) {
      postObject = this.configs.removeNull(postObject);
    }
    if (options) {//if there is option like in print requests
      return this.http[apiMethod](`${this.configs.getAPILink() + endPoint}`, { ...postObject }, options)
    }
    else {
      return this.http[apiMethod](`${this.configs.getAPILink() + endPoint}`, { ...postObject })
    }
  }

  addAndEditEndPointsWithFormData(endPoint: string, postObject:any, apiMethod: 'post' | 'put' | 'patch', options = null): Observable<any> {
    postObject = this.configs.removeNull(postObject);
    const formData = new FormData();
    for (const key in postObject) {
      if (postObject.hasOwnProperty(key)) {
        formData.append(key, postObject[key]);
      }
    }
    if (options) {//if there is option like in print requests
      return this.http[apiMethod](`${this.configs.getAPILink() + endPoint}`, formData, options)
    }
    else {
      return this.http[apiMethod](`${this.configs.getAPILink() + endPoint}`, formData, {})
    }
  }

  deleteEndPoints(endPoint: string): Observable<any> {

    return this.http.delete(`${this.configs.getAPILink() + endPoint}`)

  }

  deleteArrayEndPoints(endPoint: string, array: any[]): Observable<any> {

    return this.http.delete(`${this.configs.getAPILink() + endPoint}`, { body: array })

  }
  deleteEndPointsWithCustomBody(endPoint: string, body: any): Observable<any> {

    return this.http.delete(`${this.configs.getAPILink() + endPoint}`, { body: { ...body } })

  }

  multipleDeleteEndPoints(endPoint: string, ids:any): Observable<any> {

    return this.http.delete(`${this.configs.getAPILink() + endPoint}`, { body: { ids } })

  }


}
