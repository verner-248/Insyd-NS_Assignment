const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const Joi = require('joi');

const router = express.Router();

// Validation schema
const postSchema = Joi.object({
  authorId: Joi.string().required(),
  content: Joi.string().required().max(2000),
  images: Joi.array().items(Joi.string()),
  tags: Joi.array().items(Joi.string()),
  isPublic: Joi.boolean().default(true)
});

// GET /posts - Get all posts with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const authorId = req.query.authorId;
    
    const query = authorId ? { authorId } : {};
    
    const posts = await Post.find(query)
      .populate('authorId', 'username avatar')
      .populate('likes', 'username avatar')
      .populate('comments.userId', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Post.countDocuments(query);
    
    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// GET /posts/:id - Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'username avatar bio')
      .populate('likes', 'username avatar')
      .populate('comments.userId', 'username avatar');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Increment view count
    post.viewCount += 1;
    await post.save();
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

// POST /posts - Create new post
router.post('/', async (req, res) => {
  try {
    const { error, value } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    // Verify author exists
    const author = await User.findById(value.authorId);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    
    const post = new Post(value);
    await post.save();
    
    // Populate author info
    await post.populate('authorId', 'username avatar');
    
    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// PUT /posts/:id - Update post
router.put('/:id', async (req, res) => {
  try {
    const { error, value } = postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    ).populate('authorId', 'username avatar');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Failed to update post' });
  }
});

// DELETE /posts/:id - Delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
});

// GET /posts/trending - Get trending posts
router.get('/trending', async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $addFields: {
          engagementScore: {
            $add: [
              { $size: '$likes' },
              { $multiply: [{ $size: '$comments' }, 2] },
              { $divide: ['$viewCount', 10] }
            ]
          }
        }
      },
      { $sort: { engagementScore: -1, createdAt: -1 } },
      { $limit: 20 }
    ]);
    
    // Populate author info
    await Post.populate(posts, { path: 'authorId', select: 'username avatar' });
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    res.status(500).json({ message: 'Failed to fetch trending posts' });
  }
});

module.exports = router;