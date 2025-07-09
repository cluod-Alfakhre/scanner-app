import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RealestatesService } from '../../../global/services/realestates/realestates.service';
import { map, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../../global/shared/components/confirm-box/confirm-box.component';
import { ToasterService } from '../../../global/services/toaster.service';
import { ProjectsService } from '../../../global/services/projects/projects.service';
import { CitiesService } from '../../../global/services/cities/cities.service';
import { UpsertCityComponent } from '../cities/upsert-city/upsert-city.component';
import { UpsertProjectComponent } from '../projects/upsert-project/upsert-project.component';
import { UpsertRealestateComponent } from '../realestates/upsert-realestate/upsert-realestate.component';
import { DocumentPreviewComponent } from '../realestates/realestate-documents/document-preview/document-preview.component';
import { IsAdminDirective } from '../../../global/shared/directives/is-admin.directive';

@Component({
  selector: 'app-files-tree',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    IsAdminDirective,
  ],
  templateUrl: './files-tree.component.html',
  styleUrl: './files-tree.component.scss'
})
export class FilesTreeComponent {

  bgIndex = 0;
  iconBgList = ['success', 'purple', 'blue', 'green', 'pink', 'pink-2'];

  filesTree$!: Observable<any>;
  currentList!: any[];

  nameProperty: string = 'name';
  innerListProperty: string = 'projects';
  itemType: string = 'مدينة';

  currentItem: any;

  listRecovery: any = [];

  currentProjectsList: any[] = [];
  currentFarmsList: any[] = [];
  currentIcon: string = 'folder_open';

  breadCrumbNames: any[] = []

  currentTitle: string = 'مدن';

  constructor(
    private realestatesService: RealestatesService,
    private projectsService: ProjectsService,
    private citiesService: CitiesService,
    private dialogService: MatDialog,
    private toasterService: ToasterService,
  ) { }

  ngOnInit() {
    this.getFilesTree()
  }

  getFilesTree() {
    this.filesTree$ = this.realestatesService.getFilesTree()
      .pipe(
        map((res) => {
          this.currentList = res;
          this.listRecovery = res;
          this.nameProperty = 'name';
          this.innerListProperty = 'projects';
          this.itemType = 'مدينة';
          this.currentTitle = 'مدن';
          this.currentIcon = 'folder_open';
          this.breadCrumbNames = []
          return res
        })
      );
  }

  changeList(currentItem: any) {
    if (!this.innerListProperty || !currentItem[this.innerListProperty].length) {
      return
    }
    this.currentItem = currentItem;
    if (currentItem?.projects) {
      this.breadCrumbNames.push('. /' + currentItem.name)
      this.currentList = currentItem?.projects;
      this.currentProjectsList = currentItem?.projects;
      //this.nameProperty = 'name';
      this.innerListProperty = 'farms';
      this.itemType = 'مشروع';
      this.currentTitle = 'مشاريع';
      this.currentIcon = 'list_alt';
    }
    else if (currentItem?.farms) {
      this.breadCrumbNames.push(currentItem.name)
      this.currentList = currentItem?.farms;
      this.currentFarmsList = currentItem?.farms;
      this.nameProperty = 'farmNumber';
      this.innerListProperty = 'documents';
      this.itemType = 'مزرعة';
      this.currentTitle = 'مزارع';
      this.currentIcon = 'gite';
    }
    else if (currentItem?.documents) {
      this.breadCrumbNames.push(currentItem.farmNumber)
      this.currentList = currentItem?.documents;
      this.nameProperty = 'fileName';
      this.innerListProperty = '';
      this.itemType = 'ملف';
      this.currentTitle = 'ملفات';
      this.currentIcon = 'description';
    }
  }

  getBackList() {
    if (this.currentItem?.projects) {
      this.currentList = [...this.listRecovery];
      this.nameProperty = 'name';
      this.innerListProperty = 'projects';
      this.itemType = 'مدينة';
      this.currentTitle = 'مدن';
      this.currentIcon = 'folder_open';
      this.breadCrumbNames.pop()
    }
    else if (this.currentItem?.farms) {
      this.breadCrumbNames.pop()
      this.currentList = this.currentProjectsList;
      this.nameProperty = 'name';
      this.innerListProperty = 'farms';
      this.itemType = 'مشروع';
      this.currentTitle = 'مشاريع';
      this.currentIcon = 'list_alt';
      this.currentItem = this.listRecovery.filter((el: any) => el.projects.filter((el: any) => el.projectId == this.currentItem.projectId)[0])[0]
    }
    else if (this.currentItem?.documents) {
      this.breadCrumbNames.pop()
      this.currentList = this.currentFarmsList;
      this.nameProperty = 'farmNumber';
      this.innerListProperty = 'documents';
      this.itemType = 'مزرعة';
      this.currentTitle = 'مزارع';
      this.currentIcon = 'gite';
      this.currentItem = this.currentProjectsList.filter((el: any) => el.farms.filter((el: any) => el.farmId == this.currentItem.farmId)[0])[0]

    }
  }

  getBgIndex(index: number) {
    if (index % 6 == 0) {
      this.bgIndex = 0;
    } else {
      this.bgIndex++
    }
    return this.bgIndex;
  }

  deleteRealestate(realestateId: string) {
    return this.realestatesService.deleteRealestate([realestateId])
  }

  deleteProject(projectId: string) {
    return this.projectsService.deleteProjects([projectId])
  }

  deleteCiteis(cityId: string) {
    return this.citiesService.deleteCiteis([cityId])
  }

  deleteRealestateFile(documentId: string | number) {
    return this.realestatesService.deleteRealestateFile(documentId)
  }

  openConfirmDelete(item: any, itemType: 'city' | 'project' | 'farm' | 'document') {
    this.dialogService.open(ConfirmBoxComponent)
      .afterClosed().subscribe({
        next: (res: any) => {
          let request: Observable<any>;
          let itemName: string;
          if (!res) return;
          switch (itemType) {
            case 'city':
              itemName = 'المدينة'
              request = this.deleteCiteis(item?.id)
              break;
            case 'project':
              itemName = 'المشروع'
              request = this.deleteProject(item?.id)
              break;
            case 'farm':
              itemName = 'المزرعة'
              request = this.deleteRealestate(item?.id)
              break;
            case 'document':
              itemName = 'الملف'
              request = this.deleteRealestateFile(item?.id)
              break;
          }
          request.subscribe({
            next: (res: any) => {
              this.toasterService.success(`تم حذف ${itemName} بنجاح`)
              item.deleted = true;
              setTimeout(() => {
                this.deleteItem(item?.id)
                if (!this.currentList.length) {
                  this.getBackList()
                }
              }, 1000);
            }
          })
        }
      })
  }

  openUpsertCity(cityData = null) {
    this.dialogService.open(UpsertCityComponent, {
      data: cityData
    }).afterClosed().subscribe({
      next: (res => {
        if (!res) return
        this.getFilesTree()
      })
    })
  }

  openUpsertProject(projectData = null) {
    this.dialogService.open(UpsertProjectComponent, {
      data: projectData,
    }).afterClosed().subscribe({
      next: (res => {
        if (!res) return
        this.getFilesTree()
      })
    })
  }

  openUpsertRealestate(realestateData: any = null) {
    this.dialogService.open(UpsertRealestateComponent, {
      data: {
        formData: { ...realestateData, owner: { id: realestateData.ownerId } },
      },
    }).afterClosed().subscribe({
      next: (res => {
        if (!res) return
        this.getFilesTree()
      })
    })
  }

  openDocumentPreview(documentId: string) {
    this.dialogService.open(DocumentPreviewComponent, {
      width: '100%',
      height: '500px',
      maxWidth: 'none',
      data: { id: documentId },
    })
      .afterClosed().subscribe({
        next: (res: any) => {
          if (!res) return;
        }
      })
  }

  onDelelteActionBtn(item: any, event: MouseEvent) {
    if (event) {
      event.stopPropagation()
    }
    if (item?.projects) {//city
      this.openConfirmDelete(item, 'city')
    }
    else if (item?.farms) {//project
      this.openConfirmDelete(item, 'project')

    }
    else if (item?.documents) {//farm
      this.openConfirmDelete(item, 'farm')
    }
    else {
      this.openConfirmDelete(item, 'document')
    }
  }

  onEditActionBtn(item: any, event: MouseEvent) {
    if (event) {
      event.stopPropagation()
    }
    if (item?.projects) {
      this.openUpsertCity(item)
    }
    else if (item?.farms) {
      this.openUpsertProject(item)
    }
    else if (item?.documents) {
      this.openUpsertRealestate(item)
    }
    else if (!item[this.innerListProperty]) {
      this.openDocumentPreview(item.documentId)
    }
  }

  deleteItem(itemId: string | number) {
    this.currentList = this.currentList.filter(item => item.id != itemId)
  }

}
