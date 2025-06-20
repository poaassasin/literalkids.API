const express = require('express');
const router = express.Router();
const avatarController = require('../controllers/AvatarController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', avatarController.getAllAvatars);
router.post('/purchase', verifyToken, avatarController.purchaseAvatar);
router.post('/update', verifyToken, avatarController.updateAvatar);

module.exports = router;
