import { Component, DestroyRef } from '@angular/core';

import { type ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { UpsertOwnerComponent } from './upsert-owner/upsert-owner.component';
import { OwnersService } from '../../../global/services/owners/owners.service';
import { debounceTime, distinctUntilChanged, map, Observable, Subject } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { OwnerItemModel, OwnersFilterModel } from '../../../global/models/owner.models';
import { GridMenuComponent } from '../../../global/shared/ag-grid/grid-menu/grid-menu.component';
import { contextMenuItem } from '../../../global/shared/components/context-menu/context-menu.component';
import { ToasterService } from '../../../global/services/toaster.service';
import { ConfirmBoxComponent } from '../../../global/shared/components/confirm-box/confirm-box.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-owners',
  imports: [
    AgGridModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  providers: [DatePipe],
  templateUrl: './owners.component.html',
  styleUrl: './owners.component.scss'
})
export class OwnersComponent {

  ownersList$!: Observable<OwnerItemModel[]>;

  filterObject: OwnersFilterModel = {
    SearchValue: '',
    Page: 1,
    PageSize: 25,
  };

  private searchSubject = new Subject<string>();

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    {
      field: "fullName",
      headerName: 'اسم المالك',
    },
    {
      field: "nationalId",
      headerName: 'الرقم الوطني',
    },
    {
      field: "phoneNumber",
      headerName: 'رقم الهاتف',
    },
    {
      field: "farmsCount",
      headerName: 'عدد المزارع',
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
      field: "updatedAt",
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
            label: 'تعديل',
            icon: 'edit',
            onClick: () => {
              this.openUpsertOwner(params.data)
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
    private ownersService: OwnersService,
    private datePipe: DatePipe,
    private toasterService: ToasterService,
    private destroyRef: DestroyRef,
  ) {
    this.getOwners(this.filterObject)
  }

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(500), // Wait 300ms after last input
      distinctUntilChanged(), // Only emit if value changed
      takeUntilDestroyed(this.destroyRef) // Clean up on component destroy
    ).subscribe(searchValue => {
      this.getOwners(this.filterObject);
    });
  }

  getOwners(filterObject: any) {
    this.ownersList$ = this.ownersService.getOwners(filterObject).pipe(
      map((res: any) => res['data'])
    )
  }

  openConfirmDelete(ownerId: string) {
    this.dialogService.open(ConfirmBoxComponent)
      .afterClosed().subscribe({
        next: (res: any) => {
          if (!res) return;
          this.deleteOwner(ownerId)
        }
      })
  }

  deleteOwner(ownerId: string) {
    this.ownersService.deleteOwners([ownerId])
      .subscribe({
        next: (res) => {
          this.toasterService.success('تم حذف مالك بنجاح')
          this.getOwners(this.filterObject)
        }
      })
  }

  openUpsertOwner(ownerData: any = null) {
    this.dialogService.open(UpsertOwnerComponent, {
      data: ownerData,
    }).afterClosed().subscribe({
      next: (res => {
        if (!res) return
        this.getOwners(this.filterObject)
      })
    })
  }

  onSearchChange(searchValue: string) {
    this.searchSubject.next(searchValue);
  }

}
