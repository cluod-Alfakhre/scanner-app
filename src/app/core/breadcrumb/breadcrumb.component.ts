import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  imports: [],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {

  pageTitle: string = '';

  currentRoutesTitles: string[] = ['/الرئيسية'];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {

    this.pageTitle = activatedRoute.firstChild?.snapshot?.data['pageTitle']

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoutesTitles = ['/الرئيسية']
        // Check if there's a child route with data
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
          if (route.snapshot.data['pageTitle']) {
            this.currentRoutesTitles.push(route.snapshot.data['pageTitle'])
          }
        }

        this.pageTitle = route.snapshot.data['pageTitle'];
      });
  }

}
