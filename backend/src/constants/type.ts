import { Express } from "express";

export interface AuthPayload {
    id: string;
}

export interface AuthRequest extends Request {
    user?: Express.User;
}

export type role = "admin" | "user";

export interface refreshToken {
    id: string;
    iat: number;
    exp: number;
}

export type returnToken = {
    success:boolean | true;
    accessToken:string;
}