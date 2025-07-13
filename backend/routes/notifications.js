const express = require('express');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
  type: Joi.string().valid('like', 'comment', 'follow', 'post', 'mention', 'trending').allow('').optional(),
  unreadOnly: Joi.boolean().default(false)
});

// GET /notifications/:userId - Fetch notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { error, value } = paginationSchema.validate(req.query);
    
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const { page, limit, type, unreadOnly } = value;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { toUserId: userId };
    if (type) query.type = type;
    if (unreadOnly) query.isRead = false;
    
    // Fetch notifications with pagination
    const notifications = await Notification.find(query)
      .populate('fromUserId', 'username avatar')
      .populate('postId', 'content images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      toUserId: userId, 
      isRead: false 
    });
    
    res.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// PATCH /notifications/:notificationId/read - Mark notification as read
router.patch('/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({ 
      message: 'Notification marked as read',
      notification 
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

// PATCH /notifications/:userId/read-all - Mark all notifications as read
router.patch('/:userId/read-all', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await Notification.updateMany(
      { toUserId: userId, isRead: false },
      { isRead: true }
    );
    
    res.json({ 
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Failed to update notifications' });
  }
});

// DELETE /notifications/:notificationId - Delete a notification
router.delete('/:notificationId', async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndDelete(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
});

// GET /notifications/:userId/stats - Get notification statistics
router.get('/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const stats = await Notification.aggregate([
      { $match: { toUserId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          unreadCount: {
            $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
          }
        }
      }
    ]);
    
    const totalUnread = await Notification.countDocuments({
      toUserId: userId,
      isRead: false
    });
    
    res.json({
      stats,
      totalUnread
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({ message: 'Failed to fetch notification stats' });
  }
});

module.exports = router;