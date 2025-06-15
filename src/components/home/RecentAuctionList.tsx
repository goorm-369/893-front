"use client";
import Link from "next/link";
import Image from "next/image";
import { AuctionItem } from "@/lib/api/home";
import EmptyState from "@/components/home/EmptyState";

interface RecentAuctionListProps {
  recentAuctionList: AuctionItem[];
}

export default function RecentAuctionList({
  recentAuctionList,
}: RecentAuctionListProps) {
  if (recentAuctionList.length === 0) {
    return <EmptyState message="최근 등록된 경매 물품이 없습니다." />;
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {recentAuctionList.map((item) => (
          <Link href={`/detail/${item.auctionId}`} key={item.auctionId}>
            <div className="relative overflow-hidden transition border-none rounded-lg cursor-pointer">
              <div className="absolute p-4 right-1 top-24">
                <div
                  className={`flex justify-center tracking-[0.5px] items-center rounded text-[10px] text-white w-[48px] h-[18px] mb-2
                  ${item.status === "active" ? "bg-main" : "bg-gray-400"}`}
                >
                  {item.status === "active" ? "경매중" : "경매예정"}
                </div>
              </div>
              <div className="p-2  bg-white rounded-xl">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  width={500}
                  height={300}
                  className="rounded-xl object-cover w-full h-[130px]"
                />
              </div>
              <div className="p-2">
                <h3 className="pb-[3.2px] text-[16px] font-bold truncate text-sky-500 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-[16px] text-gray-600 line-clamp-1">
                  {item.description}
                </p>
                <p className="mt-2 text-[16px] font-semibold text-gray-600">
                  {item.basePrice.toLocaleString()}원
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
