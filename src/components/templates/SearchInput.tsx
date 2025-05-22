"use client"

import React, {useState, useRef, useEffect} from "react";
import {ChevronDown, ChevronUp, Search, X} from "lucide-react";
import searchData from "@/data/searchData.json";
import { useRouter, useSearchParams } from "next/navigation";
import RecentSearchContent from "../molecules/searchinput/RecentSearchContent";
import RelatedSearchContent from "../molecules/searchinput/RelatedSearchContent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSearchHistory, getRelatedWords, getUserSearchHistory, postSearchHistory } from "@/lib/api/searchbox";
import { SearchHistory } from "@/types/response.types";
type SearchStatus = 'CLOSED' | 'RECENT_RECOMMENDED' | 'RELATED';

export default function SearchInput() {
  const router = useRouter();
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('CLOSED');
  const formRef = useRef<HTMLFormElement>(null);
  const [recommendedSearches] = useState(searchData.recommendedSearches); // TODO 추후 백엔드 연동
  const searchParams = useSearchParams()
  const currentKeyword = searchParams.get('keyword')
  const [inputValue, setInputValue] = useState(currentKeyword || "");
  const [debouncedInputValue, setDebouncedInputValue] = useState(inputValue);
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  const {data : searchHistory} = useQuery({
    queryKey: ['searchHistory'],
    queryFn: () => getUserSearchHistory(),
  })
  
  const {data : relatedWords} = useQuery({
    queryKey: ['relatedWords', debouncedInputValue],
    queryFn: () => getRelatedWords(debouncedInputValue),
    enabled: debouncedInputValue.length > 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSearchHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    },
    onError: (error, id) => {
      console.error('검색 기록 삭제 실패:', error);

      if (localStorage.getItem('searchHistory')) {
        let searchHistory : SearchHistory[] = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        searchHistory = searchHistory.filter(item => item.id !== id);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      }
    }
  })

  const postMutation = useMutation({
    mutationFn: (keyword: string) => postSearchHistory(keyword),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
      console.log('검색 기록 저장 응답:', response);
    },
    onError: (error) => {
      console.error('검색 기록 저장 실패:', error);

      if (localStorage.getItem('searchHistory')) {
        const searchHistory : SearchHistory[] = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        let isIncluded = false;

        for (const item of searchHistory) {
          if (item.keyword === inputValue) {
            isIncluded = true;
            item.createdAt = new Date().toISOString();
            searchHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          }
        }

        if (!isIncluded) {
          searchHistory.push({
            id: searchHistory[searchHistory.length - 1].id + 1,
            keyword: inputValue,
            createdAt: new Date().toISOString()
          });
        }
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      } else {
        localStorage.setItem('searchHistory', JSON.stringify([{
          id: 1,
          keyword: inputValue,
          createdAt: new Date().toISOString()
        }]));
      }
    }
  })
  
  const handleInputClick = () => {
    if (searchStatus === 'CLOSED') {
      setSearchStatus(inputValue.length > 0 ? 'RELATED' : 'RECENT_RECOMMENDED');
    } else {
      setSearchStatus('CLOSED');
    }
  };

  const handleCloseSearchContent = () => {
    setSearchStatus('CLOSED');
  }

  const handleDeleteSearch = (id: number) => {
    deleteMutation.mutate(id);
  }

  const handleDeleteCurrentSearch = () => {
    setInputValue("");
    setSearchStatus('RECENT_RECOMMENDED');
  }

  const handleDeleteAllSearches = () => {
    alert("추후 구현 예정"); // TODO 추후 구현 예정
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setSearchStatus(value.length > 0 ? 'RELATED' : 'RECENT_RECOMMENDED');
  }

  const handleAddSearch = (event: React.MouseEvent, searchKeyword: string) => {
    event.preventDefault();
    event.stopPropagation();
    setInputValue(searchKeyword);
    setSearchStatus('RELATED'); // 검색어 추가 시 관련 검색어 표시
  }

  const handleSearch = (event: React.FormEvent) => {
    postMutation.mutate(inputValue);
    
    event.preventDefault();
    if (inputValue.trim()) {
      router.push(`/search?keyword=${inputValue.trim()}`);
      setSearchStatus('CLOSED');
    }
  }

  const handleClickWordButton = (event: React.MouseEvent, searchKeyword: string) => {
    event.preventDefault();
    if (searchKeyword.trim()) {
      router.push(`/search?keyword=${searchKeyword.trim()}`);
      setSearchStatus('CLOSED');
    }
  }

  const isSearchContentOpen = searchStatus !== 'CLOSED';
  const isRecentSearchContentOpen = searchStatus === 'RECENT_RECOMMENDED';
  const isRelatedSearchContentOpen = searchStatus === 'RELATED';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setSearchStatus('CLOSED');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchParams.get('keyword')) {
      setInputValue(searchParams.get('keyword') || "");
    }
  }, [searchParams]);

  useEffect(() => {
    console.log(searchHistory);
    if (!searchHistory) {
      
    }
  }, [searchHistory]);

  return (
    <form 
      ref={formRef}
      name="search" 
      method="get"
      onSubmit={handleSearch}
      className={`border-main border-[1.5px] w-[692px] h-[59px] relative rounded-[12px] ${isSearchContentOpen ? 'rounded-b-none' : ''}`}
    >
      <div className="flex items-center w-full justify-between p-4">
        <input
          type="text"
          onClick={handleInputClick}
          onChange={handleInputChange}
          value={inputValue}
          placeholder="경매 제목 입력"
          className="w-full"
        />
        <div className="flex items-center gap-2">
          {inputValue.length > 0 && (
            <button type="button" onClick={handleDeleteCurrentSearch} className="rounded-full bg-[#EFF2F4] flex items-center justify-center">
              <X size={16} color="#898989"/>
            </button>
          )}
          <button type="button" onClick={handleInputClick}>
            {isRecentSearchContentOpen || isRelatedSearchContentOpen ? (
              <ChevronUp size={22} />
            ) : (
              <ChevronDown size={22} />
            )}
          </button>
          <div className="h-3 border-gray-300 border-[0.5px]"/>
          <button type="submit">
            <Search size={22} />
          </button>
        </div>
      </div>
      {isRecentSearchContentOpen && (
        <RecentSearchContent
          handleDeleteAllSearches={handleDeleteAllSearches}
          recentSearches={searchHistory?.data || JSON.parse(localStorage.getItem('searchHistory') || '[]')}
          handleDeleteSearch={handleDeleteSearch}
          recommendedSearches={recommendedSearches}
          handleCloseSearchContent={handleCloseSearchContent}
          handleClickRecentWord={handleClickWordButton}
        />
      )}
      {isRelatedSearchContentOpen && (
        <RelatedSearchContent
          relatedWords={relatedWords?.data || []}
          handleAddSearch={handleAddSearch}
          handleClickRelatedWord={handleClickWordButton}
        />
      )}
    </form>
  )
}