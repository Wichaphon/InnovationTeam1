import { Request, Response, NextFunction } from "express";
import { UNAUTHORIZED, OK, NOT_FOUND, INTERNAL_SERVER_ERROR, CREATED, BAD_REQUEST } from "@/constants/http";
import { UserService } from "@/services/userService";
import { AppError } from "@/utils/appError";
import { User } from "@/generated/prisma";
import { success } from "zod";
import { registerUser } from "@/services/authService";
import { UserCreateInput, UserListResult } from "@/types/user";
import bcrypt from "bcryptjs";


export type UserData = {
    userId?: string;
    fname?: string;
    lname?: string;
    roleName?: string;
}

export const getprofile = async (req: Request, res: Response) => {
    if (!req.user) return res.status(UNAUTHORIZED);
    const me = await UserService.getUserByIdwithRole(req.user!.id) as UserData;
    if (!me) return res.status(NOT_FOUND);
    return res.status(OK).json(me);
}

export const getAlluser = async (req: Request, res: Response) => {
    try {
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
    
        const result = await UserService.listUsers(page, pageSize);
    
        return res.status(OK).json(result);
      } catch (error) {
            throw new AppError("Fail to fetch user", INTERNAL_SERVER_ERROR, "INVALID_CREDENTIALS");
      }
}

export const createAdmin = async (req:Request, res:Response) => {
    let admin:UserCreateInput = req.body as UserCreateInput;
    try {
        
        const hashed = await bcrypt.hash(admin.password, 12);
        admin = {...admin, password:hashed};
        const newAdmin = await UserService.createUser(admin,"admin");
        return res.status(CREATED).json({
            success: true,
            data: {
                id: newAdmin?.id,
                fname: newAdmin?.fname,
                lname: newAdmin?.lname,
                email: newAdmin?.email
            }
        })
    } catch (error) {
        throw new AppError("Failed to create Admin",INTERNAL_SERVER_ERROR,"FAILED_CREATED_ADMIN");
    }
}

export const createUser = async (req: Request, res: Response) => {
    const user:UserCreateInput = req.body as UserCreateInput;
    console.log(`email is :`, user.email);

    try {
        const newUser = await registerUser(user);

        return res.status(CREATED).json({
            success: true,
            data: {
                id: newUser?.id,
                fname: newUser?.fname,
                lname: newUser?.lname,
                email: newUser?.email
            }
        });

    } catch (error: any) {
        throw new AppError("Failed to create User",INTERNAL_SERVER_ERROR,"FAILED_CREATED_USER");
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId) throw new AppError("Invalid userId", BAD_REQUEST, "INVALID_USERID");
    console.log(`want to deleteUserId`);

    const deleteUser = await UserService.deleteUser(userId as string);
    return res.status(OK).json({ message: `User ID ${deleteUser} was delete` })
}