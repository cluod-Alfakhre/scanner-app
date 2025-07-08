import { Component, DestroyRef, inject } from '@angular/core';
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
import { debounceTime, distinctUntilChanged, map, Observable, Subject } from 'rxjs';
import { UserItemModel, UsersFilterModel } from '../../../global/models/user.models';
import { contextMenuItem } from '../../../global/shared/components/context-menu/context-menu.component';
import { GridMenuComponent } from '../../../global/shared/ag-grid/grid-menu/grid-menu.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../global/services/auth/auth.service';
import { IsAdminDirective } from '../../../global/shared/directives/is-admin.directive';

@Component({
  selector: 'app-users',
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
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  usersList$!: Observable<UserItemModel[]>;

  authService = inject(AuthService);

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
      cellRenderer: (params: any) => params.value || '--'
    },
    {
      field: "phone",
      headerName: 'رقم الهاتف',
      cellRenderer: (params: any) => params.value || '--'
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
            hidden: !this.authService.isAdmin(),
            onClick: () => {
              this.openUpsertUser(params.data)
            }
          },
          {
            label: 'حذف',
            icon: 'delete',
            hidden: !this.authService.isAdmin(),
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

  private searchSubject = new Subject<string>();

  constructor(
    private dialogService: MatDialog,
    private usersService: UsersService,
    private datePipe: DatePipe,
    private toasterService: ToasterService,
    private destroyRef: DestroyRef,
  ) {
  }

  ngOnInit() {
    this.getUsers(this.filterObject)

    this.searchSubject.pipe(
      debounceTime(500), // Wait 300ms after last input
      distinctUntilChanged(), // Only emit if value changed
      takeUntilDestroyed(this.destroyRef) // Clean up on component destroy
    ).subscribe(searchValue => {
      this.getUsers(this.filterObject);
    });

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

  onSearchChange(searchValue: string) {
    this.searchSubject.next(searchValue);
  }

}
