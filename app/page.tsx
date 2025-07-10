"use client";

import { Loader2 } from "lucide-react";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { APP_ROUTES } from "@/shared/constants/routes";

import { useAuth } from "@/features/auth/context/AuthContext";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push(APP_ROUTES.DASHBOARD);
      } else {
        router.push(APP_ROUTES.AUTH);
      }
    }
  }, [user, isLoading, router]);

  // Show loading while determining redirect
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin h-9 w-9 text-primary" />
    </div>
  );
}
