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

export default function CategorySub() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategoryMain = searchParams.get('mainCategoryId')
  const currentCategory = searchParams.get('subCategoryId') || ""
  
  // 카테고리 값 변경 시 URL 업데이트
  const handleCategoryChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set('subCategoryId', value)
      params.delete('detailCategoryId')
    }
    
    router.replace(`/search?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  return (
    <div>
      <div className="text-sm text-gray-500">중분류</div>
      <Select value={currentCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-auto">
          <SelectValue placeholder="중분류 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {currentCategoryMain === "1" && (
              <>
                <SelectItem value="2">모바일/태블릿</SelectItem>
              </>
            )}
            {currentCategoryMain === "4" && (
              <>
                <SelectItem value="5">사무용가구</SelectItem>
              </>
            )}
            {currentCategoryMain === "6" && (
              <>
                <SelectItem value="7">여성의류</SelectItem>
              </>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}