import type { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../lib/jwt";
import type { JwtPayload } from "jsonwebtoken";

export const protectRoute = (req: any, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ message: "Authentication failed. No access token provided." });
    }

    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication failed. Invalid token format." });
    }

    const payload = verifyAccess(token) as JwtPayload;

    req.userId = payload.sub as string;
    req.userRole = payload.role as string;

    next();
    
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(401).json({ message: "Authentication failed. Invalid access token." });
  }
};