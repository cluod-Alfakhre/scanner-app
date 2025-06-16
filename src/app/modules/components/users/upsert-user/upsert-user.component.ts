import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PhoneNumberValidations } from '../../owners/upsert-owner/upsert-owner.component';
import { UsersService } from '../../../../global/services/users/users.service';
import { ToasterService } from '../../../../global/services/toaster.service';
import { AddUserModel, UpdateUserModel } from '../../../../global/models/user.models';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-upsert-user',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    //MatDialogClose,
    MatCheckboxModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
  ],
  templateUrl: './upsert-user.component.html',
  styleUrl: './upsert-user.component.scss'
})
export class UpsertUserComponent {


  userForm: FormGroup<any> = new FormGroup({
    id: new FormControl('', [Validators.min(0)]),
    fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    username: new FormControl('', [Validators.required]),
    adress: new FormControl('s', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [PhoneNumberValidations]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    roleId: new FormControl(2, [Validators.required]),
    isActive: new FormControl(false, [Validators.required]),
  })

  disableUpsertButton: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<any>,
    private dialogService: MatDialog,
    private usersService: UsersService,
    private toasterService: ToasterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    if (this.data) {
      this.userForm.get('password')?.removeValidators(Validators.required)
      this.userForm.get('id')?.addValidators(Validators.required)
      this.userForm.patchValue(this.data)
    }
  }

  addUser(userObject: AddUserModel) {
    this.usersService.addUser(userObject)
      .subscribe({
        next: (res) => {
          this.toasterService.success('تم إضافة مستخدم بنجاح.')
          this.close(true)
        },
        error: () => this.disableUpsertButton = false
      })
  }

  updateUser(userObject: UpdateUserModel) {
    this.usersService.updateUser(userObject)
      .subscribe({
        next: (res) => {
          this.toasterService.success('تم تعديل المستخدم بنجاح.')
          this.close(true)
        },
        error: () => this.disableUpsertButton = false
      })
  }

  confirm() {
    if (this.userForm.invalid || this.disableUpsertButton) {
      this.toasterService.markInvalidControls(this.userForm.controls)
      return
    }
    this.disableUpsertButton = true

    if (this.data) {
      this.updateUser(this.userForm.value)
    }
    else {
      this.addUser(this.userForm.value)
    }
  }

  close(state = false): void {
    this.dialogRef.close(state);
  }

}
