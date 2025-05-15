'use client';

import { Bookmark, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AuctionStatsProps } from '@/types/productData';

export function AuctionState({
  product,
  auctionBidData,
  isBookmarked,
  bookmarkCount,
  onBookmarkToggle
}: AuctionStatsProps) {
  const { basePrice, endTime } = product;

  const currentPrice = auctionBidData.bids?.length
    ? Math.max(...auctionBidData.bids.map((bid) => bid.bidPrice))
    : basePrice;

  const bidCount = auctionBidData.totalBid;
  const bidderCount = auctionBidData.totalBidder;

  const [remainingTime, setRemainingTime] = useState<number>(
    Math.max(Math.floor((new Date(endTime).getTime() - new Date().getTime()) / 1000), 0)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((new Date(endTime).getTime() - Date.now()) / 1000);
      setRemainingTime(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const formatTime = (seconds: number) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const min = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${hours}:${min}:${sec}`;
  };

  

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-black">현재가</p>
          <p className="text-xl font-bold text-main">₩{currentPrice}</p>
        </div>
        <div className="w-1/2">
          <p className="text-sm text-black">남은 시간</p>
          <p className="flex items-center gap-1 text-xl font-bold text-blue-600">
            <Timer className="w-5 h-5" />
            {formatTime(remainingTime)}
          </p>
        </div>
      </div>

      <div className="flex justify-between mb-2">
        <div>
          <p className="text-sm text-gray-600">입찰 수</p>
          <p className="text-lg font-bold">{bidCount}회</p>
        </div>
        <div className='w-1/2'>
          <p className="text-sm text-gray-600">입찰자 수</p>
          <p className="text-lg font-bold">{bidderCount}명</p>
        </div>
      </div>

      <div className="flex items-center gap-1 text-gray-700">
        <button onClick={onBookmarkToggle} aria-label="북마크 토글">
          <Bookmark
            className={`w-5 h-5 ${isBookmarked ? 'text-black fill-black' : 'text-gray-400 hover:text-black hover:fill-black'}`}
          />
        </button>
        <span className="text-sm">{bookmarkCount}</span>
      </div>
    </div>
  );
}
