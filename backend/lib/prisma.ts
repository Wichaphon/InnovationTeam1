import * as Generated from '../src/generated/prisma'
import { PrismaClient as PrismaClientFromPackage } from '@prisma/client'

// Prefer local generated client if available (dev), else fall back to package
const PrismaClient = (Generated as any)?.PrismaClient || PrismaClientFromPackage

let prisma: any
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!(global as any).prisma) {
    ;(global as any).prisma = new PrismaClient()
  }
  prisma = (global as any).prisma
}

export default prisma
