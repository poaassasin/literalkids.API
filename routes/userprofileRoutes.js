// routes/userprofileRoutes.js
const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
} = require('../controllers/UserProfileController');

const { verifyToken, validateUserProfile } = require('../middleware/authMiddleware');

// GET semua user
router.get('/', verifyToken, getAllUsers);

// GET user berdasarkan ID
router.get('/:id', verifyToken, getUserById);

// POST register user baru
router.post('/', verifyToken, validateUserProfile, registerUser);

// PUT update user berdasarkan ID
router.put('/:id', verifyToken, validateUserProfile, updateUser);

// DELETE user berdasarkan ID
router.delete('/:id', verifyToken, deleteUser);

module.exports = router;
