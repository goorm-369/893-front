import axios from "axios";
import { BaseResponse, SearchHistory } from "@/types/response.types";
const axiosSearchboxInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getUserSearchHistory() : Promise<BaseResponse<SearchHistory[]>> {
  try {
    const response = await axiosSearchboxInstance.get('/api/search');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user search history:', error);
    throw error;
  }
}

export async function getRelatedWords(keyword: string) : Promise<BaseResponse<string[]>>{
  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const response = await axiosSearchboxInstance.get(`/api/search/suggestions?keyword=${encodedKeyword}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching related words:', error);
    throw error;
  }
}

export async function postSearchHistory(keyword: string) {
  try {
    const response = await axiosSearchboxInstance.post('/api/search', { keyword : keyword });
    return response.data;
  } catch (error) {
    console.error('Error posting search history:', error);
    throw error;
  }
}

export async function deleteSearchHistory(id: number) {
  try {
    const response = await axiosSearchboxInstance.delete(`/api/search/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting search history:', error);
    throw error;
  }
}