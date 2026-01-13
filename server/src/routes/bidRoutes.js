const express = require('express');
const bidController = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, bidController.createBid);
router.get('/:gigId', protect, bidController.getBidsForGig);
router.patch('/:bidId/hire', protect, bidController.hireFreelancer);

module.exports = router;
