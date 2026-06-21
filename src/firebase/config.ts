import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy, limit, where } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Standard fallback if config is not activated in sandbox yet
const fallbackConfig = {
  apiKey: "AIzaSyFake_Key-AAT-Digital-Agency-2026",
  authDomain: "aat-digital-agency.firebaseapp.com",
  projectId: "aat-digital-agency",
  storageBucket: "aat-digital-agency.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

let app;
let db: any = null;
let auth: any = null;
let isRealFirebase = false;

try {
  const activeConfig = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("Fake") ? firebaseConfig : fallbackConfig;
  app = getApps().length === 0 ? initializeApp(activeConfig) : getApp();
  
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("Fake")) {
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
    auth = getAuth(app);
    isRealFirebase = true;
    console.log("Real Firebase initialized successfully from applet config.");
  } else {
    db = getFirestore(app);
    auth = getAuth(app);
    isRealFirebase = false;
    console.warn("Using simulation fallback database.");
  }
} catch (e) {
  console.error("Firebase initialization failed, utilizing simulation safety layer:", e);
  // Re-attempt fallback in case of databaseId mismatches
  try {
    app = getApps().length === 0 ? initializeApp(fallbackConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (errInner) {
    console.error("Critical fallback failed:", errInner);
  }
}

// Error reporting schema conformant to Phase 3 of Firebase Guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || "anonymous",
      email: auth?.currentUser?.email || "anonymous@example.com",
      emailVerified: auth?.currentUser?.emailVerified || false,
    },
    operationType,
    path
  };
  console.error('Firestore Error Payload: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Highly reliable lead logging gateway
export async function submitLead(leadData: {
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  message: string;
}) {
  const payload = {
    ...leadData,
    status: 'new',
    timestamp: new Date().toISOString()
  };

  // Safe localStorage backup trail
  try {
    const existingLeads = JSON.parse(localStorage.getItem('aat_sim_leads') || '[]');
    existingLeads.push(payload);
    localStorage.setItem('aat_sim_leads', JSON.stringify(existingLeads));
  } catch (err) {
    console.error("Failed to commit fallback local audit trail:", err);
  }

  if (isRealFirebase && db) {
    try {
      const pathForWrite = 'leads';
      const leadsCol = collection(db, pathForWrite);
      // Use dynamic ID for isValidId security policy rule
      const customId = "ld_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
      await setDoc(doc(db, pathForWrite, customId), {
        ...payload,
        timestamp: serverTimestamp()
      });
      return { success: true, method: 'firestore' };
    } catch (firebaseError) {
      handleFirestoreError(firebaseError, OperationType.CREATE, 'leads');
    }
  }

  // Simulate delay for high quality UX animations
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, method: 'simulation' };
}

// Global Auth Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { db, auth, isRealFirebase };
