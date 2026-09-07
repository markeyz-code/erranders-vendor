importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

// Try query string params first (from PWA workbox import), fall back to hardcoded values
const urlParams = new URL(location).searchParams;
const firebaseConfig = {
  apiKey: urlParams.get('apiKey') || 'AIzaSyBzYV1KzAMugqh2N0DvbTP7vr4f96j1Po4',
  projectId: urlParams.get('projectId') || 'erranders-493fe',
  messagingSenderId: urlParams.get('messagingSenderId') || '1022790982621',
  appId: urlParams.get('appId') || '1:1022790982621:web:771af2aab7a6e7a200b434',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  try {
    const title = payload?.notification?.title || payload?.data?.title || '🚨 NEW ALERT!';
    const body = payload?.notification?.body || payload?.data?.body || 'You have a new update.';
    
    const notificationOptions = {
      body: body,
      icon: '/icon.png',
      badge: '/icon.png',
      requireInteraction: true, // This ensures the notification stays until clicked
      vibrate: [500, 250, 500, 250, 500, 250, 500, 250, 500, 250, 500, 250, 500, 250, 500], // Heavy "ringing" vibration
      data: payload?.data || {},
      tag: 'order-alert-' + Date.now()
    };

    self.registration.showNotification(title, notificationOptions);
  } catch (err) {
    console.error('[firebase-messaging-sw.js] Error showing notification:', err);
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
