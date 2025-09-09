import argon2 from "argon2";
import { prisma } from "../lib/prisma";
import { signAccess, signRefresh, verifyRefresh } from "../lib/jwt";
import { JwtPayload } from "jsonwebtoken";


// register ------------------------------------------------------------------------------
type RegisterUserArgs = {
  email: string;
  username: string;
  passwordHash: string;
};

export const registerUser = async (data: RegisterUserArgs) => {
  const passwordHash = await argon2.hash(data.passwordHash, { type: argon2.argon2id });
  
  const roleUser = await prisma.role.findUnique({ where: { role_name: "user" } });
  
  if (!roleUser) {
    throw new Error("Missing 'user' role");
  }

  return await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      passwordHash,
      roleId: roleUser.id,
    },
    select: { id: true, email: true, username: true, role: { select: { role_name: true } } },
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

// login ---------------------------------------------------------------------------------
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true }, 
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await argon2.verify(user.passwordHash, password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = signAccess(user.id, user.role.role_name);
  const refreshToken = signRefresh(user.id, user.tokenVersion);

  return { accessToken, refreshToken };
};

export const getUserProfile = async (userId: number) => {
  const userWithRole = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      email: true,
      role: {
        select: {
          role_name: true,
        },
      },
    },
  });

  if (!userWithRole) {
    return null;
  }

  return {
    username: userWithRole.username,
    email: userWithRole.email,
    role: userWithRole.role.role_name,
  };
};

export const getUserByTokenVersion = async (userId: number, tokenVersion: number) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
      tokenVersion: tokenVersion, 
    },
    select: {
      id: true,
      tokenVersion: true,
      role: {
        select: {
          role_name: true,
        },
      },
    },
  });
};