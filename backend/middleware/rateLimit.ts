import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import redis from '../lib/redis'

// Identify client by user email (from body) if provided, else by cookie header, else IP
function keyGenerator(req: any): string {
  const email = (req.body && typeof req.body.email === 'string') ? req.body.email.toLowerCase().trim() : ''
  const browserSig = req.headers['user-agent'] || ''
  const ip = req.ip || req.connection?.remoteAddress || ''
  // Prefer email to limit per-user; fallback to UA+IP as per-browser approximation
  return email || `${browserSig}|${ip}`
}

export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 5, // 5 attempts per window per key
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  store: new RedisStore({
    // @ts-expect-error type mismatch from library
    sendCommand: (...args: string[]) => redis.call(...args as any),
  }) as any,
  message: { message: 'Too many login attempts. Please try again later.' },
})


