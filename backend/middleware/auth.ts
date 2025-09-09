import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import redis from '../lib/redis';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: 'Missing Authorization header' });
    }
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { sub, email, role }

    try {
      const cacheKey = `user:${payload.sub}:role`;
      let roleName = await redis.get(cacheKey);
      if (!roleName) {
        const user = await prisma.user.findUnique({ where: { id: payload.sub }, include: { role: true } });
        roleName = user?.role?.name || null;
        if (roleName) await redis.set(cacheKey, roleName, 'EX', 300);
      }
      if (roleName) req.user.role = roleName;
    } catch (_) {}
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireRole(...requiredRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const role = req.user.role || null;
    const ok = requiredRoles.some((r) => r === role);
    if (!ok) return res.status(403).json({ message: 'Forbidden: insufficient role' });
    next();
  };
}

export { authenticate, requireRole };
