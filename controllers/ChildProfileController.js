const db = require('../config/database.js');

const getAllChildProfiles = (req, res) => {
  db.query("SELECT * FROM child_profiles", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

const getChildProfileById = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM child_profiles WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ error: "Child profile not found" });
    res.json(results[0]);
  });
};

const createChildProfile = (req, res) => {
  const {
    id,
    fullName,
    username,
    level = 1,
    currentXp = 0,
    maxXp = 100,
    age,
    gender,
    schoolLevel,
    birthDate,
    avatarUrl,
    coins = 0,
    type
  } = req.body;

  if (!id || !fullName || !username || !type) {
    return res.status(400).json({ error: "Required fields: id, fullName, username, type" });
  }

  const query = `INSERT INTO child_profiles 
    (id, fullName, username, level, currentXp, maxXp, age, gender, schoolLevel, birthDate, avatarUrl, coins, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [id, fullName, username, level, currentXp, maxXp, age, gender, schoolLevel, birthDate, avatarUrl, coins, type],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: "Child profile created", id: id });
    }
  );
};

const updateChildProfile = (req, res) => {
  const id = req.params.id;
  const {
    fullName,
    username,
    level,
    currentXp,
    maxXp,
    age,
    gender,
    schoolLevel,
    birthDate,
    avatarUrl,
    coins,
    type
  } = req.body;

  const query = `UPDATE child_profiles SET
    fullName = ?, username = ?, level = ?, currentXp = ?, maxXp = ?, age = ?, gender = ?, schoolLevel = ?, birthDate = ?, avatarUrl = ?, coins = ?, type = ?
    WHERE id = ?`;

  db.query(
    query,
    [fullName, username, level, currentXp, maxXp, age, gender, schoolLevel, birthDate, avatarUrl, coins, type, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) return res.status(404).json({ error: "Child profile not found" });
      res.json({ message: "Child profile updated" });
    }
  );
};

const deleteChildProfile = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM child_profiles WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Child profile not found" });
    res.json({ message: "Child profile deleted" });
  });
};

const updateBirthdateOnly = (req, res) => {
  const id = req.params.id;
  const { birthDate } = req.body;

  if (!birthDate) {
    return res.status(400).json({ error: "Tanggal lahir (birthDate) wajib diisi" });
  }

  const query = `UPDATE child_profiles SET birthDate = ? WHERE id = ?`;

  db.query(query, [birthDate, id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Child profile tidak ditemukan" });
    }
    res.json({ message: "Tanggal lahir berhasil diperbarui" });
  });
};


module.exports = {
  getAllChildProfiles,
  getChildProfileById,
  createChildProfile,
  updateChildProfile,
  deleteChildProfile,
  updateBirthdateOnly,
};
