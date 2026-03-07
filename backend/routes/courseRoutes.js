const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCourses, getCourse, enrollCourse, getMyCourses, getFeaturedCourses } = require('../controllers/courseController');

router.get('/', getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/my/courses', protect, getMyCourses);
router.get('/:id', getCourse);
router.post('/:id/enroll', protect, enrollCourse);

module.exports = router;