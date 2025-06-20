const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

const {
  getShelves,
  addStoryToShelf,
  createNewShelf
} = require('../controllers/LibraryController');

router.get('/', verifyToken, getShelves);
router.post('/add-story', verifyToken, addStoryToShelf);
router.post('/create', verifyToken, createNewShelf);

module.exports = router;
