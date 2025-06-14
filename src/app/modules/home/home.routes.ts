import { Routes } from "@angular/router";

export const homeRoutes: Routes = [
    {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
    },
    {
        path: 'main',
        loadComponent: () => import('../main/main.component').then(c => c.MainComponent),
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
            pageTitle: 'العقارات',
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
                    pageTitle: 'عرض-العقارات',
                },
            },
            {
                path: 'realestate-details',
                loadComponent: () => import('../components/realestates/realestate-details/realestate-details.component').then(c => c.RealestateDetailsComponent),
                data: {
                    pageTitle: 'تفاصيل العقار',
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
]