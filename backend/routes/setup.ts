const express = require('express');
const router = express.Router();
const { validateSeed, seed } = require('../controllers/setupController');

router.post('/seed', validateSeed, seed);

module.exports = router;
