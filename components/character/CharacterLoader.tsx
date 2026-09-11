'use client';

import Image from 'next/image';

export default function CharacterLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80">
      <div className="omona-bounce">
        <Image
          src="/characters/5. 응용형(자전거).png"
          alt="초록 오메나 자전거 캐릭터"
          width={150}
          height={150}
          priority
        />
      </div>
      <p
        className="mt-4 text-base font-bold"
        style={{ color: 'var(--color-brand-green)' }}
      >
        광주를 탐험 중...
      </p>
    </div>
  );
}
