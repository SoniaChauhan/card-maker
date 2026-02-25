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

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'YOUR_API_KEY',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'YOUR_PROJECT.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'YOUR_PROJECT_ID',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| 'YOUR_SENDER_ID',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
