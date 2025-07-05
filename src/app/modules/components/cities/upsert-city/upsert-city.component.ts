import { Component, Inject, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { AddCityModel, UpdateCityModel } from '../../../../global/models/city.models';
import { CitiesService } from '../../../../global/services/cities/cities.service';
import { ToasterService } from '../../../../global/services/toaster.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-upsert-city',
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
    MatSelectModule,
    MatDividerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './upsert-city.component.html',
  styleUrl: './upsert-city.component.scss'
})
export class UpsertCityComponent {
  disableUpsertButton: boolean = false;

  cityForm: FormGroup<any> = new FormGroup({
    id: new FormControl('', [Validators.min(0)]),
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    cityNumber: new FormControl('', [Validators.required, Validators.min(1), Validators.max(99)]),
  })

  constructor(
    private dialogRef: MatDialogRef<any>,
    private citiesService: CitiesService,
    private toasterService: ToasterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    if (this.data) {
      this.cityForm.patchValue(this.data)
    }
  }

  addCity(cityObject: AddCityModel) {
    this.citiesService.addCity(cityObject)
      .subscribe({
        next: (res) => {
          this.toasterService.success('تم إضافة مدينة بنجاح.')
          this.close(true)
        },
        error: () => this.disableUpsertButton = false
      })
  }

  updateCity(cityObject: UpdateCityModel) {
    this.citiesService.updateCity(cityObject)
      .subscribe({
        next: (res) => {
          this.toasterService.success('تم تعديل مدينة بنجاح.')
          this.close(true)
        },
        error: () => this.disableUpsertButton = false
      })
  }

  padToFourDigits(num: number) {
    return num.toString().padStart(2, '0');
  }

  confirm() {
    if (this.cityForm.invalid || this.disableUpsertButton) {
      this.toasterService.markInvalidControls(this.cityForm.controls)
      return
    }

    this.disableUpsertButton = true;

    const cityData = this.cityForm.getRawValue()
    cityData.cityNumber = this.padToFourDigits(cityData.cityNumber)

    if (this.data) {
      this.updateCity(cityData)
    }
    else {
      this.addCity(cityData)
    }
  }

  close(state = false): void {
    this.dialogRef.close(state);
  }

}
