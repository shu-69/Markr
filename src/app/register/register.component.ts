import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ImagePickerConf } from 'ngp-image-picker';
import { Title } from "@angular/platform-browser";
import { Params } from '../Params';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { NavigationService } from '../services/navigation.service';

export interface DialogData {
  title: string;
  message: string;
  username: string;
  password: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  showProfileImageError = false;
  imageErrorMessage = "";

  selectedProfileImage: string | null = null;   // Base64 data of selected profile image

  isSubmitting: boolean = false;
  submitButtonText: string = "SUBMIT";

  formData = new FormGroup({
    fullname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fathername: new FormControl('', [Validators.required, Validators.minLength(3)]),
    mothername: new FormControl(''),
    dob: new FormControl('', Validators.required),
    contactnumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
    emailaddress: new FormControl('', [Validators.required, Validators.email]),
    aadhar: new FormControl(''),
    gender: new FormControl('', Validators.required),
    address: new FormControl(''),
    termsnconditions: new FormControl(false),
  });

  imagePickerConf: ImagePickerConf = {
    borderRadius: '100px',
    language: 'en',
    width: '20vh',
    height: '20vh',
  };

  constructor(private fb: FormBuilder, private titleService: Title, private dialog: MatDialog, private http: HttpClient, private sanitizer: DomSanitizer, private datePipe: DatePipe) {

    this.titleService.setTitle(Params.PageTitles.register);
    // this.formData = this.fb.group({
    //   fullname: ['', [Validators.required, Validators.minLength(1)]]
    // });

  }
  ngOnInit() {
    //   this.formData = new FormGroup({ 
    //     userName: new FormControl("Tutorialspoint")
    //  });
  }

  submit() {

    if (this.formData.valid) {

      // Checking Profile image Size if selected
      if (this.selectedProfileImage != null) {

        let imageSize = Math.round(this.getImageSize(this.selectedProfileImage!));

        if (imageSize > Params.MAX_PROFILE_IMAGE_SIZE_IN_KB) {

          this.showErrorDialog("Please check your profile image size", "Profile image size is greater than allowed image size i.e " + Params.MAX_PROFILE_IMAGE_SIZE_IN_KB
            + "kb. Reduce your image quality with the edit tool or use any other image.");

          return;
        }

      }

      // Checking Terms and Conditions checked or not
      if (!this.formData.controls.termsnconditions.value) {
        this.showErrorDialog("Please check Tearms and Conditions", "Agree to the terms and conditions before submit.");

        return;
      }

      // this.http.get(Params.SERVICE_BASE_URL + "/accounts/help", {responseType: 'text'}).subscribe({
      //   next: data =>{
      //     console.log(data);
      //   }, error: error => {
      //     console.error('There was an error!', error);
      //   }
      // })

      const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

      const options: any = {

        headers: headers,
        params: { 'email': this.formData.controls.emailaddress.value! },
        responseType: 'text'

      }

      // Checking email exists or not

      this.isSubmitting = true;
      this.submitButtonText = "SUBMITTING";

      this.http.get(Params.SERVICE_BASE_URL + Params.ACCOUNT_SERVICE_URL_SUFFIXS.CHECK_EMAIL_EXISTS, options).subscribe({
        next: (emailExists: any) => {

          // this.isSubmitting = true;
          // this.submitButtonText = "SUBMITTING";

          let result: boolean = emailExists == "true";

          if (!result) {

            var body: any = {
              "name": this.formData.controls.fullname.value,
              "father_name": this.formData.controls.fathername.value,
              "dob": this.datePipe.transform(this.formData.controls.dob.value, 'dd-MM-yyyy'),
              "contact_no": this.formData.controls.contactnumber.value,
              "email": this.formData.controls.emailaddress.value,
              "gender": this.formData.controls.gender.value,
              "registered_on": new Date(),
            };

            // Adding optional details

            if (this.formData.controls.mothername.value != null && this.formData.controls.mothername.value.length > 0) {
              body.mother_name = this.formData.controls.mothername.value
            }

            if (this.formData.controls.aadhar.value != null && this.formData.controls.aadhar.value.length > 0) {
              body.aadhar = this.formData.controls.aadhar.value
            }

            if (this.formData.controls.address.value != null && this.formData.controls.address.value.length > 0) {
              body.address = this.formData.controls.address.value
            }

            if (this.selectedProfileImage != null) {
              body.profile_img = this.selectedProfileImage
            }

            //console.log(body)

            this.http.post<any>(Params.SERVICE_BASE_URL + Params.ACCOUNT_SERVICE_URL_SUFFIXS.REGISTER, body, { headers }).subscribe({
              next: data => {
                console.log(data);
                if (data.status) {
                  this.isSubmitting = false;
                  this.submitButtonText = "SUBMIT";
                  this.showSuccessDialog("Yay! Your account has been created!", { username: data.username, password: data.password });
                } else {
                  this.isSubmitting = false;
                  this.submitButtonText = "SUBMIT";
                  this.showErrorDialog("OOPS!, That was not expected!", "Your account cannot be created at this time, please try after some time.");
                }

              },
              error: error => {
                console.error('There was an error!', error);
              }
            });

          } else {
            this.isSubmitting = false;
            this.submitButtonText = "SUBMIT";
            this.showErrorDialog("Email already exists!", "The email you entered is already exists, please use another email or do login insted.")
          }

        }, error: error => {
          this.isSubmitting = false;
          this.submitButtonText = "SUBMIT";
          console.error('There was an error!', error);
          this.showErrorDialog("OOPS!, That was not expected!", "Some Internal server error occured, please try after some time.")
        }
      })

    } else {

      let errorMsg: string = "";

      Object.keys(this.formData.controls).forEach(key => {
        const controlErrors: ValidationErrors | null = this.formData.get(key)!.errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {

            /* Match these keys after changing Form Group keys */

            switch (key) {

              case "fullname": errorMsg += "◉" + " " + "Full name" + " " + getKeyErrorMessage(keyError) + "\n"; break;

              case "fathername": errorMsg += "◉" + " " + "Father's name" + " " + getKeyErrorMessage(keyError) + "\n"; break;

              case "mothername": errorMsg += "◉" + " " + "Mother's name" + " " + getKeyErrorMessage(keyError) + "\n"; break;

              case "dob": errorMsg += "◉" + " " + "DOB" + " " + getKeyErrorMessage(keyError) + "\n"; break;

              case "contactnumber": errorMsg += "◉" + " " + "Contact number" + " " + getKeyErrorMessage(keyError) + "\n"; break;

              case "emailaddress": errorMsg += "◉" + " " + "Email address" + " " + getKeyErrorMessage(keyError) + "\n"; break;

              case "aadhar": errorMsg += "◉" + " " + "Aadhar" + " " + getKeyErrorMessage(keyError) + "\n"; break;

              case "gender": errorMsg += "◉" + " " + "Gender" + " " + getKeyErrorMessage(keyError) + "\n"; break;

              case "address": errorMsg += "◉" + " " + "Address" + " " + getKeyErrorMessage(keyError) + "\n"; break;

            }

            //console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });

      this.showErrorDialog("Please check errors", errorMsg);
    }

    function getKeyErrorMessage(keyError: string): string {

      switch (keyError) {

        case "required": return "is required!";

        case "minlength": return "should be valid!";

        case "maxlength": return "should be valid!";

        case "email": return "should be valid!";

        default: return "has some error";

      }

    }

  }

  resetForm() {
    this.formData.reset();
    this.selectedProfileImage = null;
    this.showProfileImageError = false;

    try {
      let imageDeleteButton: HTMLElement = document.getElementById('delete-img')!;
      imageDeleteButton.click();
    } catch (e) { }


  }

  dataURItoBlob(dataURI: any) {

    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  onImageChange(event: any) {

    console.log(event);

    if (event != null) {

      this.selectedProfileImage = event;

      let imageSize = Math.round(this.getImageSize(this.selectedProfileImage!));

      if (imageSize > Params.MAX_PROFILE_IMAGE_SIZE_IN_KB) {
        this.showProfileImageError = true;
        this.imageErrorMessage = "Maximum allowed image size is " + Params.MAX_PROFILE_IMAGE_SIZE_IN_KB + "kb";
      } else {
        this.showProfileImageError = false;
        this.imageErrorMessage = "";
      }

      console.log("Size = " + imageSize);

    } else {

      this.showProfileImageError = false;
      this.imageErrorMessage = "";
      this.selectedProfileImage = null;

    }

  }

  getImageSize(base64String: string): number {

    var stringLength = base64String.length - 'data:image/png;base64,'.length;

    var sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
    var sizeInKb = sizeInBytes / 1024;

    return sizeInKb;
  }

  showErrorDialog(title: string, message: string) {

    let dialogRef = this.dialog.open(ErrorDialog, {
      width: '600px',
      height: 'fit-content',
      panelClass: ['dialog', 'registration_error_dialog'],

      data: { title: title, message: message },

    });

  }

  showSuccessDialog(message: string, crenedentials: any) {

    let dialogRef = this.dialog.open(SuccessDialog, {
      width: '45%',
      height: 'fit-content',
      panelClass: ['dialog', 'registration_success_dialog'],

      data: { message: message, username: crenedentials.username, password: crenedentials.password },

    });

    dialogRef.afterClosed().subscribe(() => {
      this.resetForm();
    });

  }

}

@Component({
  selector: 'error-dialog',
  template: ` <h1 mat-dialog-title title style="text-align: center; font-family: 'Poppins-Bold'; font-size: x-large; color: white; font-weight: normal;
              padding-left: 20px; padding-right: 20px;"> {{data.title}} </h1>
              <div style="text-align: start; font-family: 'Poppins-Regular'; font-size: medium; color: white; font-weight: normal;
              padding-left: 20px; padding-right: 20px; white-space: pre-line; display: flex; justify-content: center;" > {{data.message}} </div>
              <div style="text-align: center;
                          padding: 15px;
                          background: white;
                          margin-top: 25px;
                          font-family: Poppins-Regular; color: black; " (click)="close()" >Okay!</div>
              `,
})

export class ErrorDialog {
  constructor(public dialogRef: MatDialogRef<ErrorDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  close() {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'success-dialog',
  template: ` <div style="margin-top: 40px; margin-bottom: 40px;">
              <ng-lottie width="100%" height="30vh" [options]="options" ></ng-lottie>
              </div>
              <div style="text-align: center; font-family: 'Poppins-Regular'; font-size: medium; color: black; font-weight: normal;
              padding-left: 20px; padding-right: 20px; white-space: pre-line; display: flex; justify-content: center; margin-top: 20px;" > {{data.message}} </div>
              <div style="text-align: center; margin-top: 10px; font-family: Poppins-Regular; font-size: 14px;">Login your account with following credentials</div>
              <div style="display: flex; justify-content: center;">
                <div style="text-align: center; margin-top: 10px; display: flex; flex-flow: column; width: fit-content; text-align: start; gap: 10px; background: #9b9b9b38;
                             padding: 10px 15px; border-radius: 10px; margin-left: 15px; margin-right: 15px; overflow-x: auto;">
                  <span style="font-family: Poppins-Regular; font-size: 14px;">Username&nbsp;&nbsp;&nbsp;<span style="font-family: monospace; background: #cdcdcd;
                   padding: 4px 8px; border-radius: 4px;">{{data.username}}</span></span>
                  <span style="font-family: Poppins-Regular; font-size: 14px;">Password&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-family: monospace; background: #cdcdcd;
                   padding: 4px 8px; border-radius: 4px;">{{data.password}}</span></span>
                </div>
              </div>
              <div style="text-align: center;
                          padding: 15px;
                          background: #0176b4;
                          margin-top: 25px;
                          font-family: Poppins-Regular; color: white; " (click)="close()" >Okay!</div>
              `,
  standalone: true,
  imports: [LottieComponent],
})

export class SuccessDialog {
  constructor(public dialogRef: MatDialogRef<SuccessDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private navigationService: NavigationService) { }

  options: AnimationOptions = {
    path: '/assets/anims/success-animation.json',
    loop: false
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  close() {
    this.navigationService.openPage(Params.PageNames.login);
    this.dialogRef.close();
  }

}


// https://www.npmjs.com/package/ngp-image-picker
// stackblitz.com/edit/angular-simple-example-to-show-validation-errors?file=src%2Fapp%2Fapp.component.html,src%2Fapp%2Fapp.component.ts