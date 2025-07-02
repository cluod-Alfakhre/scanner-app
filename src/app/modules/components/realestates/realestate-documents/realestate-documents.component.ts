import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { map, Observable } from 'rxjs';
import { ToasterService } from '../../../../global/services/toaster.service';
import { GridMenuComponent } from '../../../../global/shared/ag-grid/grid-menu/grid-menu.component';
import { contextMenuItem } from '../../../../global/shared/components/context-menu/context-menu.component';
import { RealestatesService } from '../../../../global/services/realestates/realestates.service';
import { RealestateItemModel } from '../../../../global/models/realestate.models';
import { ConfirmBoxComponent } from '../../../../global/shared/components/confirm-box/confirm-box.component';
import { DocumentPreviewComponent } from './document-preview/document-preview.component';
import { AddDocumentComponent } from './add-document/add-document.component';

@Component({
  selector: 'app-realestate-documents',
  imports: [
    AgGridModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './realestate-documents.component.html',
  styleUrl: './realestate-documents.component.scss'
})
export class RealestateDocumentsComponent {

  filesList$!: Observable<any[]>;

  colDefs: ColDef[] = [
    {
      field: "fileName",
      headerName: 'اسم الملف',
    },
    {
      field: "uploadedAt",
      headerName: 'تاريخ الإضافة',
      cellDataType: 'date',
      cellRenderer: (params: any) => {
        return `${this.datePipe.transform(params.value, 'yyyy-MM-dd')}`
      }
    },
    {
      headerName: '',
      flex: 1,
      minWidth: 100,
      cellStyle: {
        'text-align': 'end',
      },
      cellRenderer: GridMenuComponent,
      cellRendererParams: (params: any) => {
        const itemsMenu: contextMenuItem[] = [
          {
            label: 'عرض',
            icon: 'visibility',
            onClick: () => {
              this.openDocumentPreview(params.data.id)
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

  constructor(
    private dialogService: MatDialog,
    private datePipe: DatePipe,
    private toasterService: ToasterService,
    private realestateService: RealestatesService,
  ) {
    effect(() => {
      this.realestateData = realestateService.realestateData()
      if (this.realestateData) {
        this.getRealestateFiles(this.realestateData.id)
      }
    })
  }

  ngOnInit() {

  }

  getRealestateFiles(farmId: string | number) {
    this.filesList$ = this.realestateService.getRealestateFiles(farmId)
      .pipe(
        map((res) => {
          return res;
        })
      )
  }

  openUpsertFile() {
    this.dialogService.open(AddDocumentComponent, {
      data: this.realestateData?.id,
    }).afterClosed().subscribe({
      next: (res => {
        if (!res) return
        if (this.realestateData) {
          this.getRealestateFiles(this.realestateData.id)
        }
      })
    })
  }


  openDocumentPreview(documentId: string) {
    this.dialogService.open(DocumentPreviewComponent, {
      width: '100%',
      height: '500px',
      maxWidth: 'none',
      data: documentId,
    })
      .afterClosed().subscribe({
        next: (res: any) => {
          if (!res) return;
        }
      })
  }

  openConfirmDelete(documentId: string) {
    this.dialogService.open(ConfirmBoxComponent)
      .afterClosed().subscribe({
        next: (res: any) => {
          if (!res) return;
          this.deleteRealestateFile(documentId)
        }
      })
  }

  deleteRealestateFile(documentId: string | number) {
    this.realestateService.deleteRealestateFile(documentId)
      .subscribe({
        next: (res: any) => {
          if (!res) return;
          this.toasterService.success('تم حذف الملف بنجاح')
          if (this.realestateData) {
            this.getRealestateFiles(this.realestateData.id)
          }
        }
      })
  }

}
