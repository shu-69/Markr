import { Injectable, signal, computed } from '@angular/core';

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSignal = signal<Notification[]>(this.loadFromStorage());

  notifications = this.notificationsSignal.asReadonly();

  unreadCount = computed(() => 
    this.notificationsSignal().filter(n => !n.read).length
  );

  private loadFromStorage(): Notification[] {
    const data = localStorage.getItem('local_notifications');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // Convert date strings back to Date objects
        return parsed.map((n: any) => ({ ...n, date: new Date(n.date) }));
      } catch (e) {
        return this.getDefaultNotifications();
      }
    }
    return this.getDefaultNotifications();
  }

  private saveToStorage(notifications: Notification[]) {
    localStorage.setItem('local_notifications', JSON.stringify(notifications));
  }

  private getDefaultNotifications(): Notification[] {
    return [
      {
        id: '1',
        title: 'Welcome to Markr!',
        message: 'Start by exploring the available courses and tests.',
        date: new Date(),
        read: false,
        type: 'info'
      }
    ];
  }

  markAsRead(id: string) {
    this.notificationsSignal.update(notifications => {
      const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
      this.saveToStorage(updated);
      return updated;
    });
  }

  markAllAsRead() {
    this.notificationsSignal.update(notifications => {
      const updated = notifications.map(n => ({ ...n, read: true }));
      this.saveToStorage(updated);
      return updated;
    });
  }

  addNotification(notification: Omit<Notification, 'id' | 'date' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2),
      date: new Date(),
      read: false
    };
    this.notificationsSignal.update(notifications => {
      const updated = [newNotification, ...notifications];
      this.saveToStorage(updated);
      return updated;
    });
  }
}
