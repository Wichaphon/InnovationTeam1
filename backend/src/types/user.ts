import { Prisma } from "@/generated/prisma";
import prisma from "@/utils/prisma";

export type UserCreateInput = {
    email: string;
    fname: string;
    lname: string;
    password: string; // อย่าลืม hash ก่อนส่งมา
    roleId: string;
  };

// src/types/user.ts
export interface UserResponse {
    id: string;
    email: string;
    fname: string;
    lname: string;
    roleName: string;
}

export type UserCreateReturn = Prisma.UserGetPayload<{
    select: { id: true; email: true; fname: true; lname: true; createdAt: true; roleId: true, role:true };
  }>;

export type PaginationResult<T> = {
  items:T[];
  total:number;
  page:number;
  pageSize:number;
  totalPages:number;
};

export type UserListResult = PaginationResult<UserCreateReturn>;