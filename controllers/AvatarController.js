const db = require('../config/database.js');

const getAllAvatars = (req, res) => {
  const query = 'SELECT * FROM avatars';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

const purchaseAvatar = (req, res) => {
  const { child_id, avatar_id } = req.body;

  if (!child_id || !avatar_id) {
    return res.status(400).json({ message: 'child_id dan avatar_id wajib diisi' });
  }

  const getChildQuery = 'SELECT coins FROM children WHERE id = ?';
  const getAvatarQuery = 'SELECT price FROM avatars WHERE id = ?';
  const insertOwnershipQuery = 'INSERT INTO child_avatars (child_id, avatar_id) VALUES (?, ?)';
  const updateCoinsQuery = 'UPDATE children SET coins = coins - ? WHERE id = ?';

  db.query(getChildQuery, [child_id], (err, childResults) => {
    if (err || childResults.length === 0) return res.status(404).json({ message: 'Anak tidak ditemukan' });

    const childCoins = childResults[0].coins;

    db.query(getAvatarQuery, [avatar_id], (err, avatarResults) => {
      if (err || avatarResults.length === 0) return res.status(404).json({ message: 'Avatar tidak ditemukan' });

      const avatarPrice = avatarResults[0].price;

      if (childCoins < avatarPrice) {
        return res.status(400).json({ message: 'Koin tidak cukup' });
      }

      db.query(insertOwnershipQuery, [child_id, avatar_id], (err) => {
        if (err) return res.status(500).json({ message: 'Gagal membeli avatar' });

        db.query(updateCoinsQuery, [avatarPrice, child_id], (err) => {
          if (err) return res.status(500).json({ message: 'Gagal memperbarui koin' });
          res.json({ message: 'Avatar berhasil dibeli', avatar_id });
        });
      });
    });
  });
};

const updateAvatar = (req, res) => {
  const { child_id, avatar_id } = req.body;

  if (!child_id || !avatar_id) {
    return res.status(400).json({ message: 'child_id dan avatar_id wajib diisi' });
  }

  const checkOwnershipQuery = 'SELECT * FROM child_avatars WHERE child_id = ? AND avatar_id = ?';
  const updateAvatarQuery = 'UPDATE children SET avatar_id = ? WHERE id = ?';

  db.query(checkOwnershipQuery, [child_id, avatar_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    if (results.length === 0) {
      return res.status(403).json({ message: 'Avatar belum dimiliki anak' });
    }

    db.query(updateAvatarQuery, [avatar_id, child_id], (err) => {
      if (err) return res.status(500).json({ message: 'Gagal memperbarui avatar' });
      res.json({ message: 'Avatar berhasil diperbarui' });
    });
  });
};


module.exports = {
  getAllAvatars,
  purchaseAvatar,
  updateAvatar
};
