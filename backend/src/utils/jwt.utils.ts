import jwt, { VerifyOptions, SignOptions } from "jsonwebtoken";
import { env } from "process";
import config from "@/config/config";

export const generatedAccessToken = (payload: object) => {
    return jwt.sign(payload, config.jwt.ACCESS_SECRET, { expiresIn: '15m' });
}

export const generatedRefreshToken = (payload: object) => {
    return jwt.sign(payload, config.jwt.REFRESH_SECRET, { expiresIn: '7d' });
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, config.jwt.ACCESS_SECRET);
}

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, config.jwt.REFRESH_SECRET);
}