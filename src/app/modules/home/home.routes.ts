import { inject } from "@angular/core";
import { CanActivateFn, Routes } from "@angular/router";
import { AuthService } from "../../global/services/auth/auth.service";

export const isSuperAdminGuard: CanActivateFn = (route, state) => {
    const authService: AuthService = inject(AuthService)

    if (authService.isSuperAdmin()) {
        return true;
    }

    return false;

};


export const homeRoutes: Routes = [
    {
        path: '',
        redirectTo: 'files-tree',
        pathMatch: 'full',
    },
    {
        path: 'user-profile',
        loadComponent: () => import('../user-profile/user-profile.component').then(c => c.UserProfileComponent),
        data: {
            pageTitle: 'ملف المستخدم',
        },
    },
    {
        path: 'users',
        loadComponent: () => import('../components/users/users.component').then(c => c.UsersComponent),
        data: {
            pageTitle: 'المستخدمين',
        },
    },
    {
        path: 'owners',
        loadComponent: () => import('../components/owners/owners.component').then(c => c.OwnersComponent),
        data: {
            pageTitle: 'ملاك المزارع',
        },
    },
    {
        path: 'realestates',
        data: {
            pageTitle: 'المزارع',
        },
        children: [
            {
                path: '',
                redirectTo: 'main',
                pathMatch: 'full',
            },
            {
                path: 'main',
                loadComponent: () => import('../components/realestates/realestates.component').then(c => c.RealestatesComponent),
                data: {
                    pageTitle: 'عرض-المزارع',
                },
            },
            {
                path: 'realestate-details',
                loadComponent: () => import('../components/realestates/realestate-details/realestate-details.component').then(c => c.RealestateDetailsComponent),
                data: {
                    pageTitle: 'تفاصيل المزرعة',
                },
            },
            {
                path: 'realestate-documents',
                loadComponent: () => import('../components/realestates/realestate-documents/realestate-documents.component').then(c => c.RealestateDocumentsComponent),
                data: {
                    pageTitle: 'مستندات المزرعة',
                },
            },
        ]
    },
    {
        path: 'projects',
        loadComponent: () => import('../components/projects/projects.component').then(c => c.ProjectsComponent),
        data: {
            pageTitle: 'المشاريع',
        },
    },
    {
        path: 'cities',
        loadComponent: () => import('../components/cities/cities.component').then(c => c.CitiesComponent),
        data: {
            pageTitle: 'المدن',
        },
    },
    {
        path: 'files-tree',
        loadComponent: () => import('../components/files-tree/files-tree.component').then(c => c.FilesTreeComponent),
        data: {
            pageTitle: 'كل الملفات',
        },
    },
    {
        path: 'organization',
        loadComponent: () => import('../components/organization/organization.component').then(c => c.OrganizationComponent),
        canActivate: [isSuperAdminGuard],
        data: {
            pageTitle: 'إعدادات المؤسسة',
        },
    },
]