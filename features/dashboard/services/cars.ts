"use client";

import axios from "axios";
import { toast } from "sonner";

import { CarListing } from "../types";

export const updateListingDetails = async (
  payload: Partial<CarListing>,
): Promise<{
  message: string;
  data: CarListing;
}> => {
  const res = await axios.put("/api/cars", payload);
  toast.success("Status updated successfully");
  return res.data;
};
