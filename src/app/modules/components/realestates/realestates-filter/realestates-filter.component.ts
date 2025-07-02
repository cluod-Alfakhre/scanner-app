import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RealestatesFilterModel } from '../../../../global/models/realestate.models';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { ListDataService } from '../../../../global/services/list-data/list-data.service';
import { forkJoin, map, Observable } from 'rxjs';
import { CityItemModel } from '../../../../global/models/city.models';
import { ProjectItemModel } from '../../../../global/models/project.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-realestates-filter',
  imports: [
    MatSelectModule,
    MatButtonModule,
    MatIcon,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './realestates-filter.component.html',
  styleUrl: './realestates-filter.component.scss'
})
export class RealestatesFilterComponent {

  selectInputsData$!: Observable<{ projects: ProjectItemModel[], cities: CityItemModel[] }>;

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: RealestatesFilterModel,
    private listDataService: ListDataService,
  ) { }

  ngOnInit() {
    this.getListsData()
  }

  getListsData() {
    this.selectInputsData$ = forkJoin({
      cities: this.listDataService.getCities({}).pipe(map(res => res.data)),
      projects: this.listDataService.getProjects({}).pipe(map(res => res.data)),
    })
  }

  cancelFiltering() {
    this.data.cityId = 0;
    this.data.projectId = 0;
    this.data.SearchValue = '';
    this.close(true)
  }

  close(state = false): void {
    this.dialogRef.close(state);
  }

}
