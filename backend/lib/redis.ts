import Redis from 'ioredis'

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1'
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10)
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined

let redis: Redis

declare global {
  var __redis__: Redis | undefined
}

if (process.env.NODE_ENV !== 'production') {
  if (!global.__redis__) {
    global.__redis__ = new Redis({ host: REDIS_HOST, port: REDIS_PORT, password: REDIS_PASSWORD })
  }
  redis = global.__redis__
} else {
  redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT, password: REDIS_PASSWORD })
}

export default redis


