const db = require('../config/database.js');

const getAllParentProfiles = (req, res) => {
  db.query("SELECT * FROM parent_profiles", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getParentProfileById = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM parent_profiles WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Parent profile not found" });
    res.json(results[0]);
  });
};

const createParentProfile = (req, res) => {
  const {
    id,
    fullName,
    username,
    birthDate,
    avatarUrl,
    phoneNumber,
    occupation,
    relationship,
    type,
  } = req.body;

  if (!id || !fullName || !username || !type) {
    return res.status(400).json({ error: "Required fields: id, fullName, username, type" });
  }

  const query = `
    INSERT INTO parent_profiles 
    (id, fullName, username, birthDate, avatarUrl, phoneNumber, occupation, relationship, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [id, fullName, username, birthDate, avatarUrl, phoneNumber, occupation, relationship, type],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Parent profile created", id });
    }
  );
};

const updateParentProfile = (req, res) => {
  const id = req.params.id;
  const {
    fullName,
    username,
    birthDate,
    avatarUrl,
    phoneNumber,
    occupation,
    relationship,
    type,
  } = req.body;

  const query = `
    UPDATE parent_profiles SET
      fullName = ?, username = ?, birthDate = ?, avatarUrl = ?, phoneNumber = ?, occupation = ?, relationship = ?, type = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [fullName, username, birthDate, avatarUrl, phoneNumber, occupation, relationship, type, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Parent profile not found" });
      res.json({ message: "Parent profile updated" });
    }
  );
};

const deleteParentProfile = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM parent_profiles WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Parent profile not found" });
    res.json({ message: "Parent profile deleted" });
  });
};

module.exports = {
  getAllParentProfiles,
  getParentProfileById,
  createParentProfile,
  updateParentProfile,
  deleteParentProfile,
};
