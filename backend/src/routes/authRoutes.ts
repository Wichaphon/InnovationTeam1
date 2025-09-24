import express, { Router } from 'express';
import { login, register, refresh, logout, googleCallback, googleFailureHandle as googleFailureHandler, authgoogle, frontend_tmp } from '@/controller/auth.controller';
import { validateRegister, validateLogin } from '@/middlewares/validation';
import { loggingMiddleware } from '@/middlewares/logging';
import rateLimit from 'express-rate-limit';
import { validate } from '@/middlewares/validation';
import passport from '@/config/passport';

const authRoute = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

authRoute.use(limiter)
authRoute.post('/register', validateRegister, register);
authRoute.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRoute.get('/google/callback', 
  passport.authenticate('google', { 
  session: false, 
  failureRedirect: '/auth/google/failed' }), googleCallback);
authRoute.get('/google/failed', googleFailureHandler);
authRoute.post('/login', validateLogin, login);
authRoute.post('/refresh', refresh);
authRoute.post('/logout', validateLogin, logout);

export default authRoute;