/**
 * Firebase configuration.
 *
 * ⚠️  SETUP REQUIRED — Replace the placeholder values below with
 *     your own Firebase project credentials.
 *
 *  1. Go to https://console.firebase.google.com/
 *  2. Create a new project (or use existing)
 *  3. Add a Web app (⚙️ → Project settings → Your apps → Add app → Web)
 *  4. Copy the config object and paste below
 *  5. Enable Firestore Database (Build → Firestore Database → Create)
 *     Start in **test mode** for now
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey:            "AIzaSyB8w_qvKRHlkPmmYQ3lU-V27SpwNkS-fSQ",
  authDomain:        "card-maker-dashboard.firebaseapp.com",
  projectId:         "card-maker-dashboard",
  storageBucket:     "card-maker-dashboard.firebasestorage.app",
  messagingSenderId: "795093953775",
  appId:             "1:795093953775:web:6f2302b70e4e2ef9fe3f1a",
  measurementId:     "G-3P4XG9P5HH",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const functions = getFunctions(app);
