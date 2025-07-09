import { Component, DestroyRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { debounceTime, distinctUntilChanged, map, Observable, Subject } from 'rxjs';
import { ProjectItemModel, ProjectsFilterModel } from '../../../global/models/project.model';
import { UpsertProjectComponent } from './upsert-project/upsert-project.component';
import { ProjectsService } from '../../../global/services/projects/projects.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule } from 'ag-grid-angular';
import { contextMenuItem } from '../../../global/shared/components/context-menu/context-menu.component';
import { GridMenuComponent } from '../../../global/shared/ag-grid/grid-menu/grid-menu.component';
import { ToasterService } from '../../../global/services/toaster.service';
import { ConfirmBoxComponent } from '../../../global/shared/components/confirm-box/confirm-box.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSelectModule } from '@angular/material/select';
import { ListDataService } from '../../../global/services/list-data/list-data.service';
import { CityItemModel } from '../../../global/models/city.models';
import { IsAdminDirective } from '../../../global/shared/directives/is-admin.directive';
import { AuthService } from '../../../global/services/auth/auth.service';

@Component({
  selector: 'app-projects',
  imports: [
    AgGridModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    IsAdminDirective,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {

  projectsList$!: Observable<ProjectItemModel[]>;

  filterObject: ProjectsFilterModel = {
    SearchValue: '',
    CityId: 0,
    Page: 1,
    PageSize: 25,
  };

  authService = inject(AuthService);

  private searchSubject = new Subject<string>();

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    {
      field: "name",
      headerName: 'اسم المشروع',
    },
    {
      field: "projectNumber",
      headerName: 'رقم المشروع',
    },
    {
      field: "cityName",
      headerName: 'المدينة التابع لها',
    },
    {
      field: "cityId",
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
            hidden: !this.authService.isAdmin(),
            onClick: () => {
              this.openUpsertProject(params.data)
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

  cities$!: Observable<CityItemModel[]>;

  constructor(
    private dialogService: MatDialog,
    private projectsService: ProjectsService,
    private listsService: ListDataService,
    private toasterService: ToasterService,
    private destroyRef: DestroyRef,
  ) {
    this.getProjects(this.filterObject)
  }

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(500), // Wait 300ms after last input
      distinctUntilChanged(), // Only emit if value changed
      takeUntilDestroyed(this.destroyRef) // Clean up on component destroy
    ).subscribe(searchValue => {
      this.getProjects(this.filterObject);
    });
    this.getCities()
  }

  getProjects(filterObject: ProjectsFilterModel) {
    this.projectsList$ = this.projectsService.getProjects(filterObject).pipe(
      map((res: any) => res.data)
    )
  }

  getCities() {
    this.cities$ = this.listsService.getCities({})
      .pipe(
        map((res) => res.data)
      )
  }

  openConfirmDelete(projectId: string) {
    this.dialogService.open(ConfirmBoxComponent)
      .afterClosed().subscribe({
        next: (res: any) => {
          if (!res) return;
          this.deleteProject(projectId)
        }
      })
  }

  deleteProject(projectId: string) {
    this.projectsService.deleteProjects([projectId])
      .subscribe({
        next: (res) => {
          this.toasterService.success('تم حذف مشروع بنجاح')
          this.getProjects(this.filterObject)
        }
      })
  }

  openUpsertProject(projectData = null) {
    this.dialogService.open(UpsertProjectComponent, {
      data: projectData,
    }).afterClosed().subscribe({
      next: (res => {
        if (!res) return
        this.getProjects(this.filterObject)
      })
    })
  }

  onSearchChange(searchValue: string) {
    this.searchSubject.next(searchValue);
  }

}
