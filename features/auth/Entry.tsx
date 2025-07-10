"use client";

import { Car, Lock, UserPlus } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { APP_ROUTES } from "@/shared/constants/routes";

import { useAuth } from "@/features/auth/context/AuthContext";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, signup, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(APP_ROUTES.DASHBOARD);
    }
  }, [user, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      try {
        if (isLogin) {
          const { success: loginSuccess, error: loginError } = await login(
            email,
            password,
          );
          if (!loginSuccess) {
            setError(
              loginError ||
                "Invalid credentials. Please check your email and password.",
            );
          }

          if (loginSuccess) router.push(APP_ROUTES.DASHBOARD);
        } else {
          const { success: signupSuccess, error: signupError } = await signup(
            name,
            email,
            password,
          );
          if (!signupSuccess) {
            setError(
              signupError ||
                "Signup failed. Please check your information and try again.",
            );
          }

          if (signupSuccess) router.push(APP_ROUTES.DASHBOARD);
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [isLogin, name, email, password, login, signup, router],
  );

  const toggleMode = useCallback(() => {
    setIsLogin(!isLogin);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  }, [isLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Car Rental Admin</CardTitle>
          <CardDescription>
            {isLogin
              ? "Sign in to access the admin dashboard"
              : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@carrental.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isLogin ? (
                    <>
                      <Lock className="h-4 w-4" />
                      Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Sign Up
                    </>
                  )}
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              type="button"
              variant="link"
              onClick={toggleMode}
              className="text-sm text-primary hover:text-primary/80 cursor-pointer"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>

          {isLogin && (
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Demo Credentials:</p>
              <p className="font-mono text-xs mt-1">
                Email: admin@carrental.com
                <br />
                Password: admin123
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
