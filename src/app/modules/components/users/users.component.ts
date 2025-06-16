import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { UsersService } from '../../../global/services/users/users.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToasterService } from '../../../global/services/toaster.service';
import { UpsertUserComponent } from './upsert-user/upsert-user.component';
import { ConfirmBoxComponent } from '../../../global/shared/components/confirm-box/confirm-box.component';
import { map, Observable } from 'rxjs';
import { UserItemModel, UsersFilterModel } from '../../../global/models/user.models';
import { contextMenuItem } from '../../../global/shared/components/context-menu/context-menu.component';
import { GridMenuComponent } from '../../../global/shared/ag-grid/grid-menu/grid-menu.component';

@Component({
  selector: 'app-users',
  imports: [
    AgGridModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  providers: [DatePipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  usersList$!: Observable<UserItemModel[]>;

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    {
      field: "fullName",
      headerName: 'الاسم الكامل',
    },
    {
      field: "username",
      headerName: 'اسم المستخدم',
    },
    {
      field: "roleName",
      headerName: 'اسم الوظيفة',
    },
    {
      field: "email",
      headerName: 'الإيميل',
    },
    {
      field: "phone",
      headerName: 'رقم الهاتف',
    },
    /* {
      field: "createdAt",
      headerName: 'تاريخ الإضافة',
      cellDataType: 'date',
      cellRenderer: (params: any) => {
        return `${this.datePipe.transform(params.value, 'yyyy-MM-dd')}`
      }
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
              this.openUpsertUser(params.data)
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

  filterObject: UsersFilterModel = {
    SearchValue: '',
    Page: 1,
    PageSize: 25,
  };

  constructor(
    private dialogService: MatDialog,
    private usersService: UsersService,
    private datePipe: DatePipe,
    private toasterService: ToasterService,
  ) {
    this.getUsers(this.filterObject)
  }

  ngOnInit() {
    this.getUsers(this.filterObject)
  }

  getUsers(filterObject: any) {
    this.usersList$ = this.usersService.getUsers(filterObject)
  }

  openConfirmDelete(userId: string) {
    this.dialogService.open(ConfirmBoxComponent)
      .afterClosed().subscribe({
        next: (res: any) => {
          if (!res) return;
          this.deleteUser(userId)
        }
      })
  }

  deleteUser(userId: string) {
    this.usersService.deleteUser(userId)
      .subscribe({
        next: (res) => {
          this.toasterService.success('تم حذف مالك بنجاح')
          this.getUsers(this.filterObject)
        }
      })
  }

  openUpsertUser(userData: any = null) {
    this.dialogService.open(UpsertUserComponent, {
      data: userData,
    }).afterClosed().subscribe({
      next: (res => {
        if (!res) return
        this.getUsers(this.filterObject)
      })
    })
  }

}
