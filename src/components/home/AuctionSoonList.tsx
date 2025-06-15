"use client";

import { useEffect, useState } from "react";
import { parseLeftTimeStringToMs } from "@/lib/util/time";
import { useRouter } from "next/navigation";
import Image from "next/image";

export type AuctionSoonItemProps = {
  auctionId: number;
  title: string;
  description: string;
  scrapCount: number;
  thumbnailUrl: string;
  itemCondition:
    | "brand_new"
    | "like_new"
    | "gently_used"
    | "heavily_used"
    | "damaged";
  basePrice: number;
  leftTime: string;
};

const itemConditionLabel: Record<
  AuctionSoonItemProps["itemCondition"],
  string
> = {
  brand_new: "새 상품 (미사용)",
  like_new: "사용감 없음",
  gently_used: "사용감 적음",
  heavily_used: "사용감 많음",
  damaged: "고장/파손 상품",
};

export default function AuctionSoonItem({
  auctionId,
  title,
  description,
  scrapCount,
  thumbnailUrl,
  itemCondition,
  basePrice,
  leftTime,
}: AuctionSoonItemProps) {
  const [displayTime, setDisplayTime] = useState(leftTime);
  const [isStarted, setIsStarted] = useState(false);
  const router = useRouter();

  const handleParticipateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/detail/${auctionId}`);
  };

  useEffect(() => {
    const deadline = Date.now() + parseLeftTimeStringToMs(leftTime);

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, deadline - now);

      if (diff === 0) {
        setIsStarted(true);
        clearInterval(timer);
        return;
      }

      const hours = String(Math.floor(diff / 1000 / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(
        2,
        "0"
      );
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

      setDisplayTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [leftTime]);

  return (
    <div className="w-full max-w-[400px] rounded border overflow-hidden shadow-sm bg-white">
      <div className="relative w-full h-[240px]">
        <Image src={thumbnailUrl} alt="썸네일" fill className="object-cover" />
      </div>

      <div className="p-4">
        <p className="text-[13px] font-semibold text-gray-500 text-center mb-2">
          {isStarted ? "경매 시작" : `시작까지 남은 시간 ${displayTime}`}
        </p>
        <p className="pl-2 text-[20px] font-semibold truncate mb-1 ">{title}</p>
        <p className="pr-2 text-[14px] text-gray-600 justify-end flex">
          {itemConditionLabel[itemCondition]}
        </p>

        <p className="pr-2 text-sky-500 mt-1 text-[16px] font-semibold justify-end flex">
          스크랩 수 {scrapCount}
        </p>

        <div className="pr-2 mt-3 text-xs text-gray-500 truncate justify-end flex">
          {description}
        </div>
        <p className="pr-2 text-sm font-semibold mt-1 justify-end flex">
          시작가 {basePrice.toLocaleString()}원
        </p>

        <button
          onClick={handleParticipateClick}
          className="mt-3 w-full py-1.5 text-sm rounded bg-gray-200 text-gray-600 hover:bg-gray-400 hover:text-gray-800 transition cursor-pointer"
        >
          지금 참여하기
        </button>
      </div>
    </div>
  );
}
