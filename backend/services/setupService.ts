const argon2 = require('argon2');
const prisma = require('../lib/prisma');

async function seedBaseData({ adminEmail, adminPassword, adminName }) {

  const [adminRole, userRole] = await Promise.all([
    prisma.role.upsert({ where: { name: 'Admin' }, update: {}, create: { name: 'Admin' } }),
    prisma.role.upsert({ where: { name: 'User' }, update: {}, create: { name: 'User' } }),
  ]);

  const hash = await argon2.hash(adminPassword);
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      fname: adminName || 'Admin',
      lname: 'User',
      password: hash,
      roleId: adminRole.id,
    },
    create: {
      email: adminEmail,
      fname: adminName || 'Admin',
      lname: 'User',
      password: hash,
      roleId: adminRole.id,
    },
    include: { role: true },
  });

  const defaultUserEmail = process.env.DEFAULT_USER_EMAIL || 'user@example.com';
  const defaultUserPassword = process.env.DEFAULT_USER_PASSWORD || 'User@123456';
  const userHash = await argon2.hash(defaultUserPassword);
  await prisma.user.upsert({
    where: { email: defaultUserEmail },
    update: {
      fname: 'User',
      lname: 'Demo',
      password: userHash,
      roleId: userRole.id,
    },
    create: {
      email: defaultUserEmail,
      fname: 'User',
      lname: 'Demo',
      password: userHash,
      roleId: userRole.id,
    },
  });
  return { ok: true, adminEmail };
}

module.exports = { seedBaseData };
