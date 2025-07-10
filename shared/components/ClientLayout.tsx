"use client";

import React from "react";

import { AuthProvider } from "@/features/auth/context/AuthContext";

import ReactQueryProvider from "../contexts/ReactQueryProvider";

function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </AuthProvider>
  );
}

export default ClientLayout;
