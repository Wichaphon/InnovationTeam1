import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/jwt.utils";
import { UNAUTHORIZED, FORBIDDEN } from "@/constants/http";
import { AuthPayload } from "@/constants/type";
import { UserService } from "@/services/userService";
import { AuthRequest } from "@/constants/type";
import { AppError } from "@/utils/appError";
import { error } from "console";

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(UNAUTHORIZED).json({error:"Un Authorized access"});

    try {
        const payload = verifyAccessToken(token) as AuthPayload;
        req.user = { id: payload.id};
        next();
    } catch (err) {
        res.status(UNAUTHORIZED).json({ error: 'Invalid token' });
    }

}

export const requireRole = (role: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user?.id) return res.status(UNAUTHORIZED).json({ error: "unauthorized" });
        const u = await UserService.getUserByIdwithRole(req.user.id);
        const roleName = u?.role?.name;
        if (roleName !== role) return res.status(FORBIDDEN).json({ error: "forbidden" });

        req.user.role = roleName;
        next();
    };
};