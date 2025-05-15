'use client';

import { Bookmark } from 'lucide-react';
import { useState } from 'react';
import { Auction } from '@/types/response.types';
import Image from 'next/image';

interface AuctionCardProps {
  product: Auction;
}

const statusMap: Record<Auction['status'], { label: string; color: string }> = {
  pending: { label: "경매 전", color: "bg-rightgray" },
  active: { label: "경매 중", color: "bg-main" },
  completed: { label: "종료", color: "bg-red" },
  cancelled: { label: "취소", color: "bg-red" },
};

export default function AuctionCard({ product }: AuctionCardProps) {
  

  const [isScraped, setIsScraped] = useState<boolean>(product.isScrapped ?? false);
  const [bookmarkCount, setBookmarkCount] = useState<number>(product.scrapCount);
  
  if(!product) return null;
  
  const statusInfo = statusMap[product.status] ?? { label: "알 수 없음", color: "bg-red-500" };

  const handleScrapToggle = () => {
    setIsScraped((prev) => !prev);
    setBookmarkCount((prev) => (isScraped ? prev - 1 : prev + 1));
  };

  return (
    <div className="p-2 rounded-xl shadow border w-[231px] bg-white">
      <div className="grid grid-cols-1 grid-rows-1">
        <Image
          src={product.thumbnailUrl || '/placeholder.jpg'}
          alt={product.title}
          width={231}
          height={231}
          className="row-start-1 col-start-1 w-full h-48 bg-gray-200 rounded-lg"
        />
        <span
          className={`
            row-start-1 col-start-1
            self-start justify-self-start
            mt-2 ml-2
            px-2 py-0.5 text-xs font-bold text-white rounded
            ${statusInfo.color}
          `}
        >
          {statusInfo.label}
        </span>
        <button
          onClick={handleScrapToggle}
          className="row-start-1 col-start-1 self-end justify-self-end mb-2 mr-2 p-1">
          <Bookmark
            className={`
            w-5 h-5
            ${isScraped ? 'text-black fill-black' : 'text-gray-400 hover:text-black hover:fill-black'}
            `}
          />
        </button>
      </div>

      <div className="pt-3 space-y-1">
        <p className="text-sm font-medium truncate">{product.title}</p>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <span>🕒 종료 :</span>
          <span>{new Date(product.endTime).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <span>👥</span>
          <span>{product.status === 'pending' ? 0 : product.scrapCount}명</span>
        </div>
        <p className="pt-1 text-sm font-bold text-black">
          현재 입찰가 : {(product.status === 'pending' ? product.basePrice : product.basePrice).toLocaleString()}원
        </p>
        <p className="text-xs text-gray-500">스크랩 {bookmarkCount}</p>
      </div>
    </div>
  );
}
