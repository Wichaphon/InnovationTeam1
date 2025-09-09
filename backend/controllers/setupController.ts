import { body, validationResult } from 'express-validator';
import { seedBaseData } from '../services/setupService';

const validateSeed = [
  body('adminEmail').isEmail(),
  body('adminPassword').isString().isLength({ min: 8 }),
  body('adminName').optional().isString(),
];

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}

async function seed(req, res) {
  const err = handleValidation(req, res); if (err) return;
  try {
    const { adminEmail, adminPassword, adminName } = req.body;
    const result = await seedBaseData({ adminEmail, adminPassword, adminName: adminName || 'Admin' });
    return res.json({ ok: true, ...result });
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message || 'Seed failed' });
  }
}

export { validateSeed, seed };
