// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyAIrJD_HGkr5JE4o_pu_QE1EMVjd0wLW9E",
  authDomain: "markr-c4fa6.firebaseapp.com",
  projectId: "markr-c4fa6",
  storageBucket: "markr-c4fa6.firebasestorage.app",
  messagingSenderId: "933627846931",
  appId: "1:933627846931:web:05247572e699b9244efae6",
  measurementId: "G-PM58TEYZKY"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/icons/icon-72x72.png' // TODO: Update with your app icon path
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
