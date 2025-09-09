export const API_BASE = 'http://localhost:3000';

// Type definitions
export interface User {
  id: string;
  email: string;
  fname: string;
  lname: string;
  role: {
    id: string;
    name: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthResponse {}

export interface RefreshResponse extends AuthResponse {}

export interface MeResponse {
  user: User;
}

// Token management functions
export function getToken(): string {
  return localStorage.getItem('token') || '';
}

export function setToken(token: string): void {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

export function getRefreshToken(): string {
  return localStorage.getItem('refreshToken') || '';
}

export function setRefreshToken(token: string): void {
  if (token) localStorage.setItem('refreshToken', token);
  else localStorage.removeItem('refreshToken');
}

// API functions
export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Login failed');
  return data;
}

export async function registerRequest(
  email: string,
  password: string,
  fname: string,
  lname: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fname, lname }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Registration failed');
  return data as AuthResponse;
}

export async function fetchMe(token: string): Promise<User> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data: MeResponse = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to fetch profile');
  return data.user;
}

export async function refreshTokens(refreshToken: string): Promise<RefreshResponse> {
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Refresh failed');
  return data;
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  } catch (_) {
    // Ignore errors on logout
  }
}
