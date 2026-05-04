import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Params } from '../Params';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent {

  isLoading = false;
  passwordEyeIcon = "on";
  usernameInputFieldId = "username_input"
  passwordInputFieldId = "password_input"

  formData = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false),
  });

  constructor(private navService: NavigationService, private http: HttpClient, private authService: AuthService) {

    localStorage.removeItem('loggeed_in_username');
    localStorage.removeItem('loggeed_in_password');

  }

  async doLogin() {

    if (this.formData.valid) {

      this.isLoading = true;

      (await this.authService
        .login(this.formData.controls.username.value!, this.formData.controls.password.value!)).subscribe({
          next: (result: any) => {

            this.isLoading = false;

            if (result.success) {

              localStorage.setItem('logged_in_username', this.formData.controls.username.value!);
              localStorage.setItem('logged_in_password', this.formData.controls.password.value!);
              localStorage.setItem('log_in_remeber', this.formData.controls.rememberMe ? 'true' : 'false');

              console.log("Login details saved!")

              this.navService.openPage(Params.PageNames.home)

            } else {

              switch (result.err_code) {

                case 101:

                  let field: any = document.getElementById(this.usernameInputFieldId)!;

                  field.setCustomValidity("Email not found!");

                  field.reportValidity();

                  alert('Login failed : Email not found!');

                  console.log("Authentication failed : Email not found!");

                  break;

                case 102:

                  alert('Login failed : Username not found!');

                  console.log("Authentication failed : Username not found!");

                  break;

                case 103:


                  alert('Login failed : Please check you Username/Email')

                  console.log("Authentication failed : Username/Email not found!");

                  break;

                default:
                  break;
              }

            }

            console.log(result);




          }, error: (error: any) => {

            this.isLoading = false;
            console.log(error);

          }
        });


    } else {

      if (this.formData.controls.username.invalid) {

        let field: HTMLElement = document.getElementById(this.usernameInputFieldId)!;

        field.classList.add('fieldError');

        setTimeout(() => {
          field.classList.remove('fieldError');
        }, 2000);

        return;
      }

      if (this.formData.controls.password.invalid) {

        let field: HTMLElement = document.getElementById(this.passwordInputFieldId)!;

        field.classList.add('fieldError');

        setTimeout(() => {
          field.classList.remove('fieldError');
        }, 2000);

        return;
      }

    }

  }

  tooglePasswordType() {

    let element: HTMLElement = document.getElementById(this.passwordInputFieldId)!;

    if (element.getAttribute("type") == "password") {
      element.setAttribute("type", "text");
      this.passwordEyeIcon = "off"
    } else {
      element.setAttribute("type", "password");
      this.passwordEyeIcon = "on"
    }

  };

}
