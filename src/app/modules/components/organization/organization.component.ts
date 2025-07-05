import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../global/services/auth/auth.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ToasterService } from '../../../global/services/toaster.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-organization',
  imports: [
    MatIconModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss'
})
export class OrganizationComponent {

  organizationData$!: Observable<any>;

  updateEnabled: boolean = false;

  organizationForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', []),
    email: new FormControl('', []),
    address: new FormControl('', []),
    logo: new FormControl(null, []),
  })

  disableUpsertButton: boolean = false;
  safeUrl: any;

  constructor(
    private authService: AuthService,
    private toasterService: ToasterService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.getOrganizationData()
    if (!this.updateEnabled) {
      this.organizationForm.disable()
    }
  }

  toggleUpdate() {
    this.updateEnabled = !this.updateEnabled;
    if (!this.updateEnabled) {
      this.organizationForm.disable()
    } else {
      this.organizationForm.enable()
    }
  }

  getOrganizationData() {
    this.organizationData$ = this.authService.getOrganizationData()
      .pipe(
        map(res => {
          this.organizationForm.patchValue(res)
          return res
        })
      )
  }

  updateOrganizationData(organizationData: any) {
    this.authService.updateOrganizationData(organizationData)
      .subscribe({
        next: (res: any) => {
          this.toasterService.success('تم تعديل بيانات المؤسسة بنجاح.')
          this.getOrganizationData()
          this.toggleUpdate()
        },
        complete: () => this.disableUpsertButton = false
      })
  }

  onImgChange(event: any) {
    if (event.target.files[0]) {
      this.organizationForm.get('logo')?.patchValue(event.target.files[0])
      this.createSafeUrl(event.target.files[0])

    } else {
      this.organizationForm.get('logo')?.patchValue(null)
      this.safeUrl = null;
    }
  }

  private createSafeUrl(blob: Blob) {
    // Method 1: For Base64 (permanent)
    const url = URL.createObjectURL(blob);
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  confirm() {
    if (this.organizationForm.invalid || this.disableUpsertButton) {
      this.toasterService.markInvalidControls(this.organizationForm.controls)
      return
    }
    this.disableUpsertButton = true;
    this.updateOrganizationData(this.organizationForm.getRawValue())
  }

}
