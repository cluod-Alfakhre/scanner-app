import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { ToasterService } from './toaster.service';
import { LoadingService } from './loading-service.service';


export const tokenInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {

  const token = localStorage.getItem('auth_token'); // Get token from storage
  const toasterService = inject(ToasterService);
  const loadingService = inject(LoadingService);

  let modifiedRequest = request;

  if (token) {
    modifiedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  loadingService.show();

  return next(modifiedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(error);

      if (error.status == 500) {
        toasterService.danger(`حدث خطأ :${error.message}`)
      }
      toasterService.danger(` خطأ :${error.error?.message || error.message}`)
      return throwError(() => error);
    }),
    finalize(() => loadingService.hide())
  );
}

/* @Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('worked');

    const token = localStorage.getItem('auth_token'); // Get token from storage

    if (token) {
      const modifiedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(modifiedRequest);
    }
    return next.handle(request);
  }
}
 */