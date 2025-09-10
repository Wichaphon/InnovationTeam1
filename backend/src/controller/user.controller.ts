import { Request, Response,NextFunction } from "express";
import { UNAUTHORIZED,OK } from "@/constants/http";
import { UserService } from "@/services/userService";

export const sendprofile = async (req:Request, res:Response) => {
    if (!req.user) return res.status(UNAUTHORIZED);
    const me = await UserService.getUserByIdwithRole(req.user!.userId);
    return res.status(OK).json(me)  
}