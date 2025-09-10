import express, { Router } from 'express';
import { login, register, refresh, logout } from '@/controller/auth.controller';
import { validateRegister, validateLogin } from '@/middlewares/validation';
import { loggingMiddleware } from '@/middlewares/logging';
import rateLimit from 'express-rate-limit';
import { validate } from '@/middlewares/validation';

const authRoute = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

authRoute.post('/register', limiter, validateRegister, register);
authRoute.post('/login', limiter, validateLogin, login);
authRoute.post('/refresh', limiter, validateLogin, refresh);
authRoute.post('/logout', limiter, validateLogin, logout);


export default authRoute;