const db = require('../config/db_local');

// Ambil semua rak cerita berdasarkan user
exports.getShelves = (req, res) => {
  const userId = req.user.id; // didapat dari verifyToken
  db.query("SELECT * FROM story_shelves WHERE user_id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to get shelves", error: err });
    res.json({ shelves: results });
  });
};

// Tambahkan 1 cerita ke shelf
exports.addStoryToShelf = (req, res) => {
  const { shelfId } = req.body;
  db.query("UPDATE story_shelves SET story_count = story_count + 1 WHERE id = ?", [shelfId], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to update shelf", error: err });
    res.json({ message: "Story added to shelf" });
  });
};

// Buat koleksi baru
exports.createNewShelf = (req, res) => {
  const userId = req.user.id;
  const { title, coverImage } = req.body;
  db.query(
    "INSERT INTO story_shelves (user_id, title, cover_image, is_custom) VALUES (?, ?, ?, TRUE)",
    [userId, title, coverImage],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to create shelf", error: err });
      res.json({ message: "New shelf created", shelfId: result.insertId });
    }
  );
};
