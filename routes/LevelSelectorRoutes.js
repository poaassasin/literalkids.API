const express = require('express');
const router = express.Router();
const db = require('../config/database.js');

// GET /api/levelselector/school-levels
router.get('/school-levels', (req, res) => {
  db.query('SELECT * FROM school_levels', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
