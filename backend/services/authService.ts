import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import type { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import prisma from '../lib/prisma';
import redis from '../lib/redis';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN || '15m') as any;
const REFRESH_TOKEN_TTL_DAYS = 7;

async function getUserWithRoleByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
}

function signToken(user) {
  const role = user.role?.name || null;
  const payload = { sub: user.id, email: user.email, role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return token;
}

async function createRefreshToken(userId) {
  // Simple random token using JWT for entropy, but stored in DB
  const raw = jwt.sign({ sub: userId, typ: 'refresh' }, JWT_SECRET, { expiresIn: `${REFRESH_TOKEN_TTL_DAYS}d` });
  const token = raw; // could hash before storing for extra security
  await prisma.refreshToken.create({ data: { token, userId } });
  // Cache whitelist mapping in Redis with TTL until token expiry
  try {
    const decoded = jwt.decode(token) as JwtPayload | null;
    const exp = typeof decoded?.exp === 'number' ? decoded.exp : 0;
    const ttl = Math.max(0, exp - Math.floor(Date.now() / 1000));
    if (ttl > 0) await redis.set(`rt:token:${token}`, String(userId), 'EX', ttl);
  } catch (_) {}
  return token;
}

async function rotateRefreshToken(oldToken) {
  // Reject if blacklisted
  try { if (await redis.get(`rt:blacklist:${oldToken}`)) {
    const err = new Error('Invalid refresh token');
    err.status = 401;
    throw err;
  } } catch (_) {}
  const existing = await prisma.refreshToken.findUnique({ where: { token: oldToken } });
  if (!existing) {
    // Fallback: allow Redis whitelist to resolve user if DB row was removed but token still valid
    const userIdFromCache = await redis.get(`rt:token:${oldToken}`);
    if (!userIdFromCache) {
      const err = new Error('Invalid refresh token');
      err.status = 401;
      throw err;
    }
    // Simulate existing
    try { jwt.verify(oldToken, JWT_SECRET); } catch (_) {
      await redis.set(`rt:blacklist:${oldToken}`, '1', 'EX', 60 * 60 * 24);
      const err = new Error('Expired refresh token');
      err.status = 401;
      throw err;
    }
    const newToken = await createRefreshToken(userIdFromCache);
    const user = await prisma.user.findUnique({ where: { id: userIdFromCache }, include: { role: true } });
    // Blacklist old
    try {
      const decoded = jwt.decode(oldToken) as JwtPayload | null; const exp = typeof decoded?.exp === 'number' ? decoded.exp : 0; const ttl = Math.max(0, exp - Math.floor(Date.now() / 1000));
      if (ttl > 0) await redis.set(`rt:blacklist:${oldToken}`, '1', 'EX', ttl);
      await redis.del(`rt:token:${oldToken}`);
    } catch (_) {}
    const accessToken = signToken(user);
    return { accessToken, refreshToken: newToken, user: sanitizeUser(user) };
  }
  // Optionally verify expiration by decoding; DB does not enforce expiry
  try { jwt.verify(oldToken, JWT_SECRET); } catch (_) {
    // revoke expired
    await prisma.refreshToken.delete({ where: { token: oldToken } });
    const err = new Error('Expired refresh token');
    err.status = 401;
    throw err;
  }
  // Rotate: delete old, create new
  await prisma.refreshToken.delete({ where: { token: oldToken } });
  const newToken = await createRefreshToken(existing.userId);
  const user = await prisma.user.findUnique({ where: { id: existing.userId }, include: { role: true } });
  // Blacklist old and remove whitelist
  try {
    const decoded = jwt.decode(oldToken) as JwtPayload | null; const exp = typeof decoded?.exp === 'number' ? decoded.exp : 0; const ttl = Math.max(0, exp - Math.floor(Date.now() / 1000));
    if (ttl > 0) await redis.set(`rt:blacklist:${oldToken}`, '1', 'EX', ttl);
    await redis.del(`rt:token:${oldToken}`);
  } catch (_) {}
  const accessToken = signToken(user);
  return { accessToken, refreshToken: newToken, user: sanitizeUser(user) };
}

async function revokeRefreshToken(token) {
  try { await prisma.refreshToken.delete({ where: { token } }); } catch (_) {}
  // Blacklist token and remove whitelist
  try {
    const decoded = jwt.decode(token) as JwtPayload | null; const exp = typeof decoded?.exp === 'number' ? decoded.exp : 0; const ttl = Math.max(0, exp - Math.floor(Date.now() / 1000));
    if (ttl > 0) await redis.set(`rt:blacklist:${token}`, '1', 'EX', ttl);
    await redis.del(`rt:token:${token}`);
  } catch (_) {}
}

async function issueTokensForUser(user) {
  const accessToken = signToken(user);
  const refreshToken = await createRefreshToken(user.id);
  return { accessToken, refreshToken };
}

async function registerUser({ email, password, fname, lname }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }
  // Argon2id is used by default; Node bindings select secure parameters.
  const passwordHash = await argon2.hash(password);
  // Ensure default 'User' role exists
  const defaultRole = await prisma.role.upsert({
    where: { name: 'User' },
    update: {},
    create: { name: 'User' },
  });
  const user = await prisma.user.create({
    data: {
      email,
      fname: fname || '',
      lname: lname || '',
      password: passwordHash,
      roleId: defaultRole.id,
    },
    include: { role: true },
  });
  // Do NOT issue tokens on registration; return only created user
  return { user: sanitizeUser(user) };
}

async function loginUser({ email, password }) {
  const user = await getUserWithRoleByEmail(email);
  if (!user || !user.password) {
    const err = new Error('Email or Password is incorrect');
    err.status = 401;
    throw err;
  }
  const match = await argon2.verify(user.password, password);
  if (!match) {
    const err = new Error('Email or Password is incorrect');
    err.status = 401;
    throw err;
  }
  const { accessToken, refreshToken } = await issueTokensForUser(user);
  return { user: sanitizeUser(user), token: accessToken, refreshToken };
}

function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

async function getUserById(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
  return user ? sanitizeUser(user) : null;
}

export {
  registerUser,
  loginUser,
  getUserById,
  rotateRefreshToken,
  revokeRefreshToken,
  issueTokensForUser,
};
