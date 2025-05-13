'use client';

import ImageSlider from "@/components/detail/ImageSlider";
import SellerProductInfo from "@/components/detail/Product/Sell/SellerProductInfo";
import GoodsInfo from "@/components/detail/Product/GoodsInfo";
import ProductCard from "@/components/detail/Product/ProductCard";
import BidHistory from "@/components/detail/Bid/BidHistory";
import axios from "axios";
import { AuctionBidData, Product } from "@/types/productData";
import { useEffect, useState } from "react";

export default function SellerDetailView({ itemId }: { itemId: number }) {
  const [bidData, setBidData] = useState<AuctionBidData>();
  const [productData, setProductData] = useState<Product>();

  useEffect(() => {
    const fetchBidData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/auctions/${itemId}/bids`,
          { withCredentials: true }
        );
        setBidData(response.data.data);
      } catch (error) {
        console.error("입찰 내역 불러오기 실패:", error);
      }
    };

    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/auctions/${itemId}`,
          { withCredentials: true }
        );
        setProductData(response.data.data);
      } catch (error) {
        console.error("상품 정보 불러오기 실패:", error);
      }
    };

    fetchBidData();
    fetchProductData();
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
            <ProductCard product={productData} />
          </div>
        </div>
      </div>
    </>
  );
}
