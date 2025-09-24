import { api } from "@/services/api"
import axios from "axios";

// TO DO implement error handler in each api call
export const login_local = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return await res.data;
}

export const logout = async () => {
  await api.post("/auth/logout");
}

export const auth_google = async () => {
  try {
    await api.get("auth/google");
  } catch (error) {
    console.error(error);
  }
}

export const register = async (user: any) => {
  try {
    await api.post("auth/register", user)
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

export const refreshToken = async () => {
  await api.post("auth/refresh");
}