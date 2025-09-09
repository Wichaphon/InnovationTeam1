import prisma from '../lib/prisma';
import argon2 from 'argon2';

async function listRoles() {
  return prisma.role.findMany();
}

async function createRole({ name }) {
  return prisma.role.create({ data: { name } });
}

async function deleteRole(id) {
  return prisma.role.delete({ where: { id } });
}

async function setUserRole(userId, roleId) {
  await prisma.role.findUniqueOrThrow({ where: { id: roleId } });
  return prisma.user.update({ where: { id: userId }, data: { roleId }, include: { role: true } });
}

async function getUserRole(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
  return user?.role || null;
}

async function createUserWithRole({ email, password, fname, lname, roleId }) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    const err = new Error('Email already exists');
    err.status = 409;
    throw err;
  }
  await prisma.role.findUniqueOrThrow({ where: { id: roleId } });
  const hash = await argon2.hash(password);
  const user = await prisma.user.create({
    data: { email, fname, lname, password: hash, roleId },
    include: { role: true },
  });
  const { password: _, ...safe } = user;
  return safe;
}

export {
  listRoles,
  createRole,
  deleteRole,
  setUserRole,
  getUserRole,
  createUserWithRole,
};
