const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/LeaderboardController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/leaderboard', leaderboardController.getLeaderboardUsers);

module.exports = router;
