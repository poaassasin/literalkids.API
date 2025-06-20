const db = require('../config/database.js');

// Ambil semua genre
const getAllGenres = (req, res) => {
  const sql = "SELECT * FROM genres";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Ambil semua cerita berdasarkan genre tertentu (genre_id)
const getStoriesByGenre = (req, res) => {
  const genreId = req.params.genre_id;
  const sql = "SELECT * FROM stories WHERE genre_id = ?";
  db.query(sql, [genreId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Ambil detail cerita berdasarkan story ID
const getStoryById = (req, res) => {
  const storyId = req.params.id;
  const sql = "SELECT * FROM stories WHERE id = ?";
  db.query(sql, [storyId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Cerita tidak ditemukan" });
    res.json(results[0]);
  });
};

module.exports = {
  getAllGenres,
  getStoriesByGenre,
  getStoryById
};
