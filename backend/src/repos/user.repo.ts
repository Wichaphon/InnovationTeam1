// src/repos/user.repo.ts
import prisma from "@/utils/prisma";

export type UserCreateInput = {
  email: string;
  fname: string;
  lname: string;
  password: string; // อย่าลืม hash ก่อนส่งมา
  roleId: string;
};

export type UserUpdateInput = Partial<Omit<UserCreateInput, "roleId" | "password">> & {
  // อนุญาตแก้ fname, lname, (email optional)
  email?: string | null;
};

export const UserRepo = {
  // SELECT ป้องกันไม่ให้ส่ง password ออกโดยไม่ตั้งใจ
  create: (data: UserCreateInput) =>
    prisma.user.create({
      data,
      select: { id: true, email: true, fname: true, lname: true, createdAt: true, roleId: true },
    }),

  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, fname: true, lname: true, createdAt: true, roleId: true, password: true },
    }),

  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  list: (page = 1, pageSize = 10) =>
    prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, fname: true, lname: true, createdAt: true },
    }),

  update: (id: string, data: UserUpdateInput) =>
    prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, fname: true, lname: true, createdAt: true },
    }),

  findByIdWithRole: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, fname: true, lname: true, role: { select: { name: true } } }
    }),

  remove: (id: string) =>
    prisma.user.delete({
      where: { id },
      select: { id: true },
    }),
};

