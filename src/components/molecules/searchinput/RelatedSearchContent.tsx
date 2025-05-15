import RelatedSearchWordButton from "@/components/atoms/RelatedSearchWordButton";
import React from "react";

interface RelatedSearchContentProps {
  relatedWords: string[];
  handleAddSearch: (event: React.MouseEvent, searchKeyword: string) => void;
  handleClickRelatedWord: (event: React.MouseEvent, searchKeyword: string) => void;
}

export default function RelatedSearchContent({ relatedWords, handleClickRelatedWord, handleAddSearch } : RelatedSearchContentProps) {
  return (
    <div className="absolute z-10 rounded-b-[12px] w-full -ml-[1.5px] bg-white grid gap-4 border-l-[1.5px] border-r-[1.5px] border-b-[1.5px] border-main" style={{ width: 'calc(100% + 3px)' }}>
      <div className="border-t border-t-[#E5E9EC]">
        {relatedWords.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-2">연관 검색어가 없습니다.</div>
        ) : (
          relatedWords.map((word, index) => (
            <RelatedSearchWordButton 
              key={index}
              isLast={index === relatedWords.length - 1}
              searchKeyword={word}
              handleAddSearch={handleAddSearch}
              handleClickRelatedWord={handleClickRelatedWord}
            />
          ))
        )}
      </div>
    </div>
  )
}