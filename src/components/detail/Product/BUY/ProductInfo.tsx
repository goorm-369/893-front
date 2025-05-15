// ProductInfo.tsx
import { useEffect, useState } from 'react';
import { Product, AuctionBidData, Bid } from '@/types/productData';
import { AuctionState } from '../../AuctionState';
import BidInteraction from '../../Bid/BidInteraction';
import ProductHeader from './ProductHeader';
import { cancelBid, postBid } from '@/lib/api/auction';

interface ProductInfoProps {
  product: Product;
  auctionBidData: AuctionBidData;
  updateBidData: (newBid: Bid) => void;
  removeBidData: (bidId: number) => void; // 입찰 내역 업데이트 함수 추가
}

export default function ProductInfo({ product, auctionBidData, updateBidData, removeBidData}: ProductInfoProps) {
  const [currentPrice, setCurrentPrice] = useState<number>(product.basePrice);
  const [lastBidPrice, setLastBidPrice] = useState<number>(currentPrice);
  const [isHighestBidder, setIsHighestBidder] = useState<boolean>(false);
  const [myBidId,setMyBidId] = useState<number>(0);
  const [,setMyBidEmail] = useState<string>();
  const [cancelTimer, setCancelTimer] = useState<number>(0);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(product.isScrap);
  const [bookmarkCount, setBookmarkCount] = useState<number>(1);

  useEffect(() => {
    if (auctionBidData.bids.length > 0) {
      const highestBid = auctionBidData.bids.reduce((max, bid) => {
        return bid.bidPrice > max ? bid.bidPrice : max;
      }, 0);
      setCurrentPrice(Math.max(highestBid, product.basePrice));
      setLastBidPrice(Math.max(highestBid, product.basePrice)); // 마지막 입찰 가격도 업데이트
    } else {
      setCurrentPrice(product.basePrice); // 입찰이 없다면 기본 가격으로 설정
      setLastBidPrice(product.basePrice);
    }
  }, [auctionBidData, product.basePrice]);

  // 타이머 감소
  useEffect(() => {
    if (cancelTimer > 0) {
      const timer = setInterval(() => {
        setCancelTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsHighestBidder(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cancelTimer]);

  // ✅ 입찰하기 눌렀을 때 호출
  const handleBid = async (amount: number) => {
    if (amount <= currentPrice) return;

    try {
      // 서버에 입찰 요청 보내기
      const response = await postBid({
        itemId: product.auctionId,  // 현재 상품의 ID를 itemId로 전달
        bidPrice: amount,    // 입찰 금액
      });

      // 입찰 성공 시 상태 업데이트
      if (response) {
        const newBid: Bid = {
          bidId: response.data.bidId, // 서버 응답에 따라 조정
          bidderEmail: response.data.bidderEmail, // 응답 값 기반
          bidPrice: response.data.bidPrice,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };
        setMyBidId(response.data.bidId);
        setMyBidEmail(response.data.bidderEmail);
        setLastBidPrice(currentPrice);  // 이전 입찰 가격을 저장
        setCurrentPrice(amount);  // 현재가 업데이트
        setIsHighestBidder(true);  // 최고 입찰자 상태 설정
        setCancelTimer(300);  // 타이머 5분 설정
        updateBidData(newBid); // 입찰 내역 업데이트
      }
    } catch (error) {
      alert('입찰에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleCancelBid = async () => {
    
    try {
      // API 호출하여 입찰 취소
      
      const response = await cancelBid({
        auctionId: product.auctionId,   // 경매 아이디 전달
        bidId: myBidId, // 입찰 아이디 전달
      });

      // API 호출이 성공하면 상태 업데이트
      if (response) {
        setIsHighestBidder(false); // 최고 입찰자 상태 변경
        setCurrentPrice(lastBidPrice); // 가격 복구
        setCancelTimer(0); // 타이머 초기화
        removeBidData(myBidId);
      }
    } catch (error) {
      alert('입찰 취소에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="pt-5 ">
      <div className="mx-auto max-w-[620px] mb-4">
        <ProductHeader
          title={product.title}
          sellerEmail={product.sellerEmailMasked}
          mainCategory={product.category.mainCategory}
          subCategory={product.category.subCategory}
          lastCategory={product.category.detailCategory}
        />
      </div>
      <div className="mx-auto max-w-[620px] border border-blue-400 rounded-lg p-4">
        <div className="mb-4">
          <AuctionState
            product={product}
            auctionBidData={auctionBidData}
            isBookmarked={isBookmarked}
            bookmarkCount={bookmarkCount}
            onBookmarkToggle={() => {
              setIsBookmarked((prev) => !prev);
              setBookmarkCount((prev) => (isBookmarked ? prev - 1 : prev + 1));
            }}
          />
        </div>
        <hr className="border-gray-300 my-4" />
        <div className="mt-4">
          <BidInteraction
            currentPrice={currentPrice}  // currentPrice 상태가 제대로 전달되었는지 확인
            onBid={handleBid}
            onCancelBid={handleCancelBid}
            isHighestBidder={isHighestBidder}
            cancelTimer={cancelTimer}
          />
        </div>
      </div>
    </div>
  );
}
