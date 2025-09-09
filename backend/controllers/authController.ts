const { body, validationResult } = require('express-validator');
const authService = require('../services/authService');
const passport = require('passport');
const { buildOAuthSuccessRedirect, buildOAuthErrorRedirect } = require('../services/oauthService');

const validateRegister = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('fname').isString().notEmpty().withMessage('fname is required'),
  body('lname').isString().notEmpty().withMessage('lname is required'),
];

const validateLogin = [
  body('email').isEmail(),
  body('password').isString(),
];

const validateRefresh = [
  body('refreshToken').isString().notEmpty(),
];

const validateLogout = [
  body('refreshToken').isString().notEmpty(),
];

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}

async function register(req, res) {
  const err = handleValidation(req, res);
  if (err) return; // response already sent
  try {
    const { email, password, fname, lname } = req.body;
    const result = await authService.registerUser({ email, password, fname, lname });
    return res.status(201).json(result);
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ message: e.message || 'Registration failed' });
  }
}

async function login(req, res) {
  const err = handleValidation(req, res);
  if (err) return;
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    return res.status(200).json(result);
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ message: e.message || 'Login failed' });
  }
}

async function me(req, res) {
  try {
    const cacheKey = `me:${req.user.sub}`;
    const redis = require('../lib/redis').default;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json({ user: JSON.parse(cached) });
    const user = await authService.getUserById(req.user.sub);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await redis.set(cacheKey, JSON.stringify(user), 'EX', 60); // cache 60s
    return res.json({ user });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to fetch profile' });
  }
}

async function refresh(req, res) {
  const err = handleValidation(req, res); if (err) return;
  try {
    const { refreshToken } = req.body;
    const result = await authService.rotateRefreshToken(refreshToken);
    return res.json({ user: result.user, token: result.accessToken, refreshToken: result.refreshToken });
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ message: e.message || 'Refresh failed' });
  }
}

async function logout(req, res) {
  const err = handleValidation(req, res); if (err) return;
  try {
    const { refreshToken } = req.body;
    await authService.revokeRefreshToken(refreshToken);
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message || 'Logout failed' });
  }
}

module.exports = {
  validateRegister,
  validateLogin,
  validateRefresh,
  validateLogout,
  register,
  login,
  me,
  refresh,
  logout,
  googleAuth: passport.authenticate('google', { scope: ['profile', 'email'], accessType: 'offline', prompt: 'consent' }),
  async googleCallbackHandler(err, user, info, req, res, next) {
    try {
      if (info && (info.code === 'no_linked_user' || info.message === 'NO_LINKED_USER')) {
        return res.redirect(302, buildOAuthErrorRedirect('no_linked_user'));
      }
      if (err) return next(err);
      if (!user) return res.redirect(302, buildOAuthErrorRedirect('auth_failed'));
      const { accessToken, refreshToken } = await authService.issueTokensForUser(user);
      const role = user?.role?.name || null;
      return res.redirect(302, buildOAuthSuccessRedirect(accessToken, refreshToken, role));
    } catch (e) {
      return next(e);
    }
  },
};
