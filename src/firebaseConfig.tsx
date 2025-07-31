// Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore'; // Import getFirestore for Firestore
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5O3d93y18-Ftqm806FRH39pxO31edHqw",
  authDomain: "fapp-game.firebaseapp.com",
  projectId: "fapp-game",
  storageBucket: "fapp-game.firebasestorage.app",
  messagingSenderId: "590920199423",
  appId: "1:590920199423:web:4aa3e96a574e56ae85f0ca",
  measurementId: "G-Z0Y15Z0J62"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore with the modular SDK
export const auth = getAuth(app); // Get Auth instance
export const db = getFirestore(app); // Get Firestore instance