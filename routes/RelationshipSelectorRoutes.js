const express = require('express');
const router = express.Router();
const db = require('../config/database.js');

// GET /api/relationshipselector/relationships
router.get('/relationships', (req, res) => {
  db.query('SELECT * FROM relationships', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
