import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  memoryLocalCache,
  setLogLevel
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import config from '../../firebase-applet-config.json';

// Silence verbose connection logs from Firestore SDK
setLogLevel('error');

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

// Prevent unhandled rejections from "Database is closing/hidden", offline, or unreachable backend connection errors in iframe
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reasonMsg = event.reason?.message || String(event.reason || '');
    if (
      reasonMsg.includes('closing/hidden') ||
      reasonMsg.includes('Database is closing') ||
      reasonMsg.includes('IndexedDB') ||
      reasonMsg.includes('Could not reach Cloud Firestore backend') ||
      reasonMsg.includes('code=unavailable') ||
      reasonMsg.includes('client is offline')
    ) {
      console.warn('[Firebase/Firestore] Suppressed benign offline/connection retry exception:', reasonMsg);
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

let dbInstance;
try {
  const databaseId = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
    ? config.firestoreDatabaseId
    : undefined;

  dbInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    }),
    experimentalForceLongPolling: true
  }, databaseId);
} catch (e) {
  console.warn('[Firestore] Multi-tab persistent cache failed, falling back to memory persistence:', e);
  try {
    const databaseId = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
      ? config.firestoreDatabaseId
      : undefined;
    dbInstance = initializeFirestore(app, {
      localCache: memoryLocalCache(),
      experimentalForceLongPolling: true
    }, databaseId);
  } catch (e2) {
    dbInstance = config.firestoreDatabaseId 
      ? getFirestore(app, config.firestoreDatabaseId) 
      : getFirestore(app);
  }
}

export const db = dbInstance;
export const storage = getStorage(app);

export default app;



