#!/usr/bin/env node

import http from 'http'
import debugLib from 'debug'
import path from 'path'
import dotenv from 'dotenv'
import app from '../app'
import { seedBaseData } from '../services/setupService'

const debug = debugLib('backend:server')

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

const server = http.createServer(app)

// Fire-and-forget base data ensure on boot
;(async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456'
    const adminName = process.env.ADMIN_NAME || 'Admin'
    await seedBaseData({ adminEmail, adminPassword, adminName })
  } catch (e) {
    console.warn('[setup] seedBaseData skipped or failed:', (e as Error)?.message)
  } finally {
    server.listen(port)
  }
})()

server.on('error', onError)
server.on('listening', onListening)

function normalizePort(val: string): number | string | false {
  const port = parseInt(val, 10)
  if (isNaN(port)) return val
  if (port >= 0) return port
  return false
}

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') throw error
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + (addr && addr.port)
  debug('Listening on ' + bind)
}
