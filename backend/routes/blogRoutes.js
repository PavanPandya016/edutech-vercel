const express = require('express');
const router = express.Router();
const { getBlogPosts, getBlogPost, getFeaturedPosts, getCategories, getTags } = require('../controllers/blogController');

router.get('/', getBlogPosts);
router.get('/featured', getFeaturedPosts);
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/:slug', getBlogPost);

module.exports = router;
