// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/5.4.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.4.0/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    messagingSenderId: "508872957744",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const {txid, coin} = payload;

    // Customize notification here
    let notificationTitle = 'New transaction';
    let notificationOptions = {
        body: coin ? `${coin} - ${txid}` : 'You receive new transaction',
        icon: '/images/plark-256.png'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
