import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import crypto from 'crypto'
const prisma = require('../lib/prisma')

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('[auth] Missing GOOGLE_CLIENT_ID/SECRET in environment')
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const provider = 'google'
        const providerAccountId = profile.id

        // 1) Try to find existing account linkage first
        let account = await prisma.account.findUnique({
          where: { provider_providerAccountId: { provider, providerAccountId } },
          include: { user: { include: { role: true } } },
        })

        if (account && account.user) {
          return done(null, account.user)
        }

        // 2) Find existing user by email; if missing, auto-create user with role 'User'
        const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || undefined
        let user = email
          ? await prisma.user.findUnique({ where: { email }, include: { role: true } })
          : null
        if (!user) {
          const givenName = (profile.name && profile.name.givenName) || ''
          const familyName = (profile.name && profile.name.familyName) || ''
          const fallbackEmail = email || `${providerAccountId}@${provider}.local`
          const randomPassword = crypto.randomBytes(32).toString('hex')

          const argon2 = require('argon2')
          const passwordHash = await argon2.hash(randomPassword)
          const defaultRole = await prisma.role.upsert({ where: { name: 'User' }, update: {}, create: { name: 'User' } })
          user = await prisma.user.create({
            data: {
              email: fallbackEmail,
              fname: givenName,
              lname: familyName,
              password: passwordHash,
              roleId: defaultRole.id,
            },
            include: { role: true },
          })
        }

        // 3) Link the provider account
        const expiresAt = new Date(Date.now() + 3600 * 1000)
        account = await prisma.account.upsert({
          where: { provider_providerAccountId: { provider, providerAccountId } },
          update: {
            access_token: accessToken || null,
            ...(refreshToken ? { refresh_token: refreshToken } : {}),
            expiresAt,
          },
          create: {
            provider,
            providerAccountId,
            type: 'oauth',
            access_token: accessToken || null,
            refresh_token: refreshToken || null,
            expiresAt,
            user: { connect: { id: user.id } },
          },
          include: { user: { include: { role: true } } },
        })

        return done(null, account.user)
      } catch (err) {
        return done(err as Error)
      }
    }
  )
)

// Session is not used
passport.serializeUser((user: any, done) => done(null, user.id))
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id }, include: { role: true } })
    done(null, user)
  } catch (e) {
    done(e as Error)
  }
})

;(module as any).exports = passport


