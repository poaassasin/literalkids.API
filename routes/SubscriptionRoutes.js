const express = require('express');
const router = express.Router();
const {
  getPlans,
  getReferralCode,
  getActivePlan,
  subscribeToPlan,
  unsubscribe
} = require('../controllers/SubscriptionController');

const { verifyToken } = require('../middleware/authMiddleware');

router.get('/plans', getPlans);
router.get('/referral', getReferralCode);
router.get('/active', verifyToken, getActivePlan);
router.post('/subscribe', verifyToken, subscribeToPlan);
router.post('/unsubscribe', verifyToken, unsubscribe);

module.exports = router;
