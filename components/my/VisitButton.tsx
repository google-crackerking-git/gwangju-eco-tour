// 방문기록 추가 버튼 컴포넌트
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import type { VisitRecord } from '@/types';

interface VisitButtonProps {
  placeData: Omit<VisitRecord, 'visitId' | 'visitedAt'>;
}

export default function VisitButton({ placeData }: VisitButtonProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [showMemoInput, setShowMemoInput] = useState(false);
  const [memo, setMemo] = useState('');

  const handleRecord = async () => {
    if (!session) {
      alert('로그인 후 이용할 수 있어요.');
      return;
    }
    setShowMemoInput(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/user/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...placeData, memo }),
      });
      const data = await res.json();
      if (data.success) {
        setIsRecorded(true);
        setShowMemoInput(false);
        setMemo('');
      }
    } catch {
      alert('기록 중 오류가 발생했어요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showMemoInput) {
    return (
      <div className="flex-1 space-y-2">
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="방문 메모를 남겨보세요 (선택)"
          className="w-full text-sm border border-gray-200 rounded-xl p-2 resize-none focus:outline-none focus:border-blue-400"
          rows={2}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setShowMemoInput(false)}
            className="flex-1 py-1.5 rounded-xl text-xs text-gray-500 border border-gray-200"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 py-1.5 rounded-xl text-xs text-white font-medium disabled:opacity-50"
            style={{ backgroundColor: '#2D7A3A' }}
          >
            {isLoading ? '저장 중...' : '기록하기'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleRecord}
      disabled={isLoading}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all ${
        isRecorded
          ? 'bg-green-50 text-green-600 border border-green-200'
          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-green-50 hover:text-green-600'
      } disabled:opacity-50`}
    >
      <span>{isRecorded ? '✅' : '📍'}</span>
      {isRecorded ? '기록됨' : '방문기록'}
    </button>
  );
}
