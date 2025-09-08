import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await Promise.all([
    prisma.role.upsert({
      where: { role_name: "admin" },  
      update: {},
      create: { role_name: "admin" },  
    }),
    prisma.role.upsert({
      where: { role_name: "user" },
      update: {},
      create: { role_name: "user" },
    }),
  ]);
}

main().finally(() => prisma.$disconnect());
