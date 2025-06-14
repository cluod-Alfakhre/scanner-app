import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(
    private _snackBar: MatSnackBar,
  ) { }

  private openSnackBar(message: string, toasterType: 'success' | 'danger' | 'warning') {
    this._snackBar.open(message, '', {
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: toasterType,
      duration: 3000,
    });
  }

  success(message: string = 'تمت العملية بنجاح.') {
    this.openSnackBar(message, 'success')
  }

  danger(message: string = 'هناك خطأ!') {
    this.openSnackBar(message, 'danger')
  }

  warning(message: string = 'تنبيه!') {
    this.openSnackBar(message, 'warning')
  }

  markInvalidControls(controls: any) {
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
        controls[name].markAsTouched({ onlySelf: true });
        controls[name].markAsDirty({ onlySelf: true });
      }
    }
    this.warning('الرجاء التحقق من البيانات المطلوبة!.');
  }


}
