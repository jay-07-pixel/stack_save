import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebasePublicConfig } from "./config";

function getOrInit(): { app: FirebaseApp; db: Firestore } {
  const config = getFirebasePublicConfig();
  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  const db = getFirestore(app);
  return { app, db };
}

const { app: firebaseApp, db } = getOrInit();

export { firebaseApp, db };
