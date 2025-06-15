"use client";

import { useState } from "react";
import { AuctionRankingItem } from "@/lib/api/home";
import EmptyState from "@/components/home/EmptyState";
import { useRouter } from "next/navigation";
import Image from "next/image";

const itemConditionLabel: Record<AuctionRankingItem["itemCondition"], string> =
  {
    brand_new: "새 상품 (미사용)",
    like_new: "사용감 없음",
    gently_used: "사용감 적음",
    heavily_used: "사용감 많음",
    damaged: "고장/파손 상품",
  };

interface RealTimeRankingPanelProps {
  realTimeRankingItemActive: AuctionRankingItem[];
  realTimeRankingItemPending: AuctionRankingItem[];
}

export default function RealTimeRankingPanel({
  realTimeRankingItemActive,
  realTimeRankingItemPending,
}: RealTimeRankingPanelProps) {
  const [tab, setTab] = useState<"active" | "upcoming">("active");

  const currentTimeRankingData =
    tab === "active" ? realTimeRankingItemActive : realTimeRankingItemPending;
  const router = useRouter();
  return (
    <div className="w-[435px] bg-white p-4">
      <h2 className="text-xl font-bold mb-4">실시간 랭킹</h2>

      {/* 탭 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("active")}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            tab === "active" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          경매진행중
        </button>
        <button
          onClick={() => setTab("upcoming")}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            tab === "upcoming" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          경매예정
        </button>
      </div>

      {/* 랭킹 리스트 or Empty */}
      {currentTimeRankingData.length === 0 ? (
        <EmptyState
          message={
            tab === "active"
              ? "실시간 경매중인 물품이 없습니다."
              : "실시간 예정된 경매가 없습니다."
          }
          className="pt-10 pb-10"
        />
      ) : (
        <div className="space-y-4">
          {currentTimeRankingData.map((item) => (
            <div
              key={item.auctionId}
              className="flex gap-3 pt-3 items-start cursor-pointer rounded px-2"
              onClick={() => router.push(`/detail/${item.auctionId}`)}
            >
              <div className="text-lg font-bold text-gray-600">
                {item.rankNum}
              </div>

              <div className="flex-1 w-[190px] h-[80px]">
                <div className="text-sm font-semibold truncate">
                  {item.title}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {item.description}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  상태: {itemConditionLabel[item.itemCondition]}
                </div>
                <div className="text-sky-500 font-bold text-sm mt-1">
                  {tab === "active"
                    ? `현재 입찰 수: ${item.bidCount}회`
                    : `스크랩 ${item.scrapCount}`}
                </div>
              </div>
              <div className="flex-shrink-0 ml-auto">
                <Image
                  src={item.thumbnailUrl}
                  alt="썸네일"
                  width={160}
                  height={80}
                  className="w-[160px] h-[80px] rounded object-cover border"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
