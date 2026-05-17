import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { Params } from '../Params';
import { UserDetails } from '../UserDetails';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private scriptLoaded = false;
  private scriptLoadingPromise: Promise<boolean> | null = null;

  constructor(private http: HttpClient) { }

  private loadRazorpayScript(): Promise<boolean> {
    if (this.scriptLoaded) {
      return Promise.resolve(true);
    }
    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;
    }

    this.scriptLoadingPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        this.scriptLoaded = true;
        resolve(true);
      };
      script.onerror = () => {
        this.scriptLoadingPromise = null;
        resolve(false);
      };
      document.body.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }

  initiatePayment(
    amount: number,
    description: string,
    prefillInfo?: { name?: string; email?: string; contact?: string }
  ): Observable<any> {
    const paymentResult$ = new Subject<any>();

    this.loadRazorpayScript().then((loaded) => {
      if (!loaded) {
        paymentResult$.error({ error: 'Failed to load Razorpay SDK' });
        return;
      }

      amount = 1;

      const options = {
        key: Params.RAZORPAY_KEY,
        amount: amount * 100, // Hardcoded to 1 INR (100 paise) for testing real debits in live mode
        currency: 'INR',
        name: 'Markr Study Platform',
        description: description || 'Test Payment Transaction',
        prefill: {
          name: prefillInfo?.name || 'Test User',
          email: prefillInfo?.email || 'test@markr.com',
          contact: prefillInfo?.contact || '9999999999'
        },
        theme: {
          color: '#171717' // Dark premium theme color matching our design guidelines
        },
        handler: (response: any) => {
          paymentResult$.next({
            status: 'success',
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            amount: 1, // Hardcoded to 1 INR
            date: new Date().toISOString()
          });
          paymentResult$.complete();
        },
        modal: {
          ondismiss: () => {
            paymentResult$.next({
              status: 'cancelled',
              message: 'Payment cancelled by user'
            });
            paymentResult$.complete();
          }
        }
      };

      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (error) {
        paymentResult$.error(error);
      }
    });

    return paymentResult$.asObservable();
  }

  saveTransactionOnServer(transaction: any): Observable<any> {
    if (!UserDetails._id) {
      return of({ success: false, message: 'User not logged in' });
    }

    const payload = {
      userId: UserDetails._id,
      razorpay_payment_id: transaction.razorpay_payment_id,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
      status: transaction.status
    };

    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(
      Params.SERVICE_BASE_URL + Params.ACCOUNT_SERVICE_URL_SUFFIXS.SAVE_TRANSACTION,
      payload,
      { headers }
    );
  }

  getTransactionsFromServer(): Observable<any> {
    if (!UserDetails._id) {
      return of({ success: false, result: [] });
    }

    return this.http.get(
      Params.SERVICE_BASE_URL + Params.ACCOUNT_SERVICE_URL_SUFFIXS.GET_TRANSACTIONS,
      {
        params: { userId: UserDetails._id }
      }
    );
  }
}
