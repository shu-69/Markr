import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Params } from '../Params';
import { UserDetails } from '../UserDetails';

@Component({
  selector: 'app-forums',
  imports: [CommonModule, FormsModule],
  templateUrl: './forums.component.html',
  styleUrl: './forums.component.scss',
})
export class ForumsComponent implements OnInit {
  forums: any[] = [];
  selectedForum: any = null;
  isLoading: WritableSignal<boolean> = signal(false);
  isCreating: WritableSignal<boolean> = signal(false);
  showCreateForm: WritableSignal<boolean> = signal(false);

  newThread = { title: '', description: '' };
  newReply = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadForums();
  }

  loadForums() {
    this.isLoading.set(true);
    this.http.get(Params.SERVICE_BASE_URL + Params.FORUM_SERVICE_URL_SUFFIXS.GET_ALL).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        this.forums = res.result || [];
      },
      error: () => { this.isLoading.set(false); }
    });
  }

  openForum(forum: any) {
    this.selectedForum = forum;
    this.newReply = '';
  }

  backToList() {
    this.selectedForum = null;
    this.loadForums();
  }

  createThread() {
    if (!this.newThread.title.trim() || !this.newThread.description.trim()) return;
    this.isCreating.set(true);

    const body = {
      ...this.newThread,
      author: UserDetails.Name || 'Anonymous',
      email: UserDetails.Email || '',
    };

    this.http.post(Params.SERVICE_BASE_URL + Params.FORUM_SERVICE_URL_SUFFIXS.CREATE, body).subscribe({
      next: () => {
        this.isCreating.set(false);
        this.showCreateForm.set(false);
        this.newThread = { title: '', description: '' };
        this.loadForums();
      },
      error: () => { this.isCreating.set(false); }
    });
  }

  postReply() {
    if (!this.newReply.trim() || !this.selectedForum) return;

    const body = {
      content: this.newReply,
      author: UserDetails.Name || 'Anonymous',
      email: UserDetails.Email || '',
    };

    const url = `${Params.SERVICE_BASE_URL}/forums/${this.selectedForum._id}/reply`;
    this.http.post(url, body).subscribe({
      next: (res: any) => {
        this.selectedForum = res.result;
        this.newReply = '';
      },
      error: () => {}
    });
  }

  getTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  }
}
