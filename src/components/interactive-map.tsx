
'use client';

import Image from 'next/image';

export function InteractiveMap() {
  return (
    <Image
      src="https://placehold.co/1200x800.png"
      alt="Live mission map"
      layout="fill"
      objectFit="cover"
      className="w-full h-full"
      data-ai-hint="world map"
    />
  );
}
