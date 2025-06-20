const express = require('express');
const router = express.Router();
const {
  getHomepageUser,
  createHomepageUser,
  updateHomepageUser
} = require('../controllers/HomepageController');

router.get('/:id', getHomepageUser);
router.post('/', createHomepageUser);
router.put('/:id', updateHomepageUser);

module.exports = router;
