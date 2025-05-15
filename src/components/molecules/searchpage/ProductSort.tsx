"use client"

import SortButton from "@/components/atoms/searchpage/SortButton";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function ProductSort() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sortBy')

  const handleSortChange = useCallback((sort: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (sort) {
      params.set('sortBy', sort)
    } else {
      params.delete('sortBy')
    }

    router.replace(`/search?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  return (
    <div className="bg-white rounded-[12px] py-2"> 
      <div className="font-semibold text-md border-b-[1px] border-divider px-4 py-2 h-10 flex items-center">
        정렬 기준 선택
      </div>
      <div className="px-4 py-2 flex items-center gap-4 h-10">
        <SortButton label="최신순" selected={currentSort === 'latest' || !currentSort} onClick={() => handleSortChange('latest')} />
        <div className="w-1 h-1 bg-neutral-400/60" />
        <SortButton label="낮은 시작 가격순" selected={currentSort === 'price_asc'} onClick={() => handleSortChange('price_asc')} />
        <div className="w-1 h-1 bg-neutral-400/60" />
        <SortButton label="높은 시작 가격순" selected={currentSort === 'price_desc'} onClick={() => handleSortChange('price_desc')} />
        <div className="w-1 h-1 bg-neutral-400/60" />
        <SortButton label="입찰자순" selected={currentSort === 'bidder_count_desc'} onClick={() => handleSortChange('bidder_count_desc')} />
        <div className="w-1 h-1 bg-neutral-400/60" />
        <SortButton label="찜순" selected={currentSort === 'scrap_count_desc'} onClick={() => handleSortChange('scrap_count_desc')} />
      </div>
    </div>
  )
}