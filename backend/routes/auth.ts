import express from 'express';
import passport from 'passport';
import { authenticate } from '../middleware/auth';
import { loginLimiter } from '../middleware/rateLimit';
import { idempotency } from '../middleware/idempotency';
import {
  validateRegister,
  validateLogin,
  validateRefresh,
  validateLogout,
  register,
  login,
  me,
  refresh,
  logout,
  googleAuth,
  googleCallbackHandler,
} from '../controllers/authController';

router.post('/register', idempotency, validateRegister, register);
router.post('/login', loginLimiter, idempotency, validateLogin, login);
router.get('/me', authenticate, me);
router.post('/refresh', idempotency, validateRefresh, refresh);
router.post('/logout', validateLogout, logout);

// Google OAuth
router.get('/google', googleAuth);
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) =>
    googleCallbackHandler(err, user, info, req, res, next)
  )(req, res, next);
});
router.get('/google/failure', (_req, res) => res.status(401).json({ message: 'Google authentication failed' }));

export default router;
