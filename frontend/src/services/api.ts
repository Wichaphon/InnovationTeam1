import axios from "axios";

export const API_URL = import.meta.env.API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const at = sessionStorage.getItem("access_token");
  if (at) config.headers.Authorization = `Bearer ${at}`;
  return config;
});
