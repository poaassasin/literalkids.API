const express = require('express');
const router = express.Router();
const { createOnboardingProfile } = require('../controllers/OnBoardingController');
const { validateOnboarding } = require('../middleware/authMiddleware');

router.post('/', validateOnboarding, createOnboardingProfile);

module.exports = router;
