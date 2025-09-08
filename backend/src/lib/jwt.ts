import * as jwt from "jsonwebtoken";
import type { Response } from "express";

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!; 

export function signAccess(userId: number, role: string) {
  return jwt.sign({ role }, ACCESS_SECRET, {
    subject: String(userId),
    expiresIn: "15m",
  });
}

export function signRefresh(userId: number, tokenVersion: number) {
  return jwt.sign({ ver: tokenVersion }, REFRESH_SECRET, {
    subject: String(userId),
    expiresIn: "7d",
  });
}

export function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,         
    sameSite: "lax",    
    path: "/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie("refresh_token", { path: "/auth" });
}

export function verifyAccess(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as jwt.JwtPayload;
}
export function verifyRefresh(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as jwt.JwtPayload;
}

