import { HttpClient } from '@angular/common/http';
import { Component, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Params } from '../Params';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent {
  isLoading: WritableSignal<boolean> = signal(false);
  passwordEyeIcon = 'on';
  usernameInputFieldId = 'username_input';
  passwordInputFieldId = 'password_input';

  formData = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false),
  });

  constructor(
    private navService: NavigationService,
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  async doLogin() {
    if (this.formData.valid) {
      this.isLoading.set(true);

      (
        await this.authService.login(
          this.formData.controls.username.value!,
          this.formData.controls.password.value!,
          this.formData.controls.rememberMe.value || false
        )
      ).subscribe({
        next: (result: any) => {
          this.isLoading.set(false);

          if (result.success) {
            console.log('Login successful & Token stored securely!');
            this.navService.openPage(Params.PageNames.home);
          } else {
            switch (result.err_code) {
              case 101:
                let field: any = document.getElementById(
                  this.usernameInputFieldId,
                )!;

                field.setCustomValidity('Email not found!');

                field.reportValidity();

                alert('Login failed : Email not found!');

                console.log('Authentication failed : Email not found!');

                break;

              case 102:
                alert('Login failed : Username not found!');

                console.log('Authentication failed : Username not found!');

                break;

              case 103:
                alert('Login failed : Please check you Username/Email');

                console.log(
                  'Authentication failed : Username/Email not found!',
                );

                break;

              default:
                break;
            }
          }

          console.log(result);
        },
        error: (error: any) => {
          this.isLoading.set(false);
          console.log(error);
        },
      });
    } else {
      if (this.formData.controls.username.invalid) {
        let field: HTMLElement = document.getElementById(
          this.usernameInputFieldId,
        )!;

        field.classList.add('fieldError');

        setTimeout(() => {
          field.classList.remove('fieldError');
        }, 2000);

        return;
      }

      if (this.formData.controls.password.invalid) {
        let field: HTMLElement = document.getElementById(
          this.passwordInputFieldId,
        )!;

        field.classList.add('fieldError');

        setTimeout(() => {
          field.classList.remove('fieldError');
        }, 2000);

        return;
      }
    }
  }

  tooglePasswordType() {
    let element: HTMLElement = document.getElementById(
      this.passwordInputFieldId,
    )!;

    if (element.getAttribute('type') == 'password') {
      element.setAttribute('type', 'text');
      this.passwordEyeIcon = 'off';
    } else {
      element.setAttribute('type', 'password');
      this.passwordEyeIcon = 'on';
    }
  }
}
