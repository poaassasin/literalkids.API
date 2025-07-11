const db = require('../config/database.js');

// Get user info by ID
const getHomepageUser = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT name, username, level, progress FROM homepage_users WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", detail: err });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });

    const user = results[0];
    res.json({ user });
  });
};

// Create dummy user (for testing or registration)
const createHomepageUser = (req, res) => {
  const { name, username, level = 1, progress = 0 } = req.body;

  if (!name || !username) {
    return res.status(400).json({ error: "Name and username are required" });
  }

  const sql = "INSERT INTO homepage_users (name, username, level, progress) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, username, level, progress], (err, result) => {
    if (err) return res.status(500).json({ error: "Insert error", detail: err });
    res.status(201).json({ message: "User created", id: result.insertId });
  });
};

// Update progress or level (e.g. after story read)
const updateHomepageUser = (req, res) => {
  // Ambil ID dari parameter URL
  const { id } = req.params;
  
  // Ambil data baru dari body request yang dikirim aplikasi
  const { level, progress } = req.body;

  // Validasi sederhana
  if (level === undefined || progress === undefined) {
    return res.status(400).json({ error: "Level dan progress wajib diisi" });
  }

  const sql = "UPDATE homepage_users SET level = ?, progress = ? WHERE id = ?";
  
  db.query(sql, [level, progress, id], (err, result) => {
    if (err) {
        console.error("Database update error:", err);
        return res.status(500).json({ error: "Update error", detail: err });
    }
    
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User dengan ID tersebut tidak ditemukan" });
    }
    
    res.json({ message: "User updated successfully" });
  });
};

module.exports = {
  getHomepageUser,
  createHomepageUser,
  updateHomepageUser
};
