import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UNAUTHORIZED, FORBIDDEN } from "@/constants/http";
import config from "@/config/config";
import { AuthedRequest, AuthPayload } from "@/constants/type";
import { UserRepo } from "@/repos/user.repo";
import { UserService } from "@/services/userService";

const { verify } = jwt;

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader?.startsWith('Bearer ')) {
        return res.sendStatus(UNAUTHORIZED);
    }

    const token: string | undefined = authHeader.split(' ')[1];

    if (!token) return res.sendStatus(UNAUTHORIZED);

    try {
        const payload = jwt.verify(token, config.jwt.ACCESS_SECRET) as AuthPayload;
        req.user = payload;
        next();
    } catch (error) {
        return res.sendStatus(UNAUTHORIZED);
    }

}

export const requireRole = (role: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user?.userId) return res.status(UNAUTHORIZED).json({ error: "unauthorized" });
      const u = await UserService.getUserByIdwithRole(req.user.userId);
      const roleName = u?.role?.name;
      if (roleName !== role) return res.status(FORBIDDEN).json({ error: "forbidden" });
      // แนบ role ให้ controller ใช้งานต่อได้ (optional)
      req.user.role = roleName;
      next();
    };
  };