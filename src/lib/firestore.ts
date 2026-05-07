import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { AuditDocument, AuditResult } from "@/types";

const AUDITS_COLLECTION = "audits";

export async function saveAudit(audit: AuditResult): Promise<string> {
  const docRef = doc(collection(db, AUDITS_COLLECTION), audit.shareSlug);

  const document: Omit<AuditDocument, "id"> = {
    ...audit,
    viewCount: 0,
  };

  await setDoc(docRef, {
    ...document,
    serverCreatedAt: serverTimestamp(),
  });

  return audit.shareSlug;
}

export async function getAuditBySlug(
  slug: string
): Promise<AuditDocument | null> {
  const docRef = doc(db, AUDITS_COLLECTION, slug);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return null;

  // Increment view count asynchronously — don't block render
  updateDoc(docRef, { viewCount: increment(1) }).catch(() => {
    // Non-critical — view count is best-effort
  });

  return snap.data() as AuditDocument;
}
