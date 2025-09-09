import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import redis from '../lib/redis'

function keyGenerator(req: any): string {
  const email = (req.body && typeof req.body.email === 'string') ? req.body.email.toLowerCase().trim() : ''
  const browserSig = req.headers['user-agent'] || ''
  const ip = req.ip || req.connection?.remoteAddress || ''
  return email || `${browserSig}|${ip}`
}

export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  store: new RedisStore({
    // @ts-expect-error type mismatch from library
    sendCommand: (...args: string[]) => redis.call(...args as any),
  }) as any,
  message: { message: 'Too many login attempts. Please try again later.' },
})


