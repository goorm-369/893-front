"use client"

import { useRouter, useSearchParams } from "next/navigation";
import FilterFieldSet from "../../molecules/searchpage/FilterFieldSet";
import FilterCheckBox from "../../atoms/searchpage/FilterCheckBox";
import { useCallback } from "react";

export default function AuctionStatusFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const auctionActive = searchParams.get('isActive')
  const auctionPending = searchParams.get('isPending')
  const auctionCompleted = searchParams.get('isCompleted')


  // 체크박스 상태에 따라 URL 업데이트
  const handleAuctionStatusChange = useCallback((key : string, isChecked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())

    if (isChecked) { // 체크박스가 체크되면 해당 키를 추가
      params.set(key, "true")
    } else { // 체크박스가 해제되면 해당 키를 제거
      params.delete(key)
    }
    
    router.replace(`/search?${params.toString()}`, { scroll: false })
  }, [router, searchParams])
  
  return (
    <div className="border-b-[1px] border-divider">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="font-bold text-md">
          경매 진행 여부
        </div>
      </div>
      <div className="px-4 py-2"> 
        <FilterFieldSet>
          <FilterCheckBox id="isActive" name="isActive" label="시작 전" checked={auctionActive === "true"} onChange={handleAuctionStatusChange}  />
          <FilterCheckBox id="isPending" name="isPending" label="진행중" checked={auctionPending === "true"} onChange={handleAuctionStatusChange}/>
          <FilterCheckBox id="isCompleted" name="isCompleted" label="경매 완료" checked={auctionCompleted === "true"} onChange={handleAuctionStatusChange}/>
        </FilterFieldSet>
      </div>
    </div>
  )
}