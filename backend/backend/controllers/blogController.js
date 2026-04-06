const asyncHandler = require('../middleware/asyncHandler');
const { BlogPost, Category, Tag } = require('../models');

exports.getBlogPosts = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  let query = { status: 'published' };
  if (search) query.$text = { $search: search };
  const skip = (page - 1) * limit;
  const posts = await BlogPost.find(query)
    .populate('author', 'firstName lastName')
    .populate('category', 'name slug')
    .populate('tags', 'name slug')
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  const total = await BlogPost.countDocuments(query);
  res.json({ success: true, posts, total, page: parseInt(page), pages: Math.ceil(total / limit) });
});

exports.getBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' })
    .populate('author', 'firstName lastName')
    .populate('category', 'name slug')
    .populate('tags', 'name slug');
  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }
  post.viewCount += 1;
  await post.save();
  res.json({ success: true, post });
});

exports.getFeaturedPosts = asyncHandler(async (req, res) => {
  const posts = await BlogPost.find({ status: 'published', isFeatured: true })
    .populate('author category')
    .limit(6);
  res.json({ success: true, posts });
});

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ success: true, categories });
});

exports.getTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find().sort({ name: 1 });
  res.json({ success: true, tags });
});
