import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RealestatesService } from '../../../../../global/services/realestates/realestates.service';
import { ToasterService } from '../../../../../global/services/toaster.service';

@Component({
  selector: 'app-add-document',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatIconModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './add-document.component.html',
  styleUrl: './add-document.component.scss'
})
export class AddDocumentComponent {

  farmFiles!: FileList | null;
  disableConfirmBtn: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private realestatesService: RealestatesService,
    private toasterService: ToasterService,
  ) { }

  onFilesSelected(event: any) {
    this.farmFiles = event.target.files;
  }

  uploadFarmFiles(files: File[], farmId: string | number) {
    const formData = new FormData();

    // Append each file to the FormData object
    files.forEach((file, index) => {
      console.log(file);

      formData.append(`files`, file, file.name);
    });

    // Add any additional data if needed
    console.log(farmId);

    formData.append('farmId', farmId + '');

    this.realestatesService.uploadFarmFiles(formData)
      .subscribe({
        next: (res: any) => {
          this.toasterService.success('تم رفع ملفات المزرعة بنجاح')
          this.close(true)
        },
        error: () => this.disableConfirmBtn = false,
      })
  }

  cancelSelectedFiles() {
    this.farmFiles = null;

  }

  confirm() {
    this.disableConfirmBtn = true;
    if (this.farmFiles) {
      this.uploadFarmFiles([...this.farmFiles], this.data)
    }
  }

  close(state = false): void {
    this.dialogRef.close(state);
  }

}
