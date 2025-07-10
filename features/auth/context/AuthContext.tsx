"use client";

import { Loader2 } from "lucide-react";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { usePathname, useRouter } from "next/navigation";

import { APP_ROUTES, PRIVATE_ROUTES } from "@/shared/constants/routes";
import { PUBLIC_ROUTES } from "@/shared/constants/routes";

import { loginUser, signupUser } from "../services/auth";
import { AuthContextType, User } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const handleUserCompute = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("admin-user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      if (parsedUser) setUser(parsedUser);

      if (PUBLIC_ROUTES.includes(pathname)) return;

      if (!parsedUser && PRIVATE_ROUTES.includes(pathname)) {
        router.push(APP_ROUTES.AUTH); // navigate if not user and on private route
      }
    } catch (error) {
      console.error("Error parsing user from local storage", error);
    }
  }, [router, pathname]);

  useEffect(() => {
    handleUserCompute();
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{
      success: boolean;
      error?: string;
    }> => {
      try {
        const data = await loginUser({ email, password });
        setUser(data.user);
        localStorage.setItem("admin-user", JSON.stringify(data.user));
        localStorage.setItem("auth-token", data.authToken);
        return { success: true };
      } catch (error: any) {
        console.error("Login error:", error?.response?.data?.error);
        return { success: false, error: error?.response?.data?.error };
      }
    },
    [],
  );

  const signup = useCallback(
    async (
      name: string,
      email: string,
      password: string,
    ): Promise<{
      success: boolean;
      error?: string;
    }> => {
      try {
        const data = await signupUser({ name, email, password });
        setUser(data.user);
        localStorage.setItem("admin-user", JSON.stringify(data.user));
        localStorage.setItem("auth-token", data.authToken);
        return { success: true };
      } catch (error: any) {
        console.error("Signup error:", error?.response?.data?.error);
        return { success: false, error: error?.response?.data?.error };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("admin-user");
    localStorage.removeItem("auth-token");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin h-9 w-9 text-primary" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
