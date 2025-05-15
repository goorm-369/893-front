import { Clock, X } from "lucide-react";
import Link from "next/link";
import React from "react";

interface RecentSearchWordButtonProps {
	searchKeyword: string;
	createdAt: string;
	id: number;
	handleDeleteSearch: (id: number) => void;
	handleClickRecentWord : (event: React.MouseEvent, searchKeyword: string) => void;
}

export default function RecentSearchWordButton({ searchKeyword, createdAt, id, handleDeleteSearch, handleClickRecentWord } : RecentSearchWordButtonProps) {
  return (
    <div onClick={(e) => {handleClickRecentWord(e, searchKeyword)}} className="group hover:bg-[#EFF2F4] h-10 w-full cursor-pointer flex items-center justify-between p-4">
			<div className="flex items-center justify-center gap-2">
				<div className="rounded-3xl bg-[#EFF2F4] h-7 w-7 flex items-center justify-center">
					<Clock size={16} />
				</div>
				<div>
					{searchKeyword}
				</div>
			</div>
			<div className="flex items-center justify-between gap-2">
				<div className="text-[#898989]">
					{new Date(createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
				</div>
				<div 
					className="cursor-pointer"
					onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDeleteSearch(id);
          }}
				>
					<X size={22} color="#898989" className="hover:text-[#6c6c6c]"/>
				</div>
			</div>
  	</div>
  )
}