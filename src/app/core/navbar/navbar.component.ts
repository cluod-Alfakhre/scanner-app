import { Component, effect, ElementRef, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { ToggleThemeModeService } from '../../global/services/toggle-theme-mode.service';
import { AuthService } from '../../global/services/auth/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    BreadcrumbComponent,
    MatTooltipModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  openNavMenu!: boolean;
  isDarkMode!: boolean;

  constructor(
    private toggleThemModeServie: ToggleThemeModeService,
    private authService: AuthService,
    private elementRef: ElementRef<HTMLElement>,
    private router: Router,
  ) {
    effect(() => {
      this.isDarkMode = this.toggleThemModeServie.isDarkMode()
    })
  }


  @HostListener('document:click', ['$event.target'])
  onClick(target: any) {
    const clickedInside = this.elementRef.nativeElement.querySelector('.links-wrapper')?.contains(target);
    const clickedInsideBtn = this.elementRef.nativeElement.querySelector('#nav_menu_btn')?.contains(target);
    if (!clickedInside && !clickedInsideBtn && this.openNavMenu) {
      this.openNavMenu = false;
    }
  }

  toggleTheme() {
    this.toggleThemModeServie.toggleDarkMode()
    this.isDarkMode = this.toggleThemModeServie.isDarkMode()
  }

  goToProfile() {
    this.router.navigate(['/home/user-profile'])
  }

  logout() {
    this.authService.logout()
  }

  doOpenNavMenu() {
    this.openNavMenu = !this.openNavMenu;
  }

}
