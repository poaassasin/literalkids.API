const express = require('express');
const router = express.Router();
const {
  getAllGenres,
  getStoriesByGenre,
  getStoryById,
} = require('../controllers/SearchController');

const {
  verifyToken,
  validateGetAllGenres,
  validateGetStoriesByGenre,
  validateGetStory
} = require('../middleware/authMiddleware');

router.get('/genres', verifyToken, validateGetAllGenres, getAllGenres);
router.get('/stories/genre/:genre_id', verifyToken, validateGetStoriesByGenre, getStoriesByGenre);
router.get('/stories/:id', verifyToken, validateGetStory, getStoryById);

module.exports = router;
