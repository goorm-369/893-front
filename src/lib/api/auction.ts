// api/auction.ts 또는 컴포넌트 파일 상단에 작성
import axios from "axios";
import { AuctionBidData, Product, BidPostResponse } from "@/types/productData";
import { axiosInstance } from "../axios";
import { Auction, BaseResponse } from "@/types/response.types";

export async function getBidData(auctionId: number): Promise<AuctionBidData | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/${auctionId}/bids`,{
      method: "GET",
    });
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error("입찰 내역 불러오기 실패:", error);
    return null;
  }
}

export const getProductData = async (auctionId: number, cookieHeader: string): Promise<Product | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/${auctionId}`,{
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      next: {
        revalidate: 86400,
      },
    });
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error('상품 데이터를 불러오는 중 오류 발생:', error);
    return null;
  }
};

export const postBid = async ({
  itemId,
  bidPrice,
}: {
  itemId: number;
  bidPrice: number;
}) : Promise<BaseResponse<BidPostResponse>> => {
  try {
    const response = await axiosInstance.post(`/api/auctions/${itemId}/bids`,{
      price: bidPrice,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected Error:', error);
    }
    throw new Error('입찰 요청 실패');
  }
};

export const cancelBid = async ({
  auctionId,
  bidId,
}: {
  auctionId: number;
  bidId: number;
}) => {
  try {
    const response = await axiosInstance.patch(`/api/auctions/${auctionId}/bids/${bidId}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected Error:', error);
    }
    throw new Error('입찰 취소 실패');
  }
};


export const getRelatedItem = async (auctionId:number) : Promise<BaseResponse<Auction[]>> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/${auctionId}/related`,{
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch related item:', error);
    throw error;
  }
};

export const addScrap = async (auctionId:number) => {
  try {
    const response = await axiosInstance.post(`/api/auctions/${auctionId}/scrap`);
    return response.data;
  } catch (error) {
    console.error("스크랩 성공 실패: ", error);
    throw error;
  }
};

export const removeScrap = async (auctionId:number) => {
  try {
    const response = await axiosInstance.delete(`/api/auctions/${auctionId}/scrap`);
    return response.data;
  } catch (error) {
    console.error("스크랩 취소 실패: ", error);
    throw error;
  }
};

export const deleteAuction = async ( auctionId: number ) => {
  try {
    const response = await axiosInstance.delete(`/api/auctions/${auctionId}`);
    return response.data;
  } catch(error) {
    console.error("삭제 실패: ", error);
    throw error;
  }
}