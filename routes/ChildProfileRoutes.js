const express = require('express');
const router = express.Router();

const {
  getAllChildProfiles,
  getChildProfileById,
  createChildProfile,
  updateChildProfile,
  deleteChildProfile,
  updateBirthdateOnly, 
} = require('../controllers/ChildProfileController');


router.get('/', getAllChildProfiles);
router.get('/:id', getChildProfileById);
router.post('/', createChildProfile);
router.put('/:id', updateChildProfile);
router.delete('/:id', deleteChildProfile);
router.patch('/:id/birthdate', updateBirthdateOnly);


module.exports = router;
