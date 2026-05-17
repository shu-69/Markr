import { Injectable } from '@angular/core';
// @ts-ignore
import { initializeApp } from 'firebase/app';
// @ts-ignore
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  private messaging: any;

  constructor(private notificationService: NotificationService) {}

  async init() {
    // Check if the browser supports push notifications
    if (!await isSupported()) {
      console.log('FCM is not supported in this browser or environment (e.g., non-HTTPS or incognito).');
      return;
    }

    const firebaseConfig = {
      apiKey: "AIzaSyAIrJD_HGkr5JE4o_pu_QE1EMVjd0wLW9E",
      authDomain: "markr-c4fa6.firebaseapp.com",
      projectId: "markr-c4fa6",
      storageBucket: "markr-c4fa6.firebasestorage.app",
      messagingSenderId: "933627846931",
      appId: "1:933627846931:web:05247572e699b9244efae6",
      measurementId: "G-PM58TEYZKY"
    };

    const app = initializeApp(firebaseConfig);
    this.messaging = getMessaging(app);

    this.listenForMessages();
  }

  requestPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        this.getFcmToken();
      } else {
        console.log('Unable to get permission to notify.');
      }
    });
  }

  private getFcmToken() {
    getToken(this.messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY' }).then((currentToken: string | null) => {
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        // TODO: Send this token to your backend to save it for the user
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
  }

  private listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('Message received in foreground: ', payload);
      
      if (payload.notification) {
        this.notificationService.addNotification({
          title: payload.notification.title || 'New Notification',
          message: payload.notification.body || '',
          type: 'info'
        });
      }
    });
  }
}
