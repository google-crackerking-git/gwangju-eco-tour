// Firebase Admin SDK 초기화 — 서버사이드 전용
// 이 파일은 절대 클라이언트 컴포넌트에서 import하지 마세요.

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App;
let db: Firestore;

function getFirebaseAdmin() {
  if (!app) {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Firebase Admin SDK 환경변수가 설정되지 않았습니다. .env.local을 확인하세요.');
      }

      app = initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    }
  }

  if (!db) {
    db = getFirestore(app);
  }

  return { app, db };
}

export { getFirebaseAdmin };
