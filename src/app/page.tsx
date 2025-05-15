import HomeTitle from "@/components/molecules/HomeTitle";
import SpinningWord from "@/components/atoms/SpinningWord";
import CategorySearchSection from "@/components/molecules/CategorySearchSection";
import SearchInput from "@/components/templates/SearchInput";

import AuctionCard from "@/components/detail/Product/ProductCard";
import type { Product } from "@/types/productData";

import { Metadata } from "next";
// async function getProducts() {
//   const res = await fetch('http://localhost:3000/mocks/products.json'); // TODO 추후 백엔드 URI로 변경

//   if (!res.ok) {
//     throw new Error('Failed to fetch products');
//   }

//   return res;
// }

export const metadata: Metadata = {
  title: "중고 경매 플랫폼 팔구삼 893",
  description: "중고 상품을 경매로 사고 팔 수 있는 팔구삼 893",
}

export default async function Home() {
  // const products = await getProducts(); // TODO 추후 상품 섹션과 연결

  const mockProduct:Product = {
    auctionId: 1,
    title: "상품 1",
    description: "설명 1",
    sellerEmailMasked: "example1@*****.com",
    status: "yet",
    itemCondition: "like_new",
    basePrice: 10000,
    isScrap: false,
    scrapCount: 3,
    isSeller: false,
    category: {
      id: 1,
      mainCategory: "전자기기",
      subCategory: "휴대폰",
      detailCategory: "스마트폰",
    },
    startTime: "2024-01-01",
    endTime: "2024-01-10",
    mainImage: {
      originalName: "sample.jpg",
      storeName: "sample_1.jpg",
      url: "https://via.placeholder.com/150",
      imageSeq: 1,
    },
    images: [],
  };
  
  return (
    <>
      <div className="grid justify-center items-center gap-4 w-full">
        <HomeTitle>
          <SpinningWord/>
          <span>&nbsp;경매에 참여해보세요</span>
        </HomeTitle>
        <div className="flex justify-center w-full">
          <SearchInput/>
        </div>
        <CategorySearchSection/>
      </div>
      <div className="grid grid-cols-5 gap-4 mt-8">
        <AuctionCard product={mockProduct}/>
      </div>
    </>
  );
}
