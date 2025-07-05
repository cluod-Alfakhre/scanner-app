import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatTooltip,
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {

  pageTitle: string = '';

  currentRoutes: any[] = [
    {
      pageTitle: '/الرئيسية',
      pageRoute: '/',
    }
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
  ) {

    this.pageTitle = activatedRoute.firstChild?.snapshot?.data['pageTitle']

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoutes = [
          {
            pageTitle: '/الرئيسية',
            pageRoute: '/',
          }
        ]
        // Check if there's a child route with data
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
          if (route.snapshot.data['pageTitle']) {
            console.log(route.snapshot.url[0].path, router.url);
            const currentRoutePathIndex = router.url.indexOf(route.snapshot.url[0].path) + route.snapshot.url[0].path.length
            this.currentRoutes.push({
              pageTitle: route.snapshot.data['pageTitle'],
              pageRoute: router.url.substring(0, currentRoutePathIndex),
            })
          }
        }

        this.pageTitle = route.snapshot.data['pageTitle'];
      });
  }

  getBack(){
    this.location.back()
  }

}
