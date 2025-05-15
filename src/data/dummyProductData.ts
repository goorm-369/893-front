// dummyProduct.ts
import { Product } from "@/types/productData";

export const dummyProduct: Product = {
  auctionId: 1,
  title: "샘플 경매 상품",
  description: "이것은 테스트용 더미 상품입니다.",
  sellerEmailMasked: "sell***@example.com",
  status: "pending", 
  itemCondition: "like_new",
  basePrice: 15000,
  isScrap: false,
  scrapCount: 12,
  isSeller: false,
  category: {
    id: 101,
    mainCategory: "전자제품",
    subCategory: "노트북",
    detailCategory: "게이밍 노트북"
  },
  startTime: "2025-05-10T09:00:00Z",
  endTime: "2025-05-20T18:00:00Z",
  mainImage: {
    originalName: "product1.jpg",
    storeName: "prod1_123456.jpg",
    url: "/images/product1.jpg",
    imageSeq: 1
  },
  images: [
    {
      originalName: "product1.jpg",
      storeName: "prod1_123456.jpg",
      url: "/images/product1.jpg",
      imageSeq: 1
    },
    {
      originalName: "product2.jpg",
      storeName: "prod2_654321.jpg",
      url: "/images/product2.jpg",
      imageSeq: 2
    }
  ]
};
