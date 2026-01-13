const express = require('express');
const gigController = require('../controllers/gigController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', gigController.getAllGigs);
router.get('/:id', gigController.getGig);
router.post('/', protect, gigController.createGig);

module.exports = router;
