// src/repos/user.repo.ts
import { UserCreateInput } from "@/types/user";
import prisma from "@/utils/prisma";
import { UserCreateReturn,UserListResult } from "@/types/user";

export type UserUpdateInput = Partial<Omit<UserCreateInput, "roleId" | "password">> & {
  // อนุญาตแก้ fname, lname, (email optional)
  email?: string | null;
};

export const UserRepo = {
  // SELECT ป้องกันไม่ให้ส่ง password ออกโดยไม่ตั้งใจ
  create: async (data: UserCreateInput):Promise<UserCreateReturn> => {
    return await prisma.user.create({
      data,
      select: { id: true, email: true, fname: true, lname: true, createdAt: true, roleId: true,  role: true},
    });
  }
    ,

  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, fname: true, lname: true, createdAt: true, roleId: true, password: false },
    }),

  findByEmail: (email: string) =>
    prisma.user.findUnique({ 
      where: { email }, 
      select: { id: true, email: true, fname: true, lname: true, createdAt: true, roleId: true, password: true, role:{ select: { name: true } } },
     }),

  list: async (page = 1, pageSize = 10): Promise<UserListResult> => {
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          fname: true,
          lname: true,
          createdAt: true,
          roleId: true,
        },
      }),
      prisma.user.count(),
    ]);

    return {
      items: await Promise.all(
        items.map(async (item) => {
          const role = await prisma.role.findUnique({
            where: { id: item.roleId },
            select: { id: true, name: true }
          });
          return {
            ...item,
            role: role ? { id: role.id, name: role.name } : { id: item.roleId, name: "" }
          };
        })
      ),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

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

