import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-box',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './confirm-box.component.html',
  styleUrl: './confirm-box.component.scss'
})
export class ConfirmBoxComponent {

  message: string = 'لا يمكن التراجع عن هذه العملية';

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    if (this.data?.message) {
      this.message = this.data.message;
    }
  }

  close(state = false): void {
    this.dialogRef.close(state);
  }

}
