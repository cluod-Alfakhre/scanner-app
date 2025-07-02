import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RealestatesService } from '../../../../../global/services/realestates/realestates.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-document-preview',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatIconModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './document-preview.component.html',
  styleUrl: './document-preview.component.scss'
})
export class DocumentPreviewComponent {

  safeUrl: any;

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private realestateService: RealestatesService,
    private sanitizer: DomSanitizer,
  ) {
    if (data) {
      this.getFileData(data)
    }
  }


  getFileData(documentId: string | number) {
    this.realestateService.getDocument(documentId)
      .subscribe({
        next: (res: any) => {
          console.log(res);

          this.createSafeUrl(res)
        }
      })
  }

  private createSafeUrl(blob: Blob) {
    // Method 1: For Base64 (permanent)
    const url = URL.createObjectURL(blob);
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  convertBinary(base64Data: string) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank')

    this.safeUrl = blobUrl
  }

  close(state = false): void {
    this.dialogRef.close(state);
  }

}
