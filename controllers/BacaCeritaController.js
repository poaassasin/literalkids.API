const db = require('../config/db_local');

// Ambil semua cerita
const getAllCerita = (req, res) => {
  const sql = "SELECT * FROM bacacerita";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    console.log("Hasil query bacacerita:", results); 
    res.json(results);
  });
};


// Ambil cerita berdasarkan ID
const getCeritaById  = (req, res) => {
  const sql = "SELECT * FROM bacacerita WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Cerita tidak ditemukan" });
    res.json(results[0]);
  });
};

// Ambil semua halaman berdasarkan story_id
const getPagesByStoryId = (req, res) => {
  const sql = "SELECT * FROM bacacerita_pages WHERE story_id = ? ORDER BY page_number ASC";
  db.query(sql, [req.params.story_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

module.exports = {
  getAllCerita,
  getCeritaById,
  getPagesByStoryId,
};
