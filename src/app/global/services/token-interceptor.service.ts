import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';


export const tokenInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {

  const token = localStorage.getItem('auth_token'); // Get token from storage

  if (token) {
    const modifiedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(modifiedRequest);
  }
  return next(request);
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