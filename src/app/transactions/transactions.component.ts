import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class TransactionsComponent {

}
