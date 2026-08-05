import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import config from '../../firebase-applet-config.json';

export const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  firestoreDatabaseId: config.firestoreDatabaseId || '(default)'
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Explicitly ensure browser local persistence so page refreshes retain the Firebase auth session
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('[Firebase Auth] Persistence configuration warning:', err);
});

export const db = config.firestoreDatabaseId 
  ? getFirestore(app, config.firestoreDatabaseId) 
  : getFirestore(app);
export const storage = getStorage(app);

export default app;

// Firebase initialized cleanly

