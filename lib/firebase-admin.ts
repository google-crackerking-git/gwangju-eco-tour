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
      let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
      // 1. 리터럴 \n 변환 및 따옴표 제거
      privateKey = privateKey.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
      // 2. Netlify가 줄바꿈을 공백(띄어쓰기)으로 뭉개버린 경우 완벽 복구
      privateKey = privateKey.replace(/-----BEGIN PRIVATE KEY-----/g, 'BEGIN_KEY_MAGIC')
                             .replace(/-----END PRIVATE KEY-----/g, 'END_KEY_MAGIC')
                             .replace(/ /g, '\n')
                             .replace(/BEGIN_KEY_MAGIC/g, '-----BEGIN PRIVATE KEY-----\n')
                             .replace(/END_KEY_MAGIC/g, '\n-----END PRIVATE KEY-----\n');

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
