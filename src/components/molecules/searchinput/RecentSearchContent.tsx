import RecentSearchWordButton from "@/components/atoms/RecentSearchWordButton";
import RecommendSearchWord from "@/components/atoms/RecommendSearchWordButton";
import { SearchHistory } from "@/types/response.types";
import React from "react";
interface RecentSearchContentProps {
  handleDeleteAllSearches: () => void;
  recentSearches : SearchHistory[]
  handleDeleteSearch: (id: number) => void;
  recommendedSearches: string[]
  handleCloseSearchContent: () => void;
  handleClickRecentWord : (event: React.MouseEvent, searchKeyword: string) => void;
}
export default function RecentSearchContent({ handleDeleteAllSearches, handleClickRecentWord, recentSearches, handleDeleteSearch, recommendedSearches, handleCloseSearchContent } : RecentSearchContentProps) {
  return (
    <div className="absolute z-10 rounded-b-[12px] w-full -ml-[1.5px] bg-white grid gap-4 border-l-[1.5px] border-r-[1.5px] border-b-[1.5px] border-main" style={{ width: 'calc(100% + 3px)' }}>
      <div className="border-t border-t-[#E5E9EC]">
        <div className="pr-4 pl-4 pt-4 pb-2 text-[#373737] flex text-sm items-center justify-between">
          <div>최근 검색어</div>
          <button type="button" onClick={handleDeleteAllSearches} className="text-[#898989]">전체 삭제</button>
        </div>
        {recentSearches.length > 0 ? (
          recentSearches.map((search, index) => (
            <RecentSearchWordButton 
              key={index} 
              id={search.id}
              searchKeyword={search.keyword} 
              createdAt={search.createdAt} 
              handleDeleteSearch={handleDeleteSearch}
              handleClickRecentWord={handleClickRecentWord}
            />
          ))
        ) : (
          <div className="p-4 text-center text-[#898989]">최근 검색어가 없습니다</div>
        )}
      </div>
      <div className="grid gap-2">
        <div className="pl-4 pr-4 text-[#373737] flex text-sm items-center justify-between">
          추천 검색어
        </div>
        <div className="pl-4 pr-4 pt-1 pb-2 flex gap-2 flex-wrap">
          {recommendedSearches.map((search, index) => (
            <RecommendSearchWord searchWord={search} key={index}/>
          ))}
        </div>
      </div>
      <div className="pl-4 pr-4 pt-2 pb-2 border-t-[1px] border-[#EFF2F4] flex justify-end">
        <button type="button" onClick={handleCloseSearchContent} className="text-[#898989]">
          닫기
        </button>
      </div>
    </div>
  )
}