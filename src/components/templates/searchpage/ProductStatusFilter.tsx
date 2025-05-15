"use client"

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import FilterCheckBox from "../../atoms/searchpage/FilterCheckBox";
import FilterFieldSet from "../../molecules/searchpage/FilterFieldSet";
import { useCallback } from "react";

export default function ProductStatusFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productNew = searchParams.get('isBrandNew')
  const productLikeNew = searchParams.get('isLikeNew')
  const productGentlyUsed = searchParams.get('isGentlyUsed')
  const productHeavilyUsed = searchParams.get('isHeavilyUsed')
  const productDamaged = searchParams.get('isDamaged')

  // 체크박스 상태에 따라 URL 업데이트
  const handleProductStatusChange = useCallback((key: string, isChecked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())

    if (isChecked) { // 체크박스가 체크되면 해당 키를 추가
      params.set(key, "true")
    } else { // 체크박스가 해제되면 해당 키를 제거
      params.delete(key)
    }
    
    router.replace(`/search?${params.toString()}`, { scroll: false })
  }, [router, searchParams])
  
  return (
    <div>
      <div className="flex justify-between items-center px-4 py-2">
        <div className="font-bold text-md">
          물품 상태
        </div>
      </div>
      <div className="px-4 py-2 w-full">
        <FilterFieldSet>
            <FilterCheckBox id="isBrandNew" name="isBrandNew" label="새상품" checked={productNew === "true"} onChange={handleProductStatusChange}/>
            <FilterCheckBox id="isLikeNew" name="isLikeNew" label="사용감 없음" checked={productLikeNew === "true"} onChange={handleProductStatusChange}/>
            <FilterCheckBox id="isGentlyUsed" name="isGentlyUsed" label="사용감 적음" checked={productGentlyUsed === "true"} onChange={handleProductStatusChange}/>
            <FilterCheckBox id="isHeavilyUsed" name="isHeavilyUsed" label="사용감 많음" checked={productHeavilyUsed === "true"} onChange={handleProductStatusChange}/>
            <FilterCheckBox id="isDamaged" name="isDamaged" label="고장/파손" checked={productDamaged === "true"} onChange={handleProductStatusChange}/>
        </FilterFieldSet>
      </div>
    </div>
  )
}