'use client';

import ImageSlider from "@/components/detail/ImageSlider";
import SellerProductInfo from "@/components/detail/Product/Sell/SellerProductInfo";
import GoodsInfo from "@/components/detail/Product/GoodsInfo";
import AuctionCard from "@/components/detail/Product/AuctionCard";
import BidHistory from "@/components/detail/Bid/BidHistory";
import { AuctionBidData, Product } from "@/types/productData";
import { useEffect, useState } from "react";

import { getBidData,getProductData } from "@/lib/api/auction";
import {dummyProduct} from "@/data/dummyProductData"
import dummyBidData from "@/data/dummyBidData.json"

export default function SellerDetailView({ itemId }: { itemId: number }) {
  const [bidData, setBidData] = useState<AuctionBidData>(dummyBidData);
  const [productData, setProductData] = useState<Product>(dummyProduct);

  useEffect(() => {
    const fetchData = async () => {
      const [bid, product] = await Promise.all([
        getBidData(itemId),
        getProductData(itemId),
      ]);

      if (bid) setBidData(bid);
      if (product) setProductData(product);
    };

    fetchData();
  }, [itemId]);

  if (!productData || !bidData) return <div>로딩 중...</div>;

  return (
    <>
      <div className="flex justify-between p-5">
        <div className="flex-1 mr-5">
          <ImageSlider images={productData.images} />
          <GoodsInfo
            description={productData.description}
            itemCondition={productData.itemCondition}
          />
        </div>
        <div className="flex-1 max-w-[620px]">
          <div className="mb-4">
            <SellerProductInfo
              product={productData}
              auctionBidData={bidData}
            />
          </div>

          <div className="mb-4">
            <BidHistory
              bidData={bidData.bids}
              cancelData={bidData.cancelledBids}
            />
          </div>
        </div>
      </div>

      <hr />

      <div className="p-5">
        <h2 className="pl-4 mb-2 text-xl font-bold">관련 상품</h2>
        <div className="flex gap-6 pl-4 overflow-x-auto scrollbar-hide">
          <div className="min-w-[231px]">
            <AuctionCard product={productData} />
          </div>
        </div>
      </div>
    </>
  );
}
