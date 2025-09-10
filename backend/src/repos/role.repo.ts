import prisma from "@/utils/prisma";

export const RoleRepo = {
    findByName:(name:string) => {
       return prisma.role.findFirst({where:{name}});
    },
    findById: (id:string) => {
        return prisma.role.findFirst({where:{id}});
    }
}