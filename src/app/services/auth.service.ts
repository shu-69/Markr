import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Params } from '../Params';
import { UserDetails } from '../UserDetails';
import { SharedServiceService } from './shared-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticate: boolean = false;

  constructor(
    private http: HttpClient,
    private sharedService: SharedServiceService,
  ) {}

  async init() {}

  async login(username: string, password: string): Promise<Observable<any>> {
    // : Observable<any>

    console.log(username, password);

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    const options: any = {
      headers: headers,
      params: { username: username, password: password },
      // responseType: 'text'
    };

    let result = await this.http.get(
      Params.SERVICE_BASE_URL + Params.ACCOUNT_SERVICE_URL_SUFFIXS.LOGIN,
      options,
    );

    result.subscribe({
      next: (result: any) => {
        if (result.success) {
          this.isAuthenticate = true;

          const responseResult = result.result;

          UserDetails._id = responseResult._id;
          UserDetails.Name = responseResult.name;
          UserDetails.Username = responseResult.username;
          UserDetails.Email = responseResult.email;
          UserDetails.Password = password;
          UserDetails.ContactNo = responseResult.contact_no;
          UserDetails.DOB = responseResult.dob;
          UserDetails.Address = responseResult.address;
          UserDetails.FatherName = responseResult.father_name;
          UserDetails.Gender = responseResult.gender;
          UserDetails.ProfileImg = responseResult.profile_img;
          UserDetails.RegisteredOn = responseResult.registered_on;

          // Notify shared service to update signals
          this.sharedService.updateUserData();

          // Submissions will be loaded on-demand in the dashboard
        }
      },
      error: (error: any) => {
        this.isAuthenticate = false;
      },
    });

    return result;
  }

  async autoAuthUser() {
    console.log('Auto Logging');

    let username = localStorage.getItem('logged_in_username');
    let password = localStorage.getItem('logged_in_password');

    console.log(username, password);

    if (username && password) {
      return await this.login(username, password);
    } else {
      return of(false);
    }
  }

  logout() {
    this.isAuthenticate = false;
    UserDetails.Name = '';
    UserDetails.Username = '';
    UserDetails.Email = '';
    UserDetails.Password = '';
    localStorage.removeItem('logged_in_username');
    localStorage.removeItem('logged_in_password');
    window.location.reload();
  }
}
