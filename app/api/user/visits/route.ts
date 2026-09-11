// 방문기록 CRUD API Route
// Firebase Admin SDK를 통해 Firestore에 접근합니다.

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import type { VisitRecord } from '@/types';

// GET — 방문기록 목록 조회
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    const { db } = getFirebaseAdmin();
    const snapshot = await db
      .collection('visits')
      .doc(session.user.id)
      .collection('history')
      .orderBy('visitedAt', 'desc')
      .get();

    const visits: VisitRecord[] = snapshot.docs.map((doc) => ({
      visitId: doc.id,
      ...(doc.data() as Omit<VisitRecord, 'visitId'>),
    }));

    return NextResponse.json({ success: true, data: visits });
  } catch (error) {
    console.error('[Visits GET Error]', error);
    return NextResponse.json({ success: false, error: '방문기록 조회 실패' }, { status: 500 });
  }
}

// POST — 방문기록 추가
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    const body: Omit<VisitRecord, 'visitId' | 'visitedAt'> & { memo?: string } = await request.json();
    const { db } = getFirebaseAdmin();

    const visitData: Omit<VisitRecord, 'visitId'> = {
      placeId: body.placeId,
      title: body.title,
      contentTypeId: body.contentTypeId,
      mapX: body.mapX,
      mapY: body.mapY,
      firstimage: body.firstimage ?? '',
      nearestStop: body.nearestStop,
      visitedAt: new Date().toISOString(),
      memo: body.memo ?? '',
    };

    const docRef = await db
      .collection('visits')
      .doc(session.user.id)
      .collection('history')
      .add(visitData);

    return NextResponse.json({ success: true, data: { visitId: docRef.id } });
  } catch (error) {
    console.error('[Visits POST Error]', error);
    return NextResponse.json({ success: false, error: '방문기록 추가 실패' }, { status: 500 });
  }
}

// PATCH — 방문기록 메모 수정
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    const { visitId, memo }: { visitId: string; memo: string } = await request.json();
    const { db } = getFirebaseAdmin();

    await db
      .collection('visits')
      .doc(session.user.id)
      .collection('history')
      .doc(visitId)
      .update({ memo });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Visits PATCH Error]', error);
    return NextResponse.json({ success: false, error: '방문기록 수정 실패' }, { status: 500 });
  }
}

// DELETE — 방문기록 삭제
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    const { visitId }: { visitId: string } = await request.json();
    const { db } = getFirebaseAdmin();

    await db
      .collection('visits')
      .doc(session.user.id)
      .collection('history')
      .doc(visitId)
      .delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Visits DELETE Error]', error);
    return NextResponse.json({ success: false, error: '방문기록 삭제 실패' }, { status: 500 });
  }
}
