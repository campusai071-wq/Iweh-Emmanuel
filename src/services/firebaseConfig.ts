import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, initializeFirestore, setLogLevel } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from '../../firebase-applet-config.json';
declare var process: any;

let localFirebaseConfig = null;
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('campusai_firebase');
    if (stored) {
      localFirebaseConfig = JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse local firebase config:", e);
  }
}

const env = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
const procEnv = (typeof process !== 'undefined' && process.env) || {};

const getEnvVar = (key: string): string => {
  return env[key] || procEnv[key] || "";
};

const resolvedFirebaseConfig = localFirebaseConfig || {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY') || (firebaseConfig as any)?.apiKey || "",
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN') || (firebaseConfig as any)?.authDomain || "",
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID') || (firebaseConfig as any)?.projectId || "",
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET') || (firebaseConfig as any)?.storageBucket || "",
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID') || (firebaseConfig as any)?.messagingSenderId || "",
  appId: getEnvVar('VITE_FIREBASE_APP_ID') || (firebaseConfig as any)?.appId || "",
  firestoreDatabaseId: getEnvVar('VITE_FIREBASE_DATABASE_ID') || (firebaseConfig as any)?.firestoreDatabaseId || "(default)"
};

export const MASTER_CONFIG = {
  GEMINI_API_KEY: getEnvVar('VITE_GEMINI_API_KEY') || getEnvVar('GEMINI_API_KEY') || "", 
  FLUTTERWAVE_PUBLIC_KEY: getEnvVar('VITE_FLUTTERWAVE_PUBLIC_KEY') || "",
  FIREBASE: resolvedFirebaseConfig
};
export const hasLocalFirebase = !!localFirebaseConfig;

const configNode = MASTER_CONFIG.FIREBASE as any;
export const firestoreDatabaseId = configNode.firestoreDatabaseId || "(default)";
const { firestoreDatabaseId: _, ...standardConfig } = configNode;

const app = getApps().length > 0 ? getApp() : initializeApp(standardConfig);
export const auth = getAuth(app);

// Suppress benign connection logs and offline notifications in console
try {
  setLogLevel('silent');
} catch (e) {}

// Resilient Firestore initialization conforming to Firebase Skill guidelines
// Uses experimentalAutoDetectLongPolling instead of experimentalForceLongPolling to avoid connection dropouts
let firestoreInstance: any;
try {
  firestoreInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    ignoreUndefinedProperties: true
  }, firestoreDatabaseId);
} catch (e) {
  firestoreInstance = getFirestore(app, firestoreDatabaseId);
}

export const db = firestoreInstance;
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
