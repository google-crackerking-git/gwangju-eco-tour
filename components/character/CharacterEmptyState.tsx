'use client';

import Image from 'next/image';

type EmptyStateType = 'no-tourism' | 'no-route' | 'no-favorites' | 'no-visits';

interface CharacterEmptyStateProps {
  type: EmptyStateType;
}

const CONFIG: Record<
  EmptyStateType,
  { image: string; message: string }
> = {
  'no-tourism': {
    image: '/characters/31. 응용형(길찾기).png',
    message: '주변에 관광지가 없어요\n정류장을 선택해 보세요',
  },
  'no-route': {
    image: '/characters/1.기본형(정면).png',
    message: '노선을 선택해 주세요',
  },
  'no-favorites': {
    image: '/characters/30. 응용형(피크닉).png',
    message: '즐겨찾기한 장소가 없어요',
  },
  'no-visits': {
    image: '/characters/6. 응용형(등산).png',
    message: '방문한 장소를 기록해 보세요',
  },
};

export default function CharacterEmptyState({ type }: CharacterEmptyStateProps) {
  const { image, message } = CONFIG[type];

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <Image
        src={image}
        alt={message.split('\n')[0]}
        width={120}
        height={120}
      />
      <p className="whitespace-pre-line text-sm text-gray-500">{message}</p>
    </div>
  );
}
