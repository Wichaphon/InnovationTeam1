let PrismaClient;
try {
  ({ PrismaClient } = require('../src/generated/prisma'));
} catch (e) {
  ({ PrismaClient } = require('@prisma/client'));
}

let prisma;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
