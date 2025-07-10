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
  try {
    let path = `${process.env.NEXT_PUBLIC_APP_URL}/api/cars?page=${page}&limit=${limit}`;

    if (searchObj) {
      const { name, status } = searchObj;
      if (name) path += `&name=${name}`;
      if (status) path += `&status=${status}`;
    }

    const res = await axios.get(path);
    const data = res.data as FetchCarListingsResponse;
    return data;
  } catch (err) {
    console.log(err);
    return {
      totalCount: 0,
      data: [],
    };
  }
};

export const fetchListingStatus = async (): Promise<{
  data: DashboardStats;
  success: boolean;
}> => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/stats`);

    const data = res.data as FetchListingStatusResponse;
    return data;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      data: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      },
    };
  }
};