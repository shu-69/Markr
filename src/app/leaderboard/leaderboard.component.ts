import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Params } from '../Params';
import { UserDetails } from '../UserDetails';

@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
})
export class LeaderboardComponent implements OnInit {
  leaderboard: any[] = [];
  isLoading: WritableSignal<boolean> = signal(false);
  currentUserEmail = UserDetails.Email;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    this.isLoading.set(true);
    this.http.get(Params.SERVICE_BASE_URL + Params.LEADERBOARD_SERVICE_URL_SUFFIXS.GET).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        this.leaderboard = res.result || [];
      },
      error: () => { this.isLoading.set(false); }
    });
  }

  getRankClass(index: number): string {
    if (index === 0) return 'rank-gold';
    if (index === 1) return 'rank-silver';
    if (index === 2) return 'rank-bronze';
    return 'rank-default';
  }

  getRankIcon(index: number): string {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  }

  isCurrentUser(email: string): boolean {
    return email === UserDetails.Email;
  }
}
