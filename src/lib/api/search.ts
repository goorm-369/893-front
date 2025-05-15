import { BaseResponse, SearchListResponse } from "@/types/response.types";

export async function getSearchProducts(searchParams: Record<string, string | string[] | undefined>) : Promise<BaseResponse<SearchListResponse>> {
  const urlSearchParams = new URLSearchParams();
  console.log(searchParams);
  // searchParams을 순회하며 URLSearchParams에 추가
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // 배열인 경우 각 항목을 같은 키로 추가
      value.forEach(item => {
        if (item) urlSearchParams.append(key, item);
      });
    } else if (value !== undefined) {
      // 단일 값인 경우 추가
      urlSearchParams.append(key, value);
    }
  });
  
  let queryString = urlSearchParams.toString();

  if (queryString.length > 0) {
    queryString = `?${queryString}`;
  }
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/search${queryString}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

export async function getRelatedWords(searchParams: Record<string, string | string[] | undefined>) : Promise<BaseResponse<string[]>> {
  let keyword = "";

  if (searchParams.keyword) {
    keyword = searchParams.keyword as string;
  } else {
    return {
      data: [],
      message: "검색어가 없습니다.",
      code: 400,
    }
  }
  
  const encodedKeyword = encodeURIComponent(keyword);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search/suggestions?keyword=${encodedKeyword}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error("Failed to fetch related words");
  }
  return response.json();
}