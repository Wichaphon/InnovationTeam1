import prisma from "@/utils/prisma";

export const RefreshTokenRepo = {
    create: (params: { token: string; userId: string }) =>
      prisma.refreshToken.create({ data: { token: params.token, userId: params.userId } }),
  
    find: (token: string) =>
      prisma.refreshToken.findUnique({ where: { token } }),
  
    delete: (token: string) =>
      prisma.refreshToken.delete({ where: { token } }).catch(() => null),
  
    deleteAllByUserId: (userId: string) =>
      prisma.refreshToken.deleteMany({ where: { userId } }),
  }