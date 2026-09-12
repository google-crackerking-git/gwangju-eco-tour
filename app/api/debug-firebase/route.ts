import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { app, db } = getFirebaseAdmin();
    await db.collection('test').limit(1).get();
    
    return NextResponse.json({
      success: true,
      message: 'Firebase initialized and connected successfully',
      projectId: app.options.projectId
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      envCheck: {
        hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      }
    }, { status: 500 });
  }
}
