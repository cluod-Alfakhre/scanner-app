import { Component, Inject, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OwnersService } from '../../../../global/services/owners/owners.service';
import { ToasterService } from '../../../../global/services/toaster.service';
import { AddOwnerModel, UpdateOwnerModel } from '../../../../global/models/owner.models';
import { UpsertRealestateComponent } from '../../realestates/upsert-realestate/upsert-realestate.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


export function NationalNumberValidator(control: AbstractControl): { [key: string]: any } | null {


  const NationalNumber: string = control.value == null ? '' : control.value.toString();

  const Lastdigits = NationalNumber.substring(5);

  var Message = "";

  if (!NationalNumber.startsWith('1') && !NationalNumber.startsWith('2')) {

    Message = "يجب ان تكون  الخانة الاولى من الرقم الوطني 1 او 2"

  } else if (NationalNumber.length != 12) {

    Message = "يجب ان يكون عدد خانات الرقم الوطني 12 خانة"

  } else if (Lastdigits == "0000000") {

    Message = "لايسمح بأن يكون الرقم الوطني اصفار فقط"
  }

  return Message == "" ? null : {
    NationalNumberError: Message
  }
}

export function PhoneNumberValidations(control: AbstractControl): { [key: string]: any } | null {

  const phoneNumber: string = control.value == null ? '' : control.value.toString();

  if (phoneNumber == "")
    return null;

  var number = phoneNumber[0] + "" + phoneNumber[1] + phoneNumber[2];

  if (number != '091' && number != '092' && number != '094' && number != '095' && number != '093') {

    return {

      phoneError: 'يجب ان تكون بداية الرقم 091 او 092 او 094 او 095 او 093'
    }

  } else if (phoneNumber.length != 10) {

    return {

      phoneError: 'عدد خانات رقم الهاتف غير صحيحة'
    }
  }

  return null

}


@Component({
  selector: 'app-upsert-owner',
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
  ],
  templateUrl: './upsert-owner.component.html',
  styleUrl: './upsert-owner.component.scss'
})
export class UpsertOwnerComponent {

  ownerForm: FormGroup<any> = new FormGroup({
    id: new FormControl('', [Validators.min(0)]),
    fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    nationalId: new FormControl('', [Validators.required, NationalNumberValidator]),//to be validated with ay library
    phoneNumber: new FormControl('', [PhoneNumberValidations]),//to be validated with ay library
  })

  attachFile = new FormControl(false)

  disableUpsertButton: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<any>,
    private dialogService: MatDialog,
    private ownersService: OwnersService,
    private toasterService: ToasterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.data) {
      this.ownerForm.get('id')?.addValidators(Validators.required)
      this.ownerForm.patchValue(this.data)
    }
  }

  addOwner(ownerObject: AddOwnerModel) {
    this.ownersService.addOwner(ownerObject)
      .subscribe({
        next: (res) => {
          this.toasterService.success('تم إضافة مالك بنجاح.')
          this.close(true)
          if (this.attachFile.value) {
            this.openUpsertRealestate(res.id)
          }
        },
        error: () => this.disableUpsertButton = false
      })
  }

  updateOwner(ownerObject: UpdateOwnerModel) {
    this.ownersService.updateOwner(ownerObject)
      .subscribe({
        next: (res) => {
          this.toasterService.success('تم تعديل المالك بنجاح.')
          this.close(true)
        },
        error: () => this.disableUpsertButton = false
      })
  }

  openUpsertRealestate(ownerId: string | number) {
    this.dialogService.open(UpsertRealestateComponent, {
      data: {
        ownerId
      }
    })
      .afterClosed()
      .subscribe({
        next: (res => {
          if (!res) return
          this.router.navigate(['/home/realestate'])
        })
      })
  }

  confirm() {
    if (this.ownerForm.invalid || this.disableUpsertButton) {
      this.toasterService.markInvalidControls(this.ownerForm.controls)
      return
    }

    this.disableUpsertButton = true

    if (this.data) {
      this.updateOwner(this.ownerForm.value)
    }
    else {
      this.addOwner(this.ownerForm.value)
    }
  }

  close(state = false): void {
    this.dialogRef.close(state);
  }

}
