import { Request, Response,NextFunction } from "express";
import { UNAUTHORIZED,OK, NOT_FOUND } from "@/constants/http";
import { UserService } from "@/services/userService";
import { AppError } from "@/utils/appError";

export type UserData = {
    userId?:string;
    fname?:string;
    lname?:string;
    roleName?:string;
}

export const sendprofile = async (req:Request, res:Response) => {
    if (!req.user) return res.status(UNAUTHORIZED);
    const me = await UserService.getUserByIdwithRole(req.user!.userId) as UserData;
    if(!me) return res.status(NOT_FOUND);
    return res.status(OK).json(me)  
}