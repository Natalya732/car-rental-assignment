export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

export interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  logout: () => void;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  action: "login";
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  action: "signup";
}

export interface AuthResponse {
  message: string;
  user: User;
  authToken: string;
}
