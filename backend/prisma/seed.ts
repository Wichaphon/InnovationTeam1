/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client')
const argon2 = require('argon2')

const prisma = new PrismaClient()

async function main() {
  // Ensure roles
  const roleUser = await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: { name: 'User' },
  })
  const roleAdmin = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin' },
  })

  // Users
  const adminPassword = await argon2.hash('Admin@123456')
  const userPassword = await argon2.hash('User@123456')

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      fname: 'Admin',
      lname: 'User',
      password: adminPassword,
      roleId: roleAdmin.id,
    },
    create: {
      email: 'admin@example.com',
      fname: 'Admin',
      lname: 'User',
      password: adminPassword,
      roleId: roleAdmin.id,
    },
  })

  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {
      fname: 'Normal',
      lname: 'User',
      password: userPassword,
      roleId: roleUser.id,
    },
    create: {
      email: 'user@example.com',
      fname: 'Normal',
      lname: 'User',
      password: userPassword,
      roleId: roleUser.id,
    },
  })

  console.log('Seed completed: roles and users ensured')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


