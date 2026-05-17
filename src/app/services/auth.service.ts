import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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

  async login(username: string, password: string, rememberMe: boolean = false): Promise<Observable<any>> {
    console.log('Initiating secure login...');

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    const payload = { username, password };

    // Migrate from GET to POST for securely sending credentials in the body
    let result = await this.http.post(
      Params.SERVICE_BASE_URL + Params.ACCOUNT_SERVICE_URL_SUFFIXS.LOGIN,
      payload,
      { headers }
    );

    result.subscribe({
      next: (result: any) => {
        if (result.success && result.token) {
          this.isAuthenticate = true;

          // Secure token storage based on "Remember Me"
          if (rememberMe) {
            localStorage.setItem('auth_token', result.token);
          } else {
            sessionStorage.setItem('auth_token', result.token);
          }

          this.populateUserDetails(result.result);
        }
      },
      error: (error: any) => {
        this.isAuthenticate = false;
        console.error('Login error:', error);
      },
    });

    return result;
  }

  async autoAuthUser() {
    console.log('Auto Authenticating Session...');

    // Check for tokens in either session or local storage
    const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');

    if (token) {
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      return this.http.get(
        Params.SERVICE_BASE_URL + Params.ACCOUNT_SERVICE_URL_SUFFIXS.GET_ME,
        { headers }
      ).pipe(
        tap({
          next: (result: any) => {
            if (result.success) {
              this.isAuthenticate = true;
              this.populateUserDetails(result.result);
            } else {
              this.logout();
            }
          },
          error: () => {
            this.logout();
          }
        }),
        catchError(() => of({ success: false }))
      );
    } else {
      return of({ success: false });
    }
  }

  private populateUserDetails(responseResult: any) {
    UserDetails._id = responseResult._id;
    UserDetails.Name = responseResult.name;
    UserDetails.Username = responseResult.username;
    UserDetails.Email = responseResult.email;
    UserDetails.ContactNo = responseResult.contact_no;
    UserDetails.DOB = responseResult.dob;
    UserDetails.Address = responseResult.address;
    UserDetails.FatherName = responseResult.father_name;
    UserDetails.Gender = responseResult.gender;
    UserDetails.ProfileImg = responseResult.profile_img;
    UserDetails.RegisteredOn = responseResult.registered_on;

    // Never store plaintext password back into UserDetails!
    UserDetails.Password = ''; 

    // Notify shared service to update signals
    this.sharedService.updateUserData();
  }

  logout() {
    this.isAuthenticate = false;
    UserDetails.Name = '';
    UserDetails.Username = '';
    UserDetails.Email = '';
    UserDetails.Password = '';
    
    // Clear all token traces securely
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    
    // Legacy cleanup
    localStorage.removeItem('logged_in_username');
    localStorage.removeItem('logged_in_password');
    localStorage.removeItem('log_in_remeber');

    window.location.reload();
  }
}
