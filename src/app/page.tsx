import HomeTitle from "@/components/molecules/HomeTitle";
import SpinningWord from "@/components/atoms/SpinningWord";
import SearchInput from "@/components/templates/SearchBox";
import { Metadata } from "next";
import QueryProvider from "@/components/QueryProvider";
import { cookies } from "next/headers";
import RecentAuctionList from "@/components/home/RecentAuctionList";
import ImageCarousel, { Slide } from "@/components/home/ImageCarousel";
import DashboardStats from "@/components/home/DashboardStats.tsx";
import RealTimeRankingItem from "@/components/home/RealTimeRankingItem";
import TopBidCardList from "@/components/home/TopBidCardList";
import BestByCategory from "@/components/home/BestItemByCategory";
import AuctionSoonItemList from "@/components/home/AuctionSoonItemList";
import {
  getRecentAuctions,
  getDashboardStats,
  getAuctionSoonItems,
  getTopBidItems,
  getRealTimeRankingActive,
  getRealTimeRankingPending,
  getBestByCategory,
} from "@/lib/api/home";
export const metadata: Metadata = {
  title: "중고 경매 플랫폼 팔구삼 893",
  description: "중고 상품을 경매로 사고 팔 수 있는 팔구삼 893",
};

const slides: Slide[] = [
  {
    imageUrl: "/images/adidas.jpg",
    label: "덕질은\n삶의 에너지니까",
  },
  {
    imageUrl: "/images/nike.jpg",
    label: "좋아하는 것을\n좋아할 용기",
  },
  {
    imageUrl: "/images/맥.jpg",
    label: "기술은 바뀌어도\n감성은 남는다",
  },
  {
    imageUrl: "/images/자전거.jpg",
    label: "작은 변화,\n큰 가능성",
  },
  {
    imageUrl: "/images/라이젠.jpg",
    label: "기계가 아니라\n경험을 산다",
  },
  {
    imageUrl: "/images/아이폰.jpg",
    label: "음악은\n기억을 불러온다",
  },
];

export default async function Home() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const isLoggedIn = accessToken ? true : false;

  const [
    recentAuctionListData,
    dashboardStatsData,
    auctionSoonItemListData,
    topBidCardListData,
    realTimeRankingItemActiveData,
    realTimeRankingItemPendingData,
    bestByCategoryData,
  ] = await Promise.all([
    getRecentAuctions(),
    getDashboardStats(),
    getAuctionSoonItems(),
    getTopBidItems(),
    getRealTimeRankingActive(),
    getRealTimeRankingPending(),
    getBestByCategory(),
  ]);
  const recentAuctionList = recentAuctionListData.data;
  const dashboardStats = dashboardStatsData.data;
  const auctionSoonItemList = auctionSoonItemListData.data;
  const topBidCardList = topBidCardListData.data;
  const realTimeRankingItemActive = realTimeRankingItemActiveData.data;
  const realTimeRankingItemPending = realTimeRankingItemPendingData.data;
  const bestByCategory = bestByCategoryData.data;

  return (
    <>
      <div className="w-[1280px] mt-6 px-4 mx-auto">
        {/* 1. 메인 타이틀 */}
        <HomeTitle data-testid="home-title">
          <SpinningWord data-testid="spinning-word" />
          <span>&nbsp;경매에 참여해보세요</span>
        </HomeTitle>

        <div className="flex justify-center w-full mt-4">
          <QueryProvider>
            {/* 2. 검색창 */}
            <SearchInput isLoggedIn={isLoggedIn} data-testid="search-input" />
          </QueryProvider>
        </div>

        <div className="flex items-start gap-6 w-full max-w-screen-xl  px-4 mt-6">
          {/* 좌측 */}
          <div className="flex-1 max-w-[780px]">
            {/* 3. 대시보드 통계 */}
            <div data-testid="dashboard-stats">
              <DashboardStats dashboardStats={dashboardStats} />
            </div>
            {/* 4. 이미지 캐러셀 */}
            <div className="mt-10" data-testid="image-carousel">
              <ImageCarousel slides={slides} />
            </div>
            {/* 5. 최근 입찰 리스트 */}
            <div className="mt-10" data-testid="recent-auction-list">
              <RecentAuctionList recentAuctionList={recentAuctionList} />
            </div>
          </div>

          {/* 6. 실시간 랭킹 (우측) */}
          <div className="w-[300px] shrink-0" data-testid="real-time-ranking">
            <RealTimeRankingItem
              realTimeRankingItemActive={realTimeRankingItemActive}
              realTimeRankingItemPending={realTimeRankingItemPending}
            />
          </div>
        </div>
        {/* 7. 경매 임박 물품 */}
        <section className="pt-20" data-testid="auction-soon-list">
          <h2 className="text-2xl font-bold mb-10">경매 임박 물품</h2>
          <AuctionSoonItemList auctionSoonItemList={auctionSoonItemList} />
        </section>

        {/* 8. 최근 7일 최고 낙찰가 TOP 5 */}
        <section className="pt-20" data-testid="top-bid-card-list">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-start">
            최근 7일 최고 낙찰가 TOP 5
          </h2>
          <TopBidCardList topBidCardList={topBidCardList} />
        </section>

        {/* 9. 카테고리별 베스트 TOP3 */}
        <div className="pt-20 pb-32" data-testid="best-by-category">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-start">
            카테고리별 베스트 TOP 50
          </h2>
          <div className="flex gap-4">
            <BestByCategory bestByCategory={bestByCategory} />
          </div>
        </div>
      </div>
    </>
  );
}
