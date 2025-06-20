const express = require('express');
const router = express.Router();
const db = require('../config/database.js');

// GET /api/occupationselector/occupations
router.get('/occupations', (req, res) => {
  db.query('SELECT * FROM occupations', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
