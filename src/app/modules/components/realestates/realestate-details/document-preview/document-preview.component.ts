import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

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

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  close(state = false): void {
    this.dialogRef.close(state);
  }

}
