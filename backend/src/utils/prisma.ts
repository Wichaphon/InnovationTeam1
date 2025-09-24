import { PrismaClient } from '@/generated/prisma';
// import { env } from '@/config/env';

const g = global as unknown as { prisma?: PrismaClient };

const prisma = g.prisma ?? new PrismaClient({ log: ['query'] });

if (process.env.NODE_ENV !== 'production') {
  g.prisma = prisma;
}

export default prisma;