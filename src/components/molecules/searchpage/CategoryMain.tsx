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

export default function CategoryMain() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('mainCategoryId') || ""
  
  // 카테고리 값 변경 시 URL 업데이트
  const handleCategoryChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set('mainCategoryId', value)
      params.delete('subCategoryId')
      params.delete('detailCategoryId')
    }
    
    router.replace(`/search?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  return (
    <div>
      <div className="text-sm text-gray-500">대분류</div>
      <Select value={currentCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-auto">
          <SelectValue placeholder="대분류 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="1">전자기기</SelectItem>
            <SelectItem value="4">가구/인테리어</SelectItem>
            <SelectItem value="6">패션/의류</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}