import { Component, Inject, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ToasterService } from '../../../../global/services/toaster.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProjectsService } from '../../../../global/services/projects/projects.service';
import { AddProjectModel, UpdateProjectModel } from '../../../../global/models/project.model';
import { ListDataService } from '../../../../global/services/list-data/list-data.service';
import { forkJoin, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CityItemModel } from '../../../../global/models/city.models';

@Component({
  selector: 'app-upsert-project',
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
  ],
  templateUrl: './upsert-project.component.html',
  styleUrl: './upsert-project.component.scss'
})
export class UpsertProjectComponent {

  projectForm: FormGroup<any> = new FormGroup({
    id: new FormControl('', [Validators.min(0)]),
    name: new FormControl('', [Validators.required, Validators.min(3)]),
    projectNumber: new FormControl('', [Validators.required, Validators.pattern(/^[1-9][0-9]?$/)]),
    cityId: new FormControl('', [Validators.required, Validators.min(0)]),
  })

  disableUpsertButton: boolean = false;

  selectInputsData$!: Observable<{ cities: CityItemModel[] }>;

  constructor(
    private dialogRef: MatDialogRef<any>,
    private projectsService: ProjectsService,
    private toasterService: ToasterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private listDataService: ListDataService,
  ) { }

  ngOnInit() {
    if (this.data) {
      this.projectForm.patchValue(this.data)
    }
    this.getListsData()
  }

  getListsData() {
    this.selectInputsData$ = forkJoin({
      cities: this.listDataService.getCities({}).pipe(map(res => res.data)),
    })
  }

  addProject(projectObject: AddProjectModel) {
    this.projectsService.addProject(projectObject)
      .subscribe({
        next: (res) => {
          this.toasterService.success('تم إضافة مشروع بنجاح.')
          this.close(true);
        },
        error: () => this.disableUpsertButton = false
      })
  }

  updateProject(projectObject: UpdateProjectModel) {
    this.projectsService.updateProject(projectObject)
      .subscribe({
        next: (res) => {
          this.toasterService.success('تم تعديل مشروع بنجاح.')
          this.close(true)
        },
        error: () => this.disableUpsertButton = false
      })
  }

  confirm() {
    if (this.projectForm.invalid || this.disableUpsertButton) {
      this.toasterService.markInvalidControls(this.projectForm.controls)
      return
    }

    this.projectForm.value.projectNumber = this.projectForm.value.projectNumber.toString()
    if (this.data) {
      this.updateProject(this.projectForm.value)
    }
    else {
      this.addProject(this.projectForm.value)
    }
  }

  close(state = false): void {
    this.dialogRef.close(state);
  }

}
