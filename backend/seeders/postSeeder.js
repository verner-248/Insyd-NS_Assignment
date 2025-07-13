const Post = require('../models/Post');
const mongoose = require('mongoose');

const samplePosts = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439021'), // p1
    authorId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // alice_architect
    content: 'Just finished designing a sustainable office complex with integrated green spaces. The future of architecture is eco-friendly! 🌱',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop'],
    tags: ['sustainable', 'office', 'green'],
    likes: [],
    comments: [],
    viewCount: 45,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439022'), // p2
    authorId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'), // bob_builder
    content: 'New construction techniques using recycled materials. Innovation meets sustainability in modern building practices.',
    images: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop'],
    tags: ['construction', 'recycled', 'innovation'],
    likes: [],
    comments: [],
    viewCount: 32,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439023'), // p3
    authorId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'), // carol_designer
    content: 'Exploring minimalist interior design principles. Less is more when it comes to creating peaceful living spaces.',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'],
    tags: ['interior', 'minimalist', 'design'],
    likes: [],
    comments: [],
    viewCount: 28,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439024'), // p4
    authorId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439014'), // david_engineer
    content: 'Structural analysis of modern skyscrapers. The engineering behind these architectural marvels is fascinating.',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop'],
    tags: ['engineering', 'skyscraper', 'structural'],
    likes: [],
    comments: [],
    viewCount: 19,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
  }
];

const seedPosts = async () => {
  try {
    // Clear existing posts
    await Post.deleteMany({});
    
    // Insert sample posts
    const createdPosts = await Post.insertMany(samplePosts);
    
    console.log(`✅ Seeded ${createdPosts.length} posts successfully`);
    return createdPosts;
  } catch (error) {
    console.error('❌ Error seeding posts:', error);
    throw error;
  }
};

module.exports = { seedPosts, samplePosts }; 