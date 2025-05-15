'use client';

import SearchInput from "@/components/templates/SearchInput";
import CategoryFilter from "@/components/templates/searchpage/CategoryFilter";
import PriceFilter from "@/components/molecules/searchpage/PriceFilter";
import AuctionStatusFilter from "@/components/templates/searchpage/AuctionStatusFilter";
import ProductStatusFilter from "@/components/templates/searchpage/ProductStatusFilter";
import ProductSort from "@/components/molecules/searchpage/ProductSort";
import ProductRelated from "@/components/molecules/searchpage/ProductRelated";
import FilterRefreshButton from "@/components/atoms/searchpage/FilterRefreshButton";
import AuctionCard from "@/components/detail/Product/ProductCard";
import { Product } from "@/types/productData";

async function getSearchProducts(searchParams: Record<string, string | string[] | undefined>): Promise<Product[]> {
  const urlSearchParams = new URLSearchParams();
  
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => {
        if (item) urlSearchParams.append(key, item);
      });
    } else if (value !== undefined) {
      urlSearchParams.append(key, value);
    }
  });

  let queryString = urlSearchParams.toString();
  if (queryString.length > 0) {
    queryString = `?${queryString}`;
  }

  console.log(`API 호출 URL: /api/auctions/search${queryString}`);

  // 추후 API 연동 시 아래 주석 해제
  // const response = await fetch(`/api/auctions/search${queryString}`);
  // if (!response.ok) {
  //   throw new Error("Failed to fetch products");
  // }
  // return response.json();

  return [
    {
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
    },
    {
      auctionId: 2,
      title: "상품 2",
      description: "설명 2",
      sellerEmailMasked: "example2@*****.com",
      status: "completed",
      itemCondition: "gently_used",
      basePrice: 15000,
      isScrap: true,
      scrapCount: 12,
      isSeller: false,
      category: {
        id: 2,
        mainCategory: "가전",
        subCategory: "주방가전",
        detailCategory: "믹서기",
      },
      startTime: "2024-01-05",
      endTime: "2024-01-15",
      mainImage: {
        originalName: "sample.jpg",
        storeName: "sample_2.jpg",
        url: "https://via.placeholder.com/150",
        imageSeq: 2,
      },
      images: [],
    },
    {
      auctionId: 3,
      title: "상품 3",
      description: "설명 3",
      sellerEmailMasked: "example3@*****.com",
      status: "yet",
      itemCondition: "brand_new",
      basePrice: 25000,
      isScrap: false,
      scrapCount: 7,
      isSeller: false,
      category: {
        id: 3,
        mainCategory: "생활용품",
        subCategory: "욕실용품",
        detailCategory: "샤워기",
      },
      startTime: "2024-01-10",
      endTime: "2024-01-20",
      mainImage: {
        originalName: "sample.jpg",
        storeName: "sample_3.jpg",
        url: "https://via.placeholder.com/150",
        imageSeq: 3,
      },
      images: [],
    }
  ];
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const products = await getSearchProducts(searchParams);

  return (
    <div className="grid mt-4 gap-4">
      <div className="flex justify-center gap-10 items-center">
        <div className="font-bold text-xl">경매에 참여하고 싶은 물건을 검색해보세요</div>
        <SearchInput />
      </div>

      <ProductRelated relatedWords={["카메라", "아이폰", "에어팟"]} />

      <div className="bg-graybg h-auto p-4 flex gap-4">
        {/* 필터 영역 */}
        <div className="bg-white rounded-[12px] py-2 w-1/5">
          <div className="flex justify-between items-center px-4 py-2">
            <div className="font-bold text-xl">검색 필터</div>
            <FilterRefreshButton />
          </div>
          <CategoryFilter />
          <PriceFilter />
          <AuctionStatusFilter />
          <ProductStatusFilter />
        </div>

        {/* 검색 결과 목록 */}
        <div className="w-4/5">
          <ProductSort />
          <div className="grid grid-cols-4 gap-4 mt-4">
            {products.map((product) => (
              <AuctionCard key={product.auctionId} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
