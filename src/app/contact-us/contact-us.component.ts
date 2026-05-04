import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GlobalVar } from '../GlobalVar';

export interface DialogData {
  title: string;
  message: string;
}

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.scss'],
    standalone: false
})
export class ContactUsComponent {

  name = "";
  email = "";
  address = "";
  message = "";

  constructor(public GlobalVar: GlobalVar, private dialog: MatDialog) {

  }

  submit() {

    //console.log("Name : " + this.name, "Email : " + this.email, "Address : " + this.address, "Message : " + this.message);

    if (this.checkErrors()) {
      this.showDialog("Thanks for contacting us", "Hey " + this.name + ", thanks for showing interest in our services 🥰. We will get back to you soon. Have a nice day!");
    }



  }

  checkErrors(): boolean {


    if (this.name.length == 0) {

      this.showInputFieldError("name-319a");

      return false;
    }

    if (this.email.length == 0) {

      this.showInputFieldError("email-319a");

      return false;
    }

    if (this.address.length == 0) {

      this.showInputFieldError("address-452f");

      return false;
    }

    if (this.message.length == 0) {

      this.showInputFieldError("message-319a");

      return false;
    }


    return true;

  }

  showInputFieldError(id: string) {

    const dangerColor = "#db545a"
    let defaultColor = "transparent";

    let field: HTMLElement = document.getElementById(id)!;

    field.style.backgroundColor = dangerColor;

    window.setTimeout(function () {
      field.style.backgroundColor = defaultColor;
    }, 1000)

  }

  openUrl(locationUrl: string, newTab: boolean) {

    let target = newTab ? '_blank' : '_self';

    window.open(locationUrl, target);

  }

  showDialog(title: string, message: string) {

    let dialogRef = this.dialog.open(DialogAnimationsExampleDialog, {
      width: '600px',
      height: 'fit-content',
      panelClass: ['dialog', 'contact_dialog'],

      data: { title: title, message: message },

    });

  }

}

@Component({
    selector: 'dialog-animations-example-dialog',
    template: ` <h1 mat-dialog-title title style="text-align: center; font-family: 'Poppins-Bold'; font-size: x-large; color: white; font-weight: normal;
              padding-left: 20px; padding-right: 20px;"> {{data.title}} </h1>
              <div style="text-align: center; font-family: 'Poppins-Regular'; font-size: medium; color: white; font-weight: normal;
              padding-left: 20px; padding-right: 20px;" > {{data.message}} </div>
              <div style="text-align: center;
                          padding: 15px;
                          background: #db545a;
                          margin-top: 25px;
                          font-family: Poppins-Regular; color: white;" (click)="close()" >Okay!</div>
              `,
    standalone: false
})

export class DialogAnimationsExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  close() {
    this.dialogRef.close();
  }

}
