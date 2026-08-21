import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { 
  initializeFirestore, 
  getFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  setLogLevel
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import config from '../../firebase-applet-config.json';

export const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  firestoreDatabaseId: config.firestoreDatabaseId || '(default)',
  oAuthClientId: (config as any)?.oAuthClientId
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Explicitly ensure browser local persistence so page refreshes retain the Firebase auth session
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('[Firebase Auth] Persistence configuration warning:', err);
});

// Suppress unhandled rejections and runtime errors from background IndexedDB / Firestore closing/hidden states
if (typeof window !== 'undefined') {
  try {
    setLogLevel('error');
  } catch (e) {}

  window.addEventListener('unhandledrejection', (event) => {
    const reasonMsg = event.reason?.message || String(event.reason || '');
    if (
      reasonMsg.includes('closing/hidden') ||
      reasonMsg.includes('Database is closing') ||
      reasonMsg.includes('database is closing') ||
      reasonMsg.includes('IndexedDB') ||
      reasonMsg.includes('unavailable') ||
      reasonMsg.includes('Could not reach Cloud Firestore backend')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const errorMsg = event.message || event.error?.message || String(event.error || '');
    if (
      errorMsg.includes('closing/hidden') ||
      errorMsg.includes('Database is closing') ||
      errorMsg.includes('database is closing') ||
      errorMsg.includes('unavailable') ||
      errorMsg.includes('Could not reach Cloud Firestore backend')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

// Initialize Firestore with auto-detect long polling and multi-tab persistent cache
let firestoreDb: any;
const customDbId = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)' 
  ? config.firestoreDatabaseId 
  : undefined;

try {
  const firestoreSettings = {
    experimentalAutoDetectLongPolling: true,
    localCache: typeof window !== 'undefined' 
      ? persistentLocalCache({ tabManager: persistentMultipleTabManager() })
      : undefined
  };

  firestoreDb = customDbId 
    ? initializeFirestore(app, firestoreSettings, customDbId)
    : initializeFirestore(app, firestoreSettings);
} catch (e) {
  // If already initialized, fallback to getFirestore
  firestoreDb = customDbId ? getFirestore(app, customDbId) : getFirestore(app);
}

export const db = firestoreDb;

export const storage = getStorage(app);

export default app;



