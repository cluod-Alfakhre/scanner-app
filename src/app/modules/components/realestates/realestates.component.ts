import { Component, DestroyRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { UpsertRealestateComponent } from './upsert-realestate/upsert-realestate.component';
import { RealestatesService } from '../../../global/services/realestates/realestates.service';
import { RealestateItemModel, RealestatesFilterModel } from '../../../global/models/realestate.models';
import { Observable } from 'rxjs/internal/Observable';
import { CommonModule, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, map, Subject } from 'rxjs';
import { GridMenuComponent } from '../../../global/shared/ag-grid/grid-menu/grid-menu.component';
import { contextMenuItem } from '../../../global/shared/components/context-menu/context-menu.component';
import { ToasterService } from '../../../global/services/toaster.service';
import { Router } from '@angular/router';
import { ConfirmBoxComponent } from '../../../global/shared/components/confirm-box/confirm-box.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RealestatesFilterComponent } from './realestates-filter/realestates-filter.component';
import { GridDropMenuComponent } from '../../../global/shared/ag-grid/grid-drop-menu/grid-drop-menu.component';
import { IsAdminDirective } from '../../../global/shared/directives/is-admin.directive';
import { AuthService } from '../../../global/services/auth/auth.service';

@Component({
  selector: 'app-realestates',
  imports: [
    AgGridModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    IsAdminDirective,
  ],
  providers: [DatePipe],
  templateUrl: './realestates.component.html',
  styleUrl: './realestates.component.scss'
})
export class RealestatesComponent {

  realestatesList$!: Observable<RealestateItemModel[]>;

  authService = inject(AuthService);

  filterObject: RealestatesFilterModel = {
    SearchValue: '',
    Page: 1,
    PageSize: 25,
    cityId: 0,
    projectId: 0
  };

  private searchSubject = new Subject<string>();

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    {
      field: "farmNumber",
      headerName: 'رقم مزرعة',
    },
    {
      field: "owner.fullName",
      headerName: 'اسم المالك',
    },
    {
      field: "projectName",
      headerName: 'المشروع التابع له',
    },
    {
      field: "projectNumber",
      headerName: 'رقم المشروع',
    },
    {
      field: "cityName",
      headerName: 'المدينة التابع له',
    },
    {
      field: "cityNumber",
      headerName: 'رقم المدينة',
    },
    {
      field: "area",
      headerName: 'مساحة المزرعة',
    },
    {
      field: "boundaries",
      headerName: 'الحدود',
      cellRenderer: GridDropMenuComponent,
      cellRendererParams: (params: any) => {
        const { east, west, north, south } = params.value;
        const itemsMenu: contextMenuItem[] = [
          {
            label: `شرق - ${east}`,
            icon: 'east',
          },
          {
            label: `غرب - ${west}`,
            icon: 'west',
          },
          {
            label: `شمال - ${north}`,
            icon: 'north',
          },
          {
            label: `جنوب - ${south}`,
            icon: 'south',
          },
        ]
        return {
          itemsMenu
        }
      }
    },
    {
      field: "createdAt",
      headerName: 'تاريخ الإضافة',
      cellDataType: 'date',
      cellRenderer: (params: any) => {
        return `${this.datePipe.transform(params.value, 'yyyy-MM-dd')}`
      }
    },
    /* {
      field: "electric",
      headerName: 'تاريخ التعديل',
    }, */
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
            label: 'عرض التفاصيل',
            icon: 'visibility',
            hidden: !this.authService.isAdmin(),
            onClick: () => {
              this.openRealestateDetails(params.data)
            }
          },
          {
            label: 'تعديل',
            icon: 'edit',
            hidden: !this.authService.isAdmin(),
            onClick: () => {
              this.openUpsertRealestate(params.data)
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
    private realestatesService: RealestatesService,
    private datePipe: DatePipe,
    private toasterService: ToasterService,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {
    this.getRealestates(this.filterObject)
  }

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(500), // Wait 300ms after last input
      distinctUntilChanged(), // Only emit if value changed
      takeUntilDestroyed(this.destroyRef) // Clean up on component destroy
    ).subscribe(searchValue => {
      this.getRealestates(this.filterObject);
    });
  }

  getRealestates(filterObject: any) {
    this.realestatesList$ = this.realestatesService.getRealestates(filterObject).pipe(
      map((res: any) => res['data'])
    )
  }

  openConfirmDelete(realestateId: string) {
    this.dialogService.open(ConfirmBoxComponent)
      .afterClosed().subscribe({
        next: (res: any) => {
          if (!res) return;
          this.deleteRealestate(realestateId)
        }
      })
  }

  deleteRealestate(realestateId: string) {
    this.realestatesService.deleteRealestate([realestateId])
      .subscribe({
        next: (res) => {
          this.toasterService.success('تم حذف مزرعة بنجاح')
          this.getRealestates(this.filterObject)
        }
      })
  }

  openRealestateDetails(realestateData: any = null) {
    this.realestatesService.realestateData.update(v => realestateData)
    localStorage.setItem('realestateData', JSON.stringify(realestateData))
    this.router.navigate([`/home/realestates/realestate-documents/`])
  }

  openUpsertRealestate(realestateData: any = null) {
    this.dialogService.open(UpsertRealestateComponent, {
      data: {
        formData: realestateData,
      },
    }).afterClosed().subscribe({
      next: (res => {
        if (!res) return
        this.getRealestates(this.filterObject)
      })
    })
  }

  openFilterComponent() {
    this.dialogService.open(RealestatesFilterComponent, {
      data: this.filterObject
    }).afterClosed().subscribe({
      next: (res => {
        if (!res) return
        this.getRealestates(this.filterObject)
      })
    })
  }

  onSearchChange(searchValue: string) {
    this.searchSubject.next(searchValue);
  }


}
