import { Request, Response, NextFunction } from 'express'
import redis from '../lib/redis'

export async function idempotency(req: Request, res: Response, next: NextFunction) {
  const key = req.headers['idempotency-key'] as string | undefined
  if (!key) return next()
  const cacheKey = `idem:${req.method}:${req.originalUrl}:${key}`
  try {
    const existing = await redis.get(cacheKey)
    if (existing) {
      const parsed = JSON.parse(existing)
      return res.status(parsed.status).json(parsed.body)
    }
  } catch (_) {}

  const originalJson = res.json.bind(res)
  res.json = (body?: any) => {
    try {
      const payload = { status: res.statusCode, body }
      redis.set(cacheKey, JSON.stringify(payload), 'EX', 60)
    } catch (_) {}
    return originalJson(body)
  }
  next()
}


