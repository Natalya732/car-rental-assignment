import axios from "axios";

import {
  DashboardStats,
  FetchCarListingsResponse,
  FetchListingStatusResponse,
} from "../types";

export const fetchCarListings = async ({
  page = 1,
  limit = 20,
  searchObj = { name: "", status: "" },
}: {
  page?: number;
  limit?: number;
  searchObj?: { name: string; status: string };
}): Promise<FetchCarListingsResponse> => {
  let path = `${process.env.NEXT_PUBLIC_APP_URL}/api/cars?page=${page}&limit=${limit}`;

  if (searchObj) {
    const { name, status } = searchObj;
    if (name) path += `&name=${name}`;
    if (status) path += `&status=${status}`;
  }

  const res = await axios.get(path);
  const data = res.data as FetchCarListingsResponse;
  return data;
};

export const fetchListingStatus = async (): Promise<{
  data: DashboardStats;
  success: boolean;
}> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/stats`);

  const data = res.data as FetchListingStatusResponse;
  return data;
};
