var express = require('express');
var router = express.Router();
const prisma = require('../lib/prisma');

// GET /health - checks server and database connectivity
router.get('/', async function (req, res) {
  // Allow cross-origin calls from the frontend during development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Simple DB connectivity check
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      ok: true,
      service: 'backend',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({
      ok: false,
      service: 'backend',
      database: 'error',
      error: err?.message || 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
