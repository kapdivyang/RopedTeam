// Firebase Configuration
// IMPORTANT: This uses the 'compat' libraries loaded in index.html

const firebaseConfig = {
    apiKey: "AIzaSyCt3A5-KNOzWAKZ1ChIZp9IMYLHyLAlHCI",
    authDomain: "ropedteam-4721b.firebaseapp.com",
    projectId: "ropedteam-4721b",
    storageBucket: "ropedteam-4721b.firebasestorage.app",
    messagingSenderId: "343134738026",
    appId: "1:343134738026:web:8a1c55d7bbf0761a4e5c13",
    measurementId: "G-L3S2L51MLJ"
};

// Initialize Firebase (using the global firebase object from the CDN scripts)
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);

    // Initialize services
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Export for use in other files
    window.firebaseAuth = auth;
    window.firebaseDB = db;

    console.log('🔥 Firebase initialized successfully!');
} else {
    console.error('Firebase SDK not loaded! Make sure standard compat libraries are included in HTML.');
}
