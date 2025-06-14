import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import { map, Observable } from 'rxjs';
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

@Component({
  selector: 'app-projects',
  imports: [
    AgGridModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {


  projectsList$!: Observable<ProjectItemModel[]>;

  filterObject: ProjectsFilterModel = {
    SearchValue: '',
    Page: 1,
    PageSize: 25,
  };

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
            onClick: () => {
              this.openUpsertProject(params.data)
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
    private projectsService: ProjectsService,
    private toasterService: ToasterService,
  ) {
    this.getProject(this.filterObject)
  }

  getProject(filterObject: ProjectsFilterModel) {
    this.projectsList$ = this.projectsService.getProjects(filterObject).pipe(
      map((res: any) => res.data)
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
          this.getProject(this.filterObject)
        }
      })
  }

  openUpsertProject(projectData = null) {
    this.dialogService.open(UpsertProjectComponent, {
      data: projectData,
    }).afterClosed().subscribe({
      next: (res => {
        if (!res) return
        this.getProject(this.filterObject)
      })
    })

  }


}
