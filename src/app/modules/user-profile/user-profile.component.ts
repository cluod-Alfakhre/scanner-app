import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../global/services/auth/auth.service';

@Component({
  selector: 'app-main',
  imports: [
    //RouterLink,
    MatIconModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  userData: any;

  constructor(
    private authService: AuthService,
  ) {
    this.userData = authService.getUserData()
  }



}
