import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDNqXGdUvZTNSTPNh79UhFEM7_c-l9bkQg",
  authDomain: "restuarantshare.firebaseapp.com",
  databaseURL: "https://restuarantshare-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "restuarantshare",
  storageBucket: "restuarantshare.firebasestorage.app",
  messagingSenderId: "769584426946",
  appId: "1:769584426946:web:abb70ba55799a90288b05b",
  measurementId: "G-C6WY2F7QTJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const database = getDatabase(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;