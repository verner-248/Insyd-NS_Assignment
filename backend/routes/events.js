const express = require('express');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Post = require('../models/Post');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const likeEventSchema = Joi.object({
  fromUserId: Joi.string().required(),
  postId: Joi.string().required()
});

const followEventSchema = Joi.object({
  fromUserId: Joi.string().required(),
  toUserId: Joi.string().required()
});

const commentEventSchema = Joi.object({
  fromUserId: Joi.string().required(),
  postId: Joi.string().required(),
  comment: Joi.string().required().max(1000)
});

const postEventSchema = Joi.object({
  authorId: Joi.string().required(),
  content: Joi.string().required().max(2000),
  images: Joi.array().items(Joi.string()),
  tags: Joi.array().items(Joi.string())
});

// POST /events/like - Handle like event
router.post('/like', async (req, res) => {
  try {
    const { error, value } = likeEventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const { fromUserId, postId } = value;
    
    // Find the post and its author
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if already liked
    const alreadyLiked = post.likes.includes(fromUserId);
    if (alreadyLiked) {
      // Unlike the post
      post.likes = post.likes.filter(id => id.toString() !== fromUserId);
      await post.save();
      return res.json({ 
        message: 'Post unliked',
        liked: false
      });
    }
    
    // Add like to post
    post.likes.push(fromUserId);
    await post.save();
    
    // Only create notification if user is not liking their own post
    if (post.authorId.toString() !== fromUserId) {
      await Notification.createNotification({
        toUserId: post.authorId,
        fromUserId,
        type: 'like',
        postId
      });
      
      res.json({ 
        message: 'Post liked and notification sent to author',
        liked: true
      });
    } else {
      res.json({ 
        message: 'Post liked (no notification for self-likes)',
        liked: true
      });
    }
  } catch (error) {
    console.error('Error handling like event:', error);
    res.status(500).json({ message: 'Failed to process like event' });
  }
});

// POST /events/follow - Handle follow event
router.post('/follow', async (req, res) => {
  try {
    const { error, value } = followEventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const { fromUserId, toUserId } = value;
    
    // Can't follow yourself
    if (fromUserId === toUserId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }
    
    // Find both users
    const [fromUser, toUser] = await Promise.all([
      User.findById(fromUserId),
      User.findById(toUserId)
    ]);
    
    if (!fromUser || !toUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already following
    const alreadyFollowing = fromUser.following.includes(toUserId);
    if (alreadyFollowing) {
      // Unfollow
      fromUser.following = fromUser.following.filter(id => id.toString() !== toUserId);
      toUser.followers = toUser.followers.filter(id => id.toString() !== fromUserId);
      
      await Promise.all([fromUser.save(), toUser.save()]);
      
      return res.json({ 
        message: 'Unfollowed successfully',
        following: false
      });
    }
    
    // Add follow relationship
    fromUser.following.push(toUserId);
    toUser.followers.push(fromUserId);
    
    await Promise.all([fromUser.save(), toUser.save()]);
    
    // Create notification
    await Notification.createNotification({
      toUserId,
      fromUserId,
      type: 'follow'
    });
    
    res.json({ 
      message: 'Follow notification generated',
      following: true
    });
  } catch (error) {
    console.error('Error handling follow event:', error);
    res.status(500).json({ message: 'Failed to process follow event' });
  }
});

// POST /events/comment - Handle comment event
router.post('/comment', async (req, res) => {
  try {
    const { error, value } = commentEventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const { fromUserId, postId, comment } = value;
    
    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Add comment to post
    post.comments.push({
      userId: fromUserId,
      comment,
      createdAt: new Date()
    });
    
    await post.save();
    
    // Don't notify if user comments on their own post
    if (post.authorId.toString() !== fromUserId) {
      // Create notification for post author
      await Notification.createNotification({
        toUserId: post.authorId,
        fromUserId,
        type: 'comment',
        postId
      });
    }
    
    res.json({ 
      message: 'Comment added and notification sent',
      comment: post.comments[post.comments.length - 1]
    });
  } catch (error) {
    console.error('Error handling comment event:', error);
    res.status(500).json({ message: 'Failed to process comment event' });
  }
});

// POST /events/post - Handle new post event
router.post('/post', async (req, res) => {
  try {
    const { error, value } = postEventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const { authorId, content, images = [], tags = [] } = value;
    
    // Create the post
    const post = new Post({
      authorId,
      content,
      images,
      tags
    });
    
    await post.save();
    
    // Get author's followers
    const author = await User.findById(authorId).populate('followers');
    
    // Create notifications for all followers
    const notificationPromises = author.followers.map(follower => 
      Notification.createNotification({
        toUserId: follower._id,
        fromUserId: authorId,
        type: 'post',
        postId: post._id
      })
    );
    
    await Promise.all(notificationPromises);
    
    res.json({ 
      message: `Post created and ${author.followers.length} notifications sent`,
      post: {
        _id: post._id,
        content: post.content,
        authorId: post.authorId,
        createdAt: post.createdAt
      }
    });
  } catch (error) {
    console.error('Error handling post event:', error);
    res.status(500).json({ message: 'Failed to process post event' });
  }
});

// POST /events/trending - Handle trending post notification
router.post('/trending', async (req, res) => {
  try {
    const { postId, threshold = 100 } = req.body;
    
    const post = await Post.findById(postId).populate('authorId');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if post meets trending criteria
    const engagementScore = post.likes.length + post.comments.length * 2;
    
    if (engagementScore >= threshold) {
      // Get users who might be interested (followers of author + users with similar interests)
      const interestedUsers = await User.find({
        _id: { $ne: post.authorId },
        $or: [
          { following: post.authorId },
          { interests: { $in: post.tags } }
        ]
      }).limit(1000);
      
      // Create trending notifications
      const notificationPromises = interestedUsers.map(user => 
        Notification.createNotification({
          toUserId: user._id,
          fromUserId: post.authorId,
          type: 'trending',
          postId: post._id,
          customMessage: `Trending: ${post.authorId.username}'s post is getting lots of attention!`
        })
      );
      
      await Promise.all(notificationPromises);
      
      res.json({ 
        message: `Trending notifications sent to ${interestedUsers.length} users`,
        engagementScore
      });
    } else {
      res.json({ 
        message: 'Post does not meet trending criteria',
        engagementScore,
        threshold
      });
    }
  } catch (error) {
    console.error('Error handling trending event:', error);
    res.status(500).json({ message: 'Failed to process trending event' });
  }
});

module.exports = router;