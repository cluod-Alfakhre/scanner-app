import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  private requestCount = 0;

  show() {
    this.requestCount++;
    setTimeout(() => {
      this.loadingSubject.next(true);
    }, 100);
  }

  hide() {
    this.requestCount = Math.max(this.requestCount - 1, 0);
    if (this.requestCount === 0) {
      setTimeout(() => {
        this.loadingSubject.next(false);
      }, 100);
    }
  }

}
