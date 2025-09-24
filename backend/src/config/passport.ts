import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import prisma from '@/utils/prisma';
import { findOrCreateUserFromGoogle } from '@/services/authService';

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  },
  // verify function
  async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
      // เอา logic ไปให้ AuthService
      const user = await findOrCreateUserFromGoogle(profile, accessToken, refreshToken);
      // user ควร return ข้อมูลที่ต้องการ
      done(null, user);
    } catch (err) {
      done(err, undefined);
    }
  }
);

passport.use(googleStrategy);


export default passport;
