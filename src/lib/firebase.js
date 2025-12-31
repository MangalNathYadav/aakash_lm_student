// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqYGUFQVr3J_UZilOsyrcJBLeeAMkhcQU",
    authDomain: "riyansh-cfc01.firebaseapp.com",
    databaseURL: "https://riyansh-cfc01-default-rtdb.firebaseio.com",
    projectId: "riyansh-cfc01",
    storageBucket: "riyansh-cfc01.firebasestorage.app",
    messagingSenderId: "657261383762",
    appId: "1:657261383762:web:3409184b01da0821f2cf8b",
    measurementId: "G-M646H57NZB"
};

// Initialize Firebase
// Avoid re-initialization in Next.js dev mode
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Services
const db = getDatabase(app);

// Analytics is only supported in browser environments
let analytics;
if (typeof window !== "undefined") {
    isSupported().then((yes) => {
        if (yes) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, db, analytics };
