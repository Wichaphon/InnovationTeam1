// contexts/AuthContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import { api, API_URL } from "@/services/api";
import axios from "axios";
import type { User } from "@/types/type";

type AuthCtx = {
  loading: boolean;
  register: (user:User) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);

  async function register(user:User){
        try {
          const res = axios.post(`${process.env.API_URL}/auth/register`,user,{
              headers: {
                  'Content-Type':'application/json'
              },
          });
          console.log('Register Success Full', (await res).data);
          return (await res).data;
      } 
      catch (error) {
          if (axios.isAxiosError(error)) {
              console.error('Error', error.response?.data?.message ?? error.message);
          }
          else if (error instanceof Error) {
              console.error('Error', error.message);
            } 
          else {
              console.error('Unknown error', error);
          }
      }
  }

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const {success,data} = await res.data;
      const {accessToken} = data;
      if (accessToken) sessionStorage.setItem("access_token", accessToken);
      console.log(`status from backend ${success}`);
      // refresh token อยู่ใน HttpOnly cookie (browser จัดการเอง)
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await api.post("/auth/logout"); // server เคลียร์ refresh cookie
    } finally {
      sessionStorage.removeItem("access_token");
      setLoading(false);
    }
  }

  async function refreshAccessToken() {
    const { data } = await axios.post(
      `${API_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const access = data?.accessToken ?? data?.access_token;
    if (!access) throw new Error("No access token from refresh");
    sessionStorage.setItem("access_token", access);
  }

  return (
    <AuthContext.Provider value={{ loading, register, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
