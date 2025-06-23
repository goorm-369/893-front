import { AuctionCategory } from "@/types/productData";
import { BaseResponse, SearchListResponse } from "@/types/response.types";

export function makeQueryString(
  searchParams: Record<string, string | string[] | undefined>
): string {
  const urlSearchParams = new URLSearchParams();

  // searchParams을 순회하며 URLSearchParams에 추가
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // 배열인 경우 각 항목을 같은 키로 추가
      const includedItem: Record<string, boolean> = {};
      value.forEach((item) => {
        if (item) {
          if (!includedItem[item]) {
            urlSearchParams.append(key, item);
            includedItem[item] = true;
          }
        }
      });
    } else if (value !== undefined && value !== '' && key !== '') {
      urlSearchParams.append(key, value);
    }
  });

  let queryString = urlSearchParams.toString();

  if (queryString.length > 0) {
    queryString = `?${queryString}`;
  }

  return queryString;
}

export async function getSearchProducts(
  searchParams: Record<string, string | string[] | undefined>, cookieHeader : string
): Promise<BaseResponse<SearchListResponse>> {
  const queryString = makeQueryString(searchParams);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auctions/search${queryString}`,
      {
        cache: "no-store",
        headers: {
          Cookie: cookieHeader,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      data: {
        totalAuctionsCount: 0,
        auctionList: [],
      },
      message: error instanceof Error ? error.message : "Unknown error",
      code: 500,
    };
  }
}

export function makeKeywordQueryString(
  searchParams: Record<string, string | string[] | undefined>,
): string {
  let keyword = "";

  if (searchParams.keyword) {
    keyword = searchParams.keyword as string;
  } else {
    return "";
  }

  let encodedKeyword = encodeURIComponent(keyword);

  if (encodedKeyword.length > 0) {
    encodedKeyword = `?keyword=${encodedKeyword}`;
  }

  return encodedKeyword;
}

export async function getRelatedWords(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<BaseResponse<string[]>> {
  const encodedKeyword = makeKeywordQueryString(searchParams);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/search/suggestions${encodedKeyword}`,
      {
        next : {
          revalidate : 86400,
        }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch related words");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching related words:", error);
    return {
      data: [],
      message: error instanceof Error ? error.message : "Unknown error",
      code: 500,
    };
  }
}

export async function getCategoryList():
Promise<BaseResponse<AuctionCategory[] | null>> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/category`, {
        next : {
          revalidate : 86400,
        }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch category list");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching category list:", error);
    return {
      data: null,
      message: error instanceof Error ? error.message : "Unknown error",
      code: 500,
    };
  }
}
