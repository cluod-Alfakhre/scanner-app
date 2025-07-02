import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { RealestateItemModel } from '../../../../global/models/realestate.models';
import { RealestatesService } from '../../../../global/services/realestates/realestates.service';
import { ToasterService } from '../../../../global/services/toaster.service';
import { GridMenuComponent } from '../../../../global/shared/ag-grid/grid-menu/grid-menu.component';
import { contextMenuItem } from '../../../../global/shared/components/context-menu/context-menu.component';
import { ConfirmBoxComponent } from '../../../../global/shared/components/confirm-box/confirm-box.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-realestate-details',
  imports: [
    AgGridModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './realestate-details.component.html',
  styleUrl: './realestate-details.component.scss'
})
export class RealestateDetailsComponent {

  colDefs: ColDef[] = [
    {
      field: "name",
      headerName: 'اسم الفرع',
    },
    {
      field: "owner.fullName",
      headerName: 'اسم المالك',
    },
    /* {
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
    }, */
    {
      field: "area",
      headerName: 'مساحة المزرعة',
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
            label: 'عرض المستندات',
            icon: 'visibility',
            onClick: () => {
              this.openBranchDocuments(params.data)
            }
          },
          {
            label: 'تعديل',
            icon: 'edit',
            onClick: () => {
              this.openUpsertBranch(params.data)
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

  realestateData!: RealestateItemModel | null;

  branchesList$!: Observable<any>;

  constructor(
    private dialogService: MatDialog,
    private datePipe: DatePipe,
    private toasterService: ToasterService,
    private realestatesService: RealestatesService,
    private router: Router,
  ) {
    effect(() => {
      this.realestateData = realestatesService.realestateData()
      if (this.realestateData) {
        this.getRealestateBranches(this.realestateData.id)
      }
    })
  }

  getRealestateBranches(farmId: number | string) {

  }

  openUpsertBranch(branchData: any = null) {

  }
  

  openConfirmDelete(branchId: string) {
    this.dialogService.open(ConfirmBoxComponent)
      .afterClosed().subscribe({
        next: (res: any) => {
          if (!res) return;
        }
      })
  }

  openBranchDocuments(branchData: any = null) {
    this.realestatesService.realestateData.update(v => branchData)
    localStorage.setItem('realestateData', JSON.stringify(branchData))
    this.router.navigate([`/home/realestates/realestate-documents/`])
  }

}
