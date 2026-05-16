import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAnimationsExampleDialog } from '../contact-us/contact-us.component';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor(private dialog: MatDialog) {}

  showDialog(
    title: string,
    message: string,
    panelClass: string | string[] | undefined,
  ) {
    let dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
      width: '600px',
      height: 'fit-content',
      panelClass: panelClass,

      data: { title: title, message: message },
    });
  }
}
