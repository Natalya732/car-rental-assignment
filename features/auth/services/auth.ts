"use client";

import axios from "axios";
import { toast } from "sonner";

import { AuthResponse, LoginRequest, SignupRequest } from "../types";

export const loginUser = async (
  payload: Omit<LoginRequest, "action">,
): Promise<AuthResponse> => {
  const res = await axios.post("/api/auth", {
    ...payload,
    action: "login",
  });
  toast.success("Login successful");
  return res.data;
};

export const signupUser = async (
  payload: Omit<SignupRequest, "action">,
): Promise<AuthResponse> => {
  const res = await axios.post("/api/auth", {
    ...payload,
    action: "signup",
  });
  toast.success("Account created successfully");
  return res.data;
};
