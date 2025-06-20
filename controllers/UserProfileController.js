const db = require('../config/database.js'); // Asumsikan ada koneksi DB di sini
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, full_name, username, email, phone_number, user_type, created_at, updated_at, is_active, last_login FROM userprofile');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT id, full_name, username, email, phone_number, user_type, created_at, updated_at, is_active, last_login FROM userprofile WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const registerUser = async (req, res) => {
  const { id, full_name, username, password, email, phone_number, user_type } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      'INSERT INTO userprofile (id, full_name, username, password_hash, email, phone_number, user_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, full_name, username, hashedPassword, email, phone_number, user_type]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone_number, is_active } = req.body;
  try {
    await db.execute(
      'UPDATE userprofile SET full_name = ?, email = ?, phone_number = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [full_name, email, phone_number, is_active, id]
    );
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM userprofile WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
};
