import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Params } from '../Params';
import { UserDetails } from '../UserDetails';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  constructor(private http: HttpClient) {}

  initSubmittions(): Promise<any> {
    let headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };
    const options: any = {
      headers: headers,
      params: { email: UserDetails.Email },
    };

    return new Promise((resolve, reject) => {
      this.http
        .get(
          Params.SERVICE_BASE_URL +
            Params.USER_SERVICE_URL_SUFFIXS.GET_SUBMISSIONS,
          options,
        )
        .subscribe({
          next: (value: any) => {
            if (value && value.success) {
              UserDetails.Submission = value.result;
            }
            resolve(value);
          },
          error: (error) => {
            console.error(error);
            reject(error);
          },
        });
    });
  }
}
