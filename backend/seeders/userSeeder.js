const User = require('../models/User');
const mongoose = require('mongoose');

const sampleUsers = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // u1
    username: 'alice_architect',
    email: 'alice@insyd.com',
    bio: 'Modern architecture enthusiast',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    followers: [],
    following: [],
    notificationSettings: {
      likes: true,
      comments: true,
      follows: true,
      posts: true
    }
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'), // u2
    username: 'bob_builder',
    email: 'bob@insyd.com',
    bio: 'Sustainable building expert',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    followers: [],
    following: [],
    notificationSettings: {
      likes: true,
      comments: true,
      follows: true,
      posts: true
    }
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'), // u3
    username: 'carol_designer',
    email: 'carol@insyd.com',
    bio: 'Interior design specialist',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    followers: [],
    following: [],
    notificationSettings: {
      likes: true,
      comments: true,
      follows: true,
      posts: true
    }
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439014'), // u4
    username: 'david_engineer',
    email: 'david@insyd.com',
    bio: 'Structural engineering pro',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    followers: [],
    following: [],
    notificationSettings: {
      likes: true,
      comments: true,
      follows: true,
      posts: true
    }
  }
];

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    
    // Insert sample users
    const createdUsers = await User.insertMany(sampleUsers);
    
    console.log(`✅ Seeded ${createdUsers.length} users successfully`);
    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

module.exports = { seedUsers, sampleUsers }; 