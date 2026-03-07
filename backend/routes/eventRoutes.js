const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getEvents, getEvent, registerEvent, getMyEvents, getFeaturedEvents } = require('../controllers/eventController');

router.get('/', getEvents);
router.get('/featured', getFeaturedEvents);
router.get('/my/events', protect, getMyEvents);
router.get('/:id', getEvent);
router.post('/:id/register', protect, registerEvent);

module.exports = router;
