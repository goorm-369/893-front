"use client";

import { useEffect, useRef, useState } from "react";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { BestCategoryGroup } from "@/lib/api/home";
import { useRouter } from "next/navigation";
import Image from "next/image";
import EmptyState from "./EmptyState";
interface BestByCategoryProps {
  bestByCategory: BestCategoryGroup[];
}

export default function BestByCategory({
  bestByCategory,
}: BestByCategoryProps) {
  const [selectedTab, setSelectedTab] = useState<number | null>(
    bestByCategory[0]?.subCategoryId
  );

  const selectedCategory = bestByCategory.find(
    (cat) => cat.subCategoryId === selectedTab
  );

  const router = useRouter();

  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  useEffect(() => {
    if (selectedTab === null) return;
    const button = buttonRefs.current.get(selectedTab);
    const container = scrollRef.current;
    if (button && container) {
      const buttonLeft = button.offsetLeft;
      const containerWidth = container.offsetWidth;
      container.scrollTo({
        left: buttonLeft - containerWidth / 2 + button.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  }, [selectedTab]);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="relative mb-6" role="tablist" data-testid="category-tabs">
        <button
          onClick={() => handleScroll("left")}
          aria-label="왼쪽 스크롤"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white  rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-3 px-8 overflow-x-auto whitespace-nowrap no-scrollbar scroll-smooth"
        >
          {bestByCategory.map((cat) => (
            <button
              key={cat.subCategoryId}
              role="tab"
              aria-selected={selectedTab === cat.subCategoryId}
              ref={(el) => {
                if (el) buttonRefs.current.set(cat.subCategoryId, el);
              }}
              onClick={() => setSelectedTab(cat.subCategoryId)}
              className={`shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition ${
                selectedTab === cat.subCategoryId
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {cat.subCategoryName}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleScroll("right")}
          aria-label="오른쪽 스크롤"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white  rounded-full"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {selectedCategory && selectedCategory.items.length > 0 ? (
        <div className="grid grid-cols-4 gap-6">
          {selectedCategory.items.map((item) => (
            <div
              key={item.auctionId}
              onClick={() => router.push(`/detail/${item.auctionId}`)}
              className="border rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
            >
              <div className="relative">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  width={390}
                  height={222}
                  className="w-[390px] h-[222px] object-cover"
                />
                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  {item.rankNum}
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-[18px] font-semibold truncate">
                  {item.title}
                </h3>
                <p className="text-[16px] text-gray-500 mt-2 truncate">
                  스크랩 {item.scrapCount}회 ·{" "}
                  {translateCondition(item.itemCondition)}
                </p>
              </div>
              <div className="flex items-center px-2 pb-2 gap-2">
                <span
                  className={`text-[12px] px-2 py-1 rounded ${
                    item.status === "active" ? "bg-main" : "bg-gray-400"
                  } text-white`}
                >
                  {item.status === "active" ? "경매중" : "경매예정"}
                </span>
                {item.isAuctionImminent && (
                  <span className="bg-rose-500 text-white text-[12px] px-2 py-1 rounded">
                    곧 시작 <Flame className="inline h-4 w-4 ml-1" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="해당 카테고리에 등록된 상품이 없습니다." />
      )}
    </div>
  );
}

function translateCondition(cond: string): string {
  const map: Record<string, string> = {
    brand_new: "새 상품 (미사용)",
    like_new: "사용감 없음",
    gently_used: "사용감 적음",
    heavily_used: "사용감 많음",
    damaged: "고장/파손 상품",
  };
  return map[cond] || cond;
}
