import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export default function CategoryDetail() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('detailCategoryId') || ""
  const currentCategorySub = searchParams.get('subCategoryId') || ""

  // 카테고리 값 변경 시 URL 업데이트
  const handleCategoryChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set('detailCategoryId', value)
    } else {
      params.delete('detailCategoryId')
    }
    
    router.replace(`/search?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  return (
    <div>
      <div className="text-sm text-gray-500">소분류</div>
      <Select value={currentCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-auto">
          <SelectValue placeholder="소분류 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {currentCategorySub === "2" && (
              <>
                <SelectItem value="3">스마트폰</SelectItem>
              </>
            )}
            {currentCategorySub === "5" && (
              <>
                <SelectItem value="chair">의자</SelectItem>
              </>
            )}
            {currentCategorySub === "7" && (
              <>
                <SelectItem value="8">아우터</SelectItem>
              </>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}