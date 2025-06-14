import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService)
  const router: Router = inject(Router)

  if (route.url[0].path == 'auth') {    
    if (authService.isLoggedIn()) {
      router.navigate(['/home'])
      return false;
    }
  }
  else if (!authService.isLoggedIn()) {
    router.navigate(['/auth'])
    return false;
  }

  return true;

};
