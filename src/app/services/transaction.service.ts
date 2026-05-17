import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Params } from '../Params';

export interface Transaction {
  razorpay_payment_id: string;
  amount: number;
  description: string;
  date?: string;
  status?: 'success' | 'failed' | 'cancelled';
  _id?: string;
}

export interface SaveTransactionResponse {
  success: boolean;
  message: string;
}

export interface GetTransactionsResponse {
  success: boolean;
  result: Transaction[];
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  // Uses SERVICE_BASE_URL dynamically so switching between Localhost and Production is seamless!
  private apiUrl = `${Params.SERVICE_BASE_URL}/accounts`;

  constructor(private http: HttpClient) {}

  // Save transaction to profile
  saveTransaction(payload: {
    userId: string;
    razorpay_payment_id: string;
    amount: number;
    description: string;
    date?: string;
    status?: string;
  }): Observable<SaveTransactionResponse> {
    return this.http.post<SaveTransactionResponse>(`${this.apiUrl}/saveTransaction`, payload);
  }

  // Get all past transactions sorted by date
  getTransactions(userId: string): Observable<GetTransactionsResponse> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<GetTransactionsResponse>(`${this.apiUrl}/getTransactions`, { params });
  }
}
