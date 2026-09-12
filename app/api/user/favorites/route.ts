// 즐겨찾기 CRUD API Route
// Firebase Admin SDK를 통해 Firestore에 접근합니다.
// 클라이언트는 Firebase에 직접 접근하지 않습니다.

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import type { FavoritePlace } from '@/types';

export const dynamic = 'force-dynamic';

// GET — 즐겨찾기 목록 조회
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    const { db } = getFirebaseAdmin();
    const snapshot = await db
      .collection('favorites')
      .doc(session.user.id)
      .collection('places')
      .orderBy('savedAt', 'desc')
      .get();

    const favorites: FavoritePlace[] = snapshot.docs.map((doc) => ({
      placeId: doc.id,
      ...(doc.data() as Omit<FavoritePlace, 'placeId'>),
    }));

    return NextResponse.json({ success: true, data: favorites });
  } catch (error) {
    console.error('[Favorites GET Error]', error);
    return NextResponse.json({ success: false, error: '즐겨찾기 목록 조회 실패' }, { status: 500 });
  }
}

// POST — 즐겨찾기 추가
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    const body: Omit<FavoritePlace, 'savedAt'> = await request.json();
    const { db } = getFirebaseAdmin();

    const placeData: Omit<FavoritePlace, 'placeId'> = {
      title: body.title,
      contentTypeId: body.contentTypeId,
      mapX: body.mapX,
      mapY: body.mapY,
      firstimage: body.firstimage ?? '',
      nearestStop: body.nearestStop,
      savedAt: new Date().toISOString(),
    };

    await db
      .collection('favorites')
      .doc(session.user.id)
      .collection('places')
      .doc(body.placeId)
      .set(placeData);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Favorites POST Error]', error);
    return NextResponse.json({ success: false, error: error.message || '즐겨찾기 추가 실패' }, { status: 500 });
  }
}

// DELETE — 즐겨찾기 삭제
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    const { placeId } = await request.json();
    const { db } = getFirebaseAdmin();

    await db
      .collection('favorites')
      .doc(session.user.id)
      .collection('places')
      .doc(placeId)
      .delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Favorites DELETE Error]', error);
    return NextResponse.json({ success: false, error: '즐겨찾기 삭제 실패' }, { status: 500 });
  }
}
