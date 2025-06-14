import { Routes } from '@angular/router';
import { homeRoutes } from './modules/home/home.routes';
import { authGuard } from './global/services/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        loadComponent: () => import('./modules/home/home.component').then(c => c.HomeComponent),
        children: homeRoutes,
        canActivate: [authGuard],
    },
    {
        path: 'auth',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            },
            {
                path: 'login',
                loadComponent: () => import('./modules/auth/login/login.component').then(c => c.LoginComponent),
            },
            {
                path: 'signup',
                loadComponent: () => import('./modules/auth/sign-up/sign-up.component').then(c => c.SignUpComponent),
            },
        ]
    },
];
