import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { db } = getFirebaseAdmin();
    
    // Count total users who have favorites
    const favUsers = await db.collection('favorites').get();
    let totalPlaces = 0;
    const userPlaces = [];
    
    for (const doc of favUsers.docs) {
      const places = await db.collection('favorites').doc(doc.id).collection('places').get();
      totalPlaces += places.size;
      userPlaces.push({ userId: doc.id, count: places.size });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Firebase is connected',
      stats: {
        totalUsers: favUsers.size,
        totalPlaces: totalPlaces,
        userPlaces
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
