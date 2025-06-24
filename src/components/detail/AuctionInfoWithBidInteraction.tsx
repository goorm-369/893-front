"use client";

import { useEffect, useState } from "react";
import QueryProvider from "../QueryProvider";
import { AuctionInfo } from "./AuctionInfo";
import { AuctionBidData, Bid, Product, Status } from "@/types/productData";
import { getRemainTime } from "@/lib/util/detailpage";
import { useRouter } from "next/navigation";
import BidInteraction from "./BidInteraction";
import { SSEAuctionStatus, SSEBidResult } from "@/types/sse.types";

interface AuctionInfoWithBidInteractionProps {
  product: Product;
  isLoggedIn: boolean;
  bidData: AuctionBidData;
  setBidData: React.Dispatch<React.SetStateAction<AuctionBidData>>;
}

export default function AuctionInfoWithBidInteraction({ product, isLoggedIn, bidData, setBidData }: AuctionInfoWithBidInteractionProps) {
  const currentPrice = bidData.currentPrice

  // 남은 시간과 시작 여부
  const { startTime, endTime } = product;
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  
  const [auctionState, setAuctionState] = useState<Status>(product.status);
  const [remainTime, setRemainTime] = useState<number>(auctionState === "pending" ? getRemainTime(product.startTime) : getRemainTime(product.endTime));
  const [isCancelable, setIsCancelable] = useState(bidData.canCancelBid);
  const [cancelTimer, setCancelTimer] = useState<number>(0);
  const [myBidId, setMyBidId] = useState<number | null>(
    () => {
      const v = window.sessionStorage.getItem("bidId");
      return v ? Number(v) : null;
    }
  );

  // 시간 계산 useEffect
  useEffect(() => {
    if (isNaN(start) || isNaN(end)) {
      console.error("잘못된 날짜 형식입니다:", { startTime, endTime });
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      let timeDiff;

      if (auctionState === "pending") {
        timeDiff = start - now;
      } else if (auctionState === "active") {
        timeDiff = end - now;
      } else {
        timeDiff = 0;
      }

      setRemainTime(Math.max(Math.floor(timeDiff / 1000), 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [auctionState, end, endTime, start, startTime]);
  
  const router = useRouter();

  const handlePayment = () => {
    router.push(`/payment?auctionId=${product.auctionId}`);
  };

  const updateBidDataFromSSE = (data: {
    bid: Bid;
    currentPrice: number;
    totalBid: number;
    totalBidder: number;
  }) => {
    const newBid = data.bid;
    setBidData((prev) => {
      const updatedBids = [newBid, ...prev.bids];
      return {
        ...prev,
        bids: updatedBids,
        currentPrice: data.currentPrice,
        totalBid: data.totalBid,
        totalBidder: data.totalBidder,
      };
    });
  };

  const removeBidData = (bidId: number) => {
    setBidData((prev) => {
      const bidToCancel = prev.bids.find((bid) => bid.bidId === bidId);
      if (!bidToCancel) return prev;

      const updatedBids = prev.bids.filter((bid) => bid.bidId !== bidId);
      const updatedCancelledBids = [bidToCancel, ...prev.cancelledBids];
      
      const newCurrentPrice = updatedBids.length > 0 ? updatedBids[0].bidPrice : product.basePrice;
      return {
        ...prev,
        currentPrice: newCurrentPrice,
        bids: updatedBids,
        cancelledBids: updatedCancelledBids,
        totalBid: updatedBids.length,
      };
    });
  };

  useEffect(() => {
    if (isCancelable && cancelTimer > 0) {
      const interval = setInterval(() => {
        setCancelTimer((prev) => {
          if (prev && prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev! - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cancelTimer, isCancelable]);

  useEffect(() => {
    const eventSourcePublic = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auctions/${product.auctionId}/stream`,
      { withCredentials: true }
    );

    const eventSourcePrivate = new EventSource(
      // ${product.auctionId}
      `${process.env.NEXT_PUBLIC_API_URL}/api/auctions/user/stream`,
      { withCredentials: true }
    );

    eventSourcePublic.addEventListener("connect", (event) => {
      console.log("SSE connected:", event.data);
    });

    eventSourcePublic.addEventListener("bid-update", (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.isCancelled) {
          removeBidData(data.bid.bidId);
        } else {
          updateBidDataFromSSE(data);
        }
      } catch (error) {
        console.error("SSE Bid Update Error:", error);
      }
    });

    eventSourcePrivate.addEventListener("bid-result", (event) => {
      try {
        const data = JSON.parse(event.data) as SSEBidResult;
        setIsCancelable(data.data.canCancelBid);
        setMyBidId(data.data.bid.bidId);
        window.sessionStorage.setItem("bidId", data.data.bid.bidId.toString());
        const createdAt = new Date(data.data.bid.createdAt);
        const cancelAvailableDate = new Date(createdAt.getTime() + 60 * 1000);
        setCancelTimer(getRemainTime(cancelAvailableDate.toISOString()));
      } catch (error) {
        console.error("SSE Bid Update Error:", error);
      }
    });

    eventSourcePublic.addEventListener("status-update", (event) => {
      try {
        const data = JSON.parse(event.data) as SSEAuctionStatus;
        setAuctionState(data.status);
        if (data.status === "active") {
          setRemainTime(getRemainTime(product.endTime));
        } else if (data.status === "completed") {
          setRemainTime(0);
          router.refresh();
        }
      } catch (error) {
        console.error("SSE Auction Status Update Error:", error);
      }
    });

    eventSourcePrivate.onerror = (err) => {
      console.error("SSE error:", err);
    };

    eventSourcePublic.onerror = (err) => {
      console.error("SSE error:", err);
    };

    return () => {
      console.log('언 마운트 되며 SSE 정리')
      eventSourcePublic.close();
      eventSourcePrivate.close();
    };
  }, [product.auctionId]);

  return (
    <div className="mx-auto max-w-[620px] border border-blue-400 rounded-lg p-4 mb-4">
      <div className="mb-4">
        <QueryProvider>
          <AuctionInfo
            product={product}
            currentPrice={currentPrice}
            auctionBidData={bidData}
            isLoggedIn={isLoggedIn}
            remainTime={remainTime}
            auctionState={auctionState}
          />
        </QueryProvider>
      </div>
      
      {!isLoggedIn && auctionState === "active" && (
        <>
          <hr className="border-gray-300 my-4" />
          <div className="text-center text-gray-500">로그인 후 입찰 가능합니다.</div>
        </>
      )}

      {isLoggedIn && !product.isSeller && auctionState === "active" && (
        <>
          <hr className="border-gray-300 my-4" />
          <BidInteraction
            product={product}
            removeBidData={removeBidData}
            isLoggedIn={isLoggedIn}
            currentPrice={currentPrice}
            remainTime={remainTime}
            auctionState={auctionState}
            isCancelable={isCancelable}
            myBidId={myBidId}
            setMyBidId={setMyBidId}
            cancelTimer={cancelTimer}
            setCancelTimer={setCancelTimer}
          />
        </>
      )}

      {!product.isSeller && product.status === "completed" && !product.hasBeenPaid && product.currentUserBuyer && (
        <>
          <hr className="border-gray-300 my-4" />
          <button className="w-[72px] h-[32px] text-sm text-white rounded bg-green-500 hover:bg-green-600" onClick={handlePayment}>
            결제하기
          </button>
        </>
      )}

      {product.hasBeenPaid && (
        <>
          <hr className="border-gray-300 my-4" />
          <div className="text-center text-gray-500">결제가 완료된 경매입니다.</div>
        </>
      )}

      {bidData.bids.length === 0 && auctionState === "completed" && (
        <>
          <hr className="border-gray-300 my-4" />
          <div className="text-center text-gray-500">유찰된 경매입니다.</div>
        </>
      )}
    </div>
  )
}