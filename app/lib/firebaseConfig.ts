// app/lib/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsMEJsldM2VP_cSZYQaWqwV38szc1e-9U",
  authDomain: "vocabuild-e0db9.firebaseapp.com",
  projectId: "vocabuild-e0db9",
  storageBucket: "vocabuild-e0db9.firebasestorage.app",
  messagingSenderId: "416239465704",
  appId: "1:416239465704:web:77143cb9679b7635c6455d",
  measurementId: "G-65GTF4QP9L",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore database (works on server & client)
export const db = getFirestore(app);

// Optional: Initialize Analytics only in browser
let analytics;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log("Firebase Analytics initialized in browser");
      }
    });
  });
}
export { analytics };