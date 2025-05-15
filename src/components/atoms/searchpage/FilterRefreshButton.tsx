"use client"

import { RefreshCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterRefreshButton() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const handleRefresh = () => {
    const keyword = searchParams.get('keyword')
    const newUrl = keyword ? `/search?keyword=${keyword}` : '/search'
    router.replace(newUrl)
  }

  return (
    <button className="flex items-center gap-2 text-sm text-gray-500" onClick={handleRefresh}>
      초기화
      <RefreshCcw size={20}/>
    </button>
  )
}