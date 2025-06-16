import { Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { RealestatesService } from '../../../../global/services/realestates/realestates.service';
import { AddRealestateModel, UpdateRealestateModel } from '../../../../global/models/realestate.models';
import { ToasterService } from '../../../../global/services/toaster.service';
import { ListDataService } from '../../../../global/services/list-data/list-data.service';
import { forkJoin, map, Observable } from 'rxjs';
import { ProjectItemModel } from '../../../../global/models/project.model';
import { OwnerItemModel } from '../../../../global/models/owner.models';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-upsert-realestate',
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
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './upsert-realestate.component.html',
  styleUrl: './upsert-realestate.component.scss'
})
export class UpsertRealestateComponent {

  realestateForm: FormGroup<any> = new FormGroup({
    id: new FormControl('', [Validators.min(0)]),
    farmNumber: new FormControl('', [Validators.required, Validators.min(1)]),
    area: new FormControl('', [Validators.required, Validators.min(0)]),
    projectId: new FormControl('', [Validators.required, Validators.min(0)]),
    ownerId: new FormControl('', [Validators.required, Validators.min(0)]),
    north: new FormControl('', [Validators.minLength(3)]),
    south: new FormControl('', [Validators.minLength(3)]),
    east: new FormControl('', [Validators.minLength(3)]),
    west: new FormControl('', [Validators.minLength(3)]),
  })

  disableUpsertButton: boolean = false;

  selectInputsData$!: Observable<{ projects: ProjectItemModel[], owners: OwnerItemModel[] }>;

  farmFiles!: FileList | null;

  constructor(
    private dialogRef: MatDialogRef<any>,
    private realestatesService: RealestatesService,
    private toasterService: ToasterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private listDataService: ListDataService,
  ) { }

  ngOnInit() {
    if (this.data?.formData) {
      this.realestateForm.get('id')?.addValidators(Validators.required)
      this.realestateForm.patchValue({
        ...this.data.formData,
        ...this.data.formData.boundaries,
        ownerId: this.data.formData.owner.id,
      })
    }

    if (this.data.ownerId) {
      this.realestateForm.get('ownerId')?.disable();
      this.realestateForm.patchValue({
        ownerId: this.data.ownerId,
      })
    }

    this.getListsData()
  }

  getListsData() {
    this.selectInputsData$ = forkJoin({
      projects: this.listDataService.getProjects({}).pipe(map(res => res.data)),
      owners: this.listDataService.getOwners({}).pipe(map(res => res.data))
    })
  }

  addRealestate(realestateObject: AddRealestateModel) {
    this.realestatesService.addRealestate(realestateObject)
      .subscribe({
        next: (res) => {
          this.toasterService.success('تم إضافة مزرعة بنجاح.')
          this.close(true)
          if (this.farmFiles) {
            this.uploadFarmFiles([...this.farmFiles], res.farmId)
          }
        },
        error: () => this.disableUpsertButton = false
      })
  }

  updateRealestate(realestateObject: UpdateRealestateModel) {
    this.realestatesService.updateRealestate(realestateObject)
      .subscribe({
        next: (res) => {
          this.toasterService.success('تم تعديل مزرعة بنجاح.')
          this.close(true)
          if (this.farmFiles) {
            this.uploadFarmFiles([...this.farmFiles], realestateObject.id)
          }
        },
        error: () => this.disableUpsertButton = false
      })
  }

  onFilesSelected(event: any) {
    this.farmFiles = event.target.files;
  }

  joinFilesNames(files: FileList): string {
    const filesNames: any[] = []
    for (const file of files) {
      filesNames.push(file.name)
    }
    return filesNames.join(', ')
  }

  uploadFarmFiles(files: File[], farmId: string | number) {
    const formData = new FormData();

    // Append each file to the FormData object
    files.forEach((file, index) => {
      console.log(file);
      
      formData.append(`files`, file, file.name);
    });

    // Add any additional data if needed
    console.log(farmId);
    
    formData.append('farmId', farmId + '');

    this.realestatesService.uploadFarmFiles(formData)
      .subscribe({
        next: (res: any) => {
          this.toasterService.success('تم رفع ملفات المزرعة بنجاح')
        }
      })
  }

  cancelSelectedFiles() {
    this.farmFiles = null;

  }

  confirm() {
    if (this.realestateForm.invalid || this.disableUpsertButton) {
      this.toasterService.markInvalidControls(this.realestateForm.controls)
      return
    }

    this.disableUpsertButton = true;

    if (this.data?.formData) {
      this.updateRealestate(this.realestateForm.getRawValue())
    }
    else {
      this.addRealestate(this.realestateForm.getRawValue())
    }
  }

  close(state = false): void {
    this.dialogRef.close(state);
  }

}
