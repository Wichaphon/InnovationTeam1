const express = require('express');
const router = express.Router();
const { validateSeed, seed } = require('../controllers/setupController');

// POST /api/setup/seed
router.post('/seed', validateSeed, seed);

module.exports = router;
