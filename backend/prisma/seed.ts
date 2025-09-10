import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ... 🌱')

  // Create or update the 'user' role
  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {}, // Don't update if it exists
    create: {
      name: 'user',
    },
  })

  // Create or update the 'admin' role
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {}, // Don't update if it exists
    create: {
      name: 'admin',
    },
  })

  console.log('Seeding finished. ✅')
  console.log({ userRole, adminRole })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })