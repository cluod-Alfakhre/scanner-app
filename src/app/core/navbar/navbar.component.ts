import { Component } from '@angular/core';
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

  constructor(
    private toggleThemModeServie: ToggleThemeModeService,
    private authService: AuthService,
  ) { }

  toggleTheme() {
    this.toggleThemModeServie.toggleDarkMode()
  }

  logout() {
    this.authService.logout()
  }
  
}
