"use client";

const AuctionInfoWithBidInteraction = dynamic(
  () => import("@/components/detail/AuctionInfoWithBidInteraction"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64" />
    ),
  }
);

import BidHistory from "@/components/detail/Bid/BidHistory";
import { Product, AuctionBidData } from "@/types/productData";
import dynamic from "next/dynamic";
import { useState } from "react";

interface DetailInfoWithBidProps {
  initialBidData: AuctionBidData;
  product: Product;
  isLoggedIn: boolean;
}

export default function DetailInfoWithBid({
  initialBidData,
  product,
  isLoggedIn,
}: DetailInfoWithBidProps) { 
  const [bidData, setBidData] = useState<AuctionBidData>(initialBidData);

  return (
    <>
      <AuctionInfoWithBidInteraction
        product={product}
        isLoggedIn={isLoggedIn}
        bidData={bidData}
        setBidData={setBidData}
      />
      <BidHistory
        bidData={bidData.bids}
        cancelData={bidData.cancelledBids}
      />
    </>
  );
}
