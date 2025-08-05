
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "streetlight-kr2i7",
  "appId": "1:544429212128:web:393664d9213b3f18202b85",
  "storageBucket": "streetlight-kr2i7.firebasestorage.app",
  "apiKey": "AIzaSyCwoqW5q6XzB55HL30YdDaXpv_DDQOC3gk",
  "authDomain": "streetlight-kr2i7.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "544429212128"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);


export { app, db, storage, auth };
