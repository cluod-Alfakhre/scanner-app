import { CommonModule } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { CitiesService } from '../../../global/services/cities/cities.service';
import { debounceTime, distinctUntilChanged, map, Observable, Subject } from 'rxjs';
import { UpsertCityComponent } from './upsert-city/upsert-city.component';
import { CitiesFilterModel, CityItemModel } from '../../../global/models/city.models';
import { GridMenuComponent } from '../../../global/shared/ag-grid/grid-menu/grid-menu.component';
import { contextMenuItem } from '../../../global/shared/components/context-menu/context-menu.component';
import { ToasterService } from '../../../global/services/toaster.service';
import { ConfirmBoxComponent } from '../../../global/shared/components/confirm-box/confirm-box.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cities',
  imports: [
    AgGridModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss'
})
export class CitiesComponent {

  citiesList$!: Observable<CityItemModel[]>;

  filterObject: CitiesFilterModel = {
    SearchValue: '',
    Page: 1,
    PageSize: 25,
  };

  private searchSubject = new Subject<string>();

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    {
      field: "name",
      headerName: 'اسم المدينة',
    },
    {
      field: "cityNumber",
      headerName: 'رقم المدينة',
    },
    {
      headerName: 'خيارات',
      flex: 1,
      minWidth: 100,
      cellStyle: {
        'text-align': 'end',
      },
      cellRenderer: GridMenuComponent,
      cellRendererParams: (params: any) => {
        const itemsMenu: contextMenuItem[] = [
          {
            label: 'تعديل',
            icon: 'edit',
            onClick: () => {
              this.openUpsertCity(params.data)
            }
          },
          {
            label: 'حذف',
            icon: 'delete',
            onClick: () => {
              this.openConfirmDelete(params.data.id)
            }
          },
        ]
        return {
          itemsMenu
        }
      }
    },
  ];

  constructor(
    private dialogService: MatDialog,
    private citiesService: CitiesService,
    private toasterService: ToasterService,
    private destroyRef: DestroyRef,
  ) {
    this.getCities(this.filterObject)
  }

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(500), // Wait 300ms after last input
      distinctUntilChanged(), // Only emit if value changed
      takeUntilDestroyed(this.destroyRef) // Clean up on component destroy
    ).subscribe(searchValue => {
      this.getCities(this.filterObject);
    });
  }

  getCities(filterObject: CitiesFilterModel) {
    this.citiesList$ = this.citiesService.getCities(filterObject).pipe(
      map((res: any) => res.data)
    )
  }


  openConfirmDelete(cityId: string) {
    this.dialogService.open(ConfirmBoxComponent)
      .afterClosed().subscribe({
        next: (res: any) => {
          if (!res) return;
          this.deleteCiteis(cityId)
        }
      })
  }

  deleteCiteis(cityId: string) {
    this.citiesService.deleteCiteis([cityId])
      .subscribe({
        next: (res) => {
          this.toasterService.success('تم حذف مدينة بنجاح')
        }
      })
  }

  openUpsertCity(cityData = null) {
    this.dialogService.open(UpsertCityComponent, {
      data: cityData
    }).afterClosed().subscribe({
      next: (res => {
        if (!res) return
        this.getCities(this.filterObject)
      })
    })

  }

  onSearchChange(searchValue: string) {
    this.searchSubject.next(searchValue);
  }

}
