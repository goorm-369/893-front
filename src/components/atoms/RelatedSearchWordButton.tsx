import {MoveUpLeft, Search } from "lucide-react";
import React from "react";

interface RelatedSearchWordButtonProps {
  searchKeyword: string;
  isLast : boolean;
  handleAddSearch: (event: React.MouseEvent, searchKeyword: string) => void;
  handleClickRelatedWord: (event: React.MouseEvent, searchKeyword: string) => void;
}

export default function RelatedSearchWordButton({ searchKeyword, isLast, handleClickRelatedWord, handleAddSearch } : RelatedSearchWordButtonProps) {
  return (
  <div
    onClick={(e) => {handleClickRelatedWord(e, searchKeyword)}}
    className={`
    group hover:bg-[#EFF2F4]
    h-10 w-full cursor-pointer
    flex items-center justify-between
    p-4
    ${isLast ? 'rounded-b-[12px]' : ''}
  `}>
    <div className="flex items-center justify-center gap-2">
      <div className="rounded-3xl bg-[#EFF2F4] h-7 w-7 flex items-center justify-center">
        <Search size={16} />
      </div>
      <div>
        {searchKeyword}
      </div>
    </div>
    <div
      className="cursor-pointer"
      onClick={(e) => handleAddSearch(e, searchKeyword)}
    >
      <MoveUpLeft size={22} color="#898989" className="hover:text-[#6c6c6c]"/>
    </div>
  </div>
  )
}