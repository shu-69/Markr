import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PaymentService } from '../services/payment.service';
import { TransactionService, Transaction } from '../services/transaction.service';
import { UserDetails } from '../UserDetails';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class TransactionsComponent implements OnInit {
  transactions: WritableSignal<Transaction[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);

  constructor(
    private paymentService: PaymentService,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.fetchTransactions();
  }

  fetchTransactions() {
    if (!UserDetails._id) {
      console.warn('User not logged in, skipping transactions fetch.');
      return;
    }

    this.isLoading.set(true);
    this.transactionService.getTransactions(UserDetails._id).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.transactions.set(response.result);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching transactions:', err);
        this.isLoading.set(false);
      }
    });
  }

  initiateTestPayment(amountSelected: number = 499) {
    if (!UserDetails._id) {
      alert('Please log in to initiate a transaction.');
      return;
    }

    this.isLoading.set(true);
    const description = `Enrollment in Course Premium Pass (Amount: INR ${amountSelected})`;
    
    this.paymentService.initiatePayment(amountSelected, description).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          // Push to backend server via TransactionService
          const payload = {
            userId: UserDetails._id,
            razorpay_payment_id: response.razorpay_payment_id,
            amount: response.amount,
            description: description,
            date: response.date,
            status: 'success'
          };

          this.transactionService.saveTransaction(payload).subscribe({
            next: (res) => {
              if (res && res.success) {
                console.log('Transaction successfully saved to server profile.');
                this.fetchTransactions(); // Refresh the list directly from the database!
              } else {
                console.warn('Server failed to save transaction:', res.message);
                this.isLoading.set(false);
              }
            },
            error: (err) => {
              console.error('Failed to push transaction to server:', err);
              this.isLoading.set(false);
            }
          });
        } else {
          this.isLoading.set(false);
          if (response.status === 'cancelled') {
            console.log('Payment was closed/cancelled by the user.');
          }
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Payment Error:', err);
      }
    });
  }
}
