import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { db } = getFirebaseAdmin();
    const doc = await db.collection('users').doc(session.user.id).get();
    
    let totalScore = 0;
    let collectedSpots: string[] = [];
    if (doc.exists) {
      const data = doc.data();
      totalScore = data?.gameScore || 0;
      collectedSpots = data?.gameSpots || [];
    }
    
    return NextResponse.json({ success: true, totalScore, collectedSpots });
  } catch (err) {
    console.error('Failed to get game score', err);
    return NextResponse.json({ success: false, error: 'DB Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const newSpots: string[] = body.spots || [];
    
    const { db } = getFirebaseAdmin();
    const userRef = db.collection('users').doc(session.user.id);
    
    const doc = await userRef.get();
    let currentScore = 0;
    let currentSpots: string[] = [];
    
    if (doc.exists) {
      const data = doc.data();
      currentScore = data?.gameScore || 0;
      currentSpots = data?.gameSpots || [];
    }

    // Filter out spots that are already collected
    const actuallyNewSpots = newSpots.filter(spot => !currentSpots.includes(spot));
    const addedScore = actuallyNewSpots.length * 100; // 100 points per spot

    if (actuallyNewSpots.length > 0) {
      const updatedSpots = [...currentSpots, ...actuallyNewSpots];
      const updatedScore = currentScore + addedScore;
      
      await userRef.set({
        gameScore: updatedScore,
        gameSpots: updatedSpots
      }, { merge: true });
      
      return NextResponse.json({ success: true, addedScore, totalScore: updatedScore, actuallyNewSpots });
    }
    
    // Nothing new added
    return NextResponse.json({ success: true, addedScore: 0, totalScore: currentScore, actuallyNewSpots: [] });

  } catch (err) {
    console.error('Failed to update game score', err);
    return NextResponse.json({ success: false, error: 'DB Error' }, { status: 500 });
  }
}
