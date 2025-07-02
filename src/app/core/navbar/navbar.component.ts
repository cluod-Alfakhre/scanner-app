import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { ToggleThemeModeService } from '../../global/services/toggle-theme-mode.service';
import { AuthService } from '../../global/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    BreadcrumbComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  openNavMenu!: boolean;

  constructor(
    private toggleThemModeServie: ToggleThemeModeService,
    private authService: AuthService,
    private elementRef: ElementRef<HTMLElement>,
  ) { }


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
  }

  logout() {
    this.authService.logout()
  }

  doOpenNavMenu() {
    this.openNavMenu = !this.openNavMenu;
  }

}
