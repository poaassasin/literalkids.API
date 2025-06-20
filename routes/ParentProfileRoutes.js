const express = require('express');
const router = express.Router();

const {
  getAllParentProfiles,
  getParentProfileById,
  createParentProfile,
  updateParentProfile,
  deleteParentProfile,
} = require('../controllers/ParentProfileController');

const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/', authMiddleware.verifyToken, getAllParentProfiles);
router.get('/:id', authMiddleware.verifyToken, getParentProfileById);
router.post('/', authMiddleware.verifyToken, createParentProfile);
router.put('/:id', authMiddleware.verifyToken, updateParentProfile);
router.delete('/:id', authMiddleware.verifyToken, deleteParentProfile);


module.exports = router;
