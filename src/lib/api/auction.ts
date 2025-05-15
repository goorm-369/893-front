// api/auction.ts 또는 컴포넌트 파일 상단에 작성
import axios from "axios";
import { AuctionBidData, Product } from "@/types/productData";

export async function getBidData(itemId: number): Promise<AuctionBidData | null> {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/auctions/${itemId}/bids`,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    console.error("입찰 내역 불러오기 실패:", error);
    return null;
  }
}

export const getProductData = async (itemId: number): Promise<Product | null> => {
  try {
    const response = await axios.get(`http://localhost:8080/api/auctions/${itemId}`,
      {withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('❌ 상품 데이터를 불러오는 중 오류 발생:', error);
    return null;
  }
};

export const postBid = async ({
  itemId,
  bidPrice,
}: {
  itemId: number;
  bidPrice: number;
}) => {
  try {
    const response = await axios.post(`http://localhost:8080/api/auctions/${itemId}/bids`,{
      price: bidPrice,
    },{withCredentials:true,});

    return response.data;
  } catch (error: any) {
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
    const response = await axios.patch(
      `http://localhost:8080/api/auctions/${auctionId}/bids/${bidId}`,
      {},
      { withCredentials: true, }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected Error:', error);
    }
    throw new Error('입찰 취소 실패');
  }
};
