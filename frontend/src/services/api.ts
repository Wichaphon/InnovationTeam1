import axios from "axios";


export const API_URL = import.meta.env.API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(undefined, async (error) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      await api.post('/auth/refresh');
      return api(originalRequest);
    } catch {
      // logout หรือ redirect
    }
  }

  return Promise.reject(error);
});

