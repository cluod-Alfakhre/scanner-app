import { Component } from '@angular/core';
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
import { map } from 'rxjs';
import { GridMenuComponent } from '../../../global/shared/ag-grid/grid-menu/grid-menu.component';
import { contextMenuItem } from '../../../global/shared/components/context-menu/context-menu.component';
import { ToasterService } from '../../../global/services/toaster.service';
import { Router } from '@angular/router';
import { ConfirmBoxComponent } from '../../../global/shared/components/confirm-box/confirm-box.component';

@Component({
  selector: 'app-realestates',
  imports: [
    AgGridModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  providers: [DatePipe],
  templateUrl: './realestates.component.html',
  styleUrl: './realestates.component.scss'
})
export class RealestatesComponent {

  realestatesList$!: Observable<RealestateItemModel[]>;

  filterObject: RealestatesFilterModel = {
    SearchValue: '',
    Page: 1,
    PageSize: 25,
  };

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    {
      field: "farmNumber",
      headerName: 'رقم العقار',
    },
    {
      field: "owner.fullName",
      headerName: 'اسم المالك',
    },
    {
      field: "make",
      headerName: 'المشروع التابع له',
    },
    {
      field: "projectNumber",
      headerName: 'رقم المشروع',
    },
    {
      field: "make",
      headerName: 'المدينة التابع له',
    },
    {
      field: "cityNumber",
      headerName: 'رقم المدينة',
    },
    {
      field: "area",
      headerName: 'مساحة العقار',
    },
    {
      field: "boundaries.north",
      headerName: 'الحدود',
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
            onClick: () => {
              this.openRealestateDetails(params.data)
            }
          },
          {
            label: 'تعديل',
            icon: 'edit',
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
  ) {
    this.getRealestates(this.filterObject)
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
    this.router.navigate([`/home/realestates/realestate-details/`])
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

}
