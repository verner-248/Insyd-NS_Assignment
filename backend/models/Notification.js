const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'follow', 'post', 'mention', 'trending'],
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
notificationSchema.index({ toUserId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ toUserId: 1, type: 1 });
notificationSchema.index({ fromUserId: 1 });
notificationSchema.index({ postId: 1 });
notificationSchema.index({ createdAt: -1 });

// TTL index to automatically delete old notifications (30 days)
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

// Static method to create notification with AI enhancement
notificationSchema.statics.createNotification = async function(data) {
  const { toUserId, fromUserId, type, postId, customMessage } = data;
  
  // Get user details for personalized message
  const fromUser = await mongoose.model('User').findById(fromUserId);
  const toUser = await mongoose.model('User').findById(toUserId);
  
  let message = customMessage;
  
  if (!message) {
    // Generate default message based on type
    switch (type) {
      case 'like':
        message = `${fromUser.username} liked your post`;
        break;
      case 'comment':
        message = `${fromUser.username} commented on your post`;
        break;
      case 'follow':
        message = `${fromUser.username} started following you`;
        break;
      case 'post':
        message = `${fromUser.username} shared a new post`;
        break;
      default:
        message = `${fromUser.username} interacted with your content`;
    }
  }
  
  // Check if similar notification exists (prevent spam)
  const existingNotification = await this.findOne({
    toUserId,
    fromUserId,
    type,
    postId,
    createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Within last hour
  });
  
  if (existingNotification) {
    return existingNotification;
  }
  
  return this.create({
    toUserId,
    fromUserId,
    type,
    postId,
    message,
    priority: type === 'follow' ? 'high' : 'medium'
  });
};

module.exports = mongoose.model('Notification', notificationSchema);