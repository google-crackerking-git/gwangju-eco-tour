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
      
      // 어떤 형태로 훼손되었든 완벽하게 복구하는 로직
      // 1. 순수 Base64 페이로드만 추출 (헤더, 푸터, 공백, 따옴표, 줄바꿈 모두 제거)
      const base64Payload = privateKey
        .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        .replace(/-----END PRIVATE KEY-----/g, '')
        .replace(/\\n/g, '') // 리터럴 \n 제거
        .replace(/[^A-Za-z0-9+/=]/g, ''); // Base64 문자가 아닌 것(공백, 따옴표 등) 싹 다 제거

      // 2. 64글자씩 예쁘게 줄바꿈하여 규격에 맞는 PEM 포맷으로 재조립
      const wrappedPayload = base64Payload.match(/.{1,64}/g)?.join('\n') || '';
      privateKey = `-----BEGIN PRIVATE KEY-----\n${wrappedPayload}\n-----END PRIVATE KEY-----\n`;

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
