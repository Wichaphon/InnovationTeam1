// contexts/AuthContext.tsx
import { createContext, use, useContext, useState, type ReactNode } from "react";
import { api, API_URL } from "@/services/api";
import axios from "axios";
import type { UserCreateInput, UserEntity } from "@/types/type";
import { AuthService } from "@/services/auth.services";
import { useUser } from "@/features/user/hooks/useUser";
import type { UserAuthData } from "@/components/RegisterForm";
import { useNavigate } from "react-router-dom";

type AuthCtx = {
  loading: boolean;
  user?: UserEntity | null;
  register: (user: UserAuthData) => void;
  login: (userinput: UserAuthData) => Promise<void>;
  googleAuth: () => void
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  async function register(user: UserAuthData) {
    setLoading(true);
    try {
      await AuthService.register(user);
    }
    finally {
      setLoading(false);
    }
  }

  async function login(userinput:UserAuthData) {
    setLoading(true);
    try {
      const sucess = await AuthService.loginLocal(userinput.email, userinput.password) as boolean;
      if (sucess) nav('/account')
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await AuthService.logout();
    } finally {
      setLoading(false);
    }
  }

  function googleAuth() {
    window.location.href = `${API_URL}/auth/google`;
  }

  async function refreshAccessToken() {
    setLoading(true);
    try {
      await AuthService.refreshToken();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ loading, register, login, googleAuth, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
