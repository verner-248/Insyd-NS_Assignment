import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  FileText, 
  TrendingUp,
  Check,
  X,
  MoreHorizontal
} from 'lucide-react';
import { notificationAPI } from '../lib/api';
import toast from 'react-hot-toast';

const NotificationCard = ({ notification, onUpdate, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const getIcon = (type) => {
    const iconProps = { className: "w-5 h-5" };
    
    switch (type) {
      case 'like':
        return <Heart {...iconProps} className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle {...iconProps} className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus {...iconProps} className="w-5 h-5 text-green-500" />;
      case 'post':
        return <FileText {...iconProps} className="w-5 h-5 text-purple-500" />;
      case 'trending':
        return <TrendingUp {...iconProps} className="w-5 h-5 text-orange-500" />;
      default:
        return <FileText {...iconProps} className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'like':
        return 'bg-red-50 border-red-200';
      case 'comment':
        return 'bg-blue-50 border-blue-200';
      case 'follow':
        return 'bg-green-50 border-green-200';
      case 'post':
        return 'bg-purple-50 border-purple-200';
      case 'trending':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleMarkAsRead = async () => {
    if (notification.isRead) return;
    
    setIsLoading(true);
    try {
      await notificationAPI.markAsRead(notification._id);
      onUpdate({ ...notification, isRead: true });
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await notificationAPI.deleteNotification(notification._id);
      onDelete(notification._id);
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };

  return (
    <div 
      className={`
        relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md
        ${notification.isRead ? 'bg-white border-gray-200' : getTypeColor(notification.type)}
        ${isLoading ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full"></div>
      )}

      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {getIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* User info */}
              {notification.fromUserId && (
                <div className="flex items-center space-x-2 mb-1">
                  <img
                    src={notification.fromUserId.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`}
                    alt={notification.fromUserId.username}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {notification.fromUserId.username}
                  </span>
                </div>
              )}

              {/* Message */}
              <p className="text-sm text-gray-700 mb-2">
                {notification.message}
              </p>

              {/* Post preview */}
              {notification.postId && (
                <div className="bg-white bg-opacity-50 rounded p-2 mb-2">
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {notification.postId.content}
                  </p>
                  {notification.postId.images && notification.postId.images.length > 0 && (
                    <div className="mt-1">
                      <img
                        src={notification.postId.images[0]}
                        alt="Post"
                        className="w-12 h-12 rounded object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Time and priority */}
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{formatTime(notification.createdAt)}</span>
                {notification.priority === 'high' && (
                  <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                    High
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>

              {showActions && (
                <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border py-1 z-10 min-w-[120px]">
                  {!notification.isRead && (
                    <button
                      onClick={handleMarkAsRead}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark as read</span>
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                  >
                    <X className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click to mark as read */}
      {!notification.isRead && (
        <button
          onClick={handleMarkAsRead}
          className="absolute inset-0 w-full h-full bg-transparent"
          aria-label="Mark as read"
        />
      )}
    </div>
  );
};

export default NotificationCard;