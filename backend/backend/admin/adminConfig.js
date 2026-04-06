const express = require('express');
const router = express.Router();
const { User, Course, Event, BlogPost, Category, Tag } = require('../models');

// Admin authentication
const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No credentials provided' });
  }
  
  const [email, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

// Dashboard
router.get('/', adminAuth, async (req, res) => {
  const stats = {
    users: await User.countDocuments(),
    courses: await Course.countDocuments(),
    events: await Event.countDocuments(),
    posts: await BlogPost.countDocuments(),
  };
  res.json({ 
    message: 'EduTech Admin API',
    stats,
    endpoints: {
      users: '/admin/users',
      courses: '/admin/courses',
      events: '/admin/events',
      blog: '/admin/posts'
    }
  });
});

// USERS
router.get('/users', adminAuth, async (req, res) => {
  const users = await User.find().select('-password').limit(100);
  res.json({ count: users.length, users });
});

router.post('/users', adminAuth, async (req, res) => {
  const user = await User.create(req.body);
  res.json({ success: true, user: user.getPublicProfile() });
});

router.put('/users/:id', adminAuth, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  res.json({ success: true, user });
});

router.delete('/users/:id', adminAuth, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});

// COURSES
router.get('/courses', adminAuth, async (req, res) => {
  const courses = await Course.find().limit(100);
  res.json({ count: courses.length, courses });
});

router.post('/courses', adminAuth, async (req, res) => {
  const course = await Course.create(req.body);
  res.json({ success: true, course });
});

router.put('/courses/:id', adminAuth, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, course });
});

router.delete('/courses/:id', adminAuth, async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Course deleted' });
});

// EVENTS
router.get('/events', adminAuth, async (req, res) => {
  const events = await Event.find().limit(100);
  res.json({ count: events.length, events });
});

router.post('/events', adminAuth, async (req, res) => {
  const event = await Event.create(req.body);
  res.json({ success: true, event });
});

router.put('/events/:id', adminAuth, async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, event });
});

router.delete('/events/:id', adminAuth, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Event deleted' });
});

// BLOG POSTS
router.get('/posts', adminAuth, async (req, res) => {
  const posts = await BlogPost.find().populate('author category tags').limit(100);
  res.json({ count: posts.length, posts });
});

router.post('/posts', adminAuth, async (req, res) => {
  const post = await BlogPost.create(req.body);
  res.json({ success: true, post });
});

router.put('/posts/:id', adminAuth, async (req, res) => {
  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, post });
});

router.delete('/posts/:id', adminAuth, async (req, res) => {
  await BlogPost.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Post deleted' });
});

module.exports = router;