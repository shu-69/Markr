import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Params } from '../Params';
import { UserDetails } from '../UserDetails';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticate: boolean = false;

  constructor(private http: HttpClient) { }

  async init() {

  }

  async login(username: string, password: string): Promise<Observable<any>> { // : Observable<any>

    console.log(username, password)

    const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

    const options: any = {

      headers: headers,
      params: { 'username': username, 'password': password },
      // responseType: 'text'

    }

    let result = await this.http.get(Params.SERVICE_BASE_URL + Params.ACCOUNT_SERVICE_URL_SUFFIXS.LOGIN, options);

    result.subscribe({
      next: (result: any) => {

        if (result.success) {

          this.isAuthenticate = true

          const responseResult = result.result;

          UserDetails.Name = responseResult.name;
          UserDetails.Username = responseResult.username;
          UserDetails.Email = responseResult.email;
          UserDetails.Password = password

          this.initSubmittions()

        }

      }, error: (error: any) => {

        this.isAuthenticate = false

      }
    });

    return result;

  }

  async autoAuthUser() {

    console.log("Auto Logging")

    let username = localStorage.getItem('logged_in_username');
    let password = localStorage.getItem('logged_in_password');

    console.log(username, password)

    if (username && password) {

      return await this.login(username, password);

    } else {
      return of(false);
    }

  }

  async initSubmittions() {

    let headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

    const options: any = {

      headers: headers,
      params: { 'email': UserDetails.Email }

    }

    this.http.get(Params.SERVICE_BASE_URL + Params.USER_SERVICE_URL_SUFFIXS.GET_SUBMISSIONS, options).subscribe({

      next: (value: any) => {

        if(value && value.success){

          UserDetails.Submission = value.result

        }

      },error : (error) => {
          
        console.error(error)

      },

    })

  }

}
