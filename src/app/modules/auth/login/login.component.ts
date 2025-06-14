import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ToasterService } from '../../../global/services/toaster.service';
import { AuthService } from '../../../global/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup<any> = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  })

  showPassword: boolean = false;

  constructor(
    private toasterService: ToasterService,
    private authService: AuthService,
    private router: Router,
  ) { }

  login(username: string, password: string) {
    this.authService.login(username, password)
      .subscribe({
        next: (res: any) => {
          //nav to home
          this.router.navigate(['/home'])
          this.toasterService.success('تم تسجيل الدخول بنجاح')
        }
      })
  }

  confirm() {
    if (this.loginForm.invalid) {
      this.toasterService.markInvalidControls(this.loginForm.controls)
      return
    }
    const { username, password } = this.loginForm.value;
    this.login(username, password)
  }

}
