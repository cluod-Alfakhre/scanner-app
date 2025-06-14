import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {

  private appConfig: any;

  LoadConfigrations(): Promise<void> {
    return fetch('/configs/configs.json')
      .then((res: any) => {

        return res.json();
      }).then((res: any) => {
        this.appConfig = res;
        return this.appConfig;
      })
      .catch((err: any) => {
        console.error('Error loading configuration:', err);
        throw err; // Throw an error to stop app initialization
      });
  }

  getAPILink(): string {
    if (!this.appConfig) {
      throw new Error('App configuration is not loaded yet.');
    }
    return this.appConfig.API_IP;
  }

  removeNull(FilterObject: any) {
    const newObject = { ...FilterObject };
    for (const key in newObject) {
      if (Object.prototype.hasOwnProperty.call(newObject, key)) {
        const element = newObject[key];
        if (element === null || element === undefined || element === "null" || element === "" || element === "0") {
          delete newObject[key]
        }
      }
    }
    return newObject;
  }

}
