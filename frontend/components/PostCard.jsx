import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye,
  TrendingUp,
  Send
} from 'lucide-react';
import { eventAPI } from '../lib/api';
import toast from 'react-hot-toast';

const PostCard = ({ post, currentUserId, onUpdate }) => {
  const [isLiked, setIsLiked] = useState(() => {
    if (!currentUserId || !post.likes) return false;
    // Check if current user is in the likes array (handles both string IDs and object IDs)
    return post.likes.some(like => {
      const likeId = typeof like === 'string' ? like : like._id;
      return likeId === currentUserId;
    });
  });
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update like state when currentUserId changes
  useEffect(() => {
    if (!currentUserId || !post.likes) {
      setIsLiked(false);
      return;
    }
    
    const liked = post.likes.some(like => {
      const likeId = typeof like === 'string' ? like : like._id;
      return likeId === currentUserId;
    });
    setIsLiked(liked);
  }, [currentUserId, post.likes]);

  const handleLike = async () => {
    if (!currentUserId) {
      toast.error('Please select a user first');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await eventAPI.likePost(currentUserId, post._id);
      
      if (result.liked) {
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        toast.success('Post liked!');
      } else {
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
        toast.success('Post unliked');
      }
      
      if (onUpdate) {
        onUpdate(post._id, 'like', result.liked);
      }
    } catch (error) {
      toast.error('Failed to like post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!currentUserId || !comment.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await eventAPI.commentOnPost(currentUserId, post._id, comment.trim());
      toast.success('Comment added!');
      setComment('');
      setShowCommentForm(false);
      
      if (onUpdate) {
        onUpdate(post._id, 'comment', result.comment);
      }
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrending = async () => {
    try {
      const result = await eventAPI.triggerTrending(post._id);
      toast.success(result.message);
    } catch (error) {
      toast.error('Failed to trigger trending');
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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <img
            src={post.authorId?.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`}
            alt={post.authorId?.username || 'User'}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">
              {post.authorId?.username || 'Unknown User'}
            </h3>
            <p className="text-xs text-gray-500">
              {formatTime(post.createdAt)}
            </p>
          </div>
          
          {/* Trending button */}
          <button
            onClick={handleTrending}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Trigger trending"
          >
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-800 mb-3 whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {post.images.slice(0, 4).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{post.viewCount || 0} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="w-3 h-3" />
            <span>{likeCount} likes</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-3 h-3" />
            <span>{post.comments?.length || 0} comments</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={isLoading}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isLiked 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{isLiked ? 'Liked' : 'Like'}</span>
          </button>

          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Comment</span>
          </button>

          <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Comment form */}
        {showCommentForm && (
          <form onSubmit={handleComment} className="mt-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!comment.trim() || isLoading}
                className="px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Comments */}
      {post.comments && post.comments.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 max-h-40 overflow-y-auto">
          {post.comments.slice(-3).map((comment, index) => (
            <div key={index} className="flex space-x-2 mb-2 last:mb-0">
              <img
                src={comment.userId?.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face`}
                alt={comment.userId?.username || 'User'}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-xs font-medium text-gray-900">
                    {comment.userId?.username || 'Unknown User'}
                  </p>
                  <p className="text-sm text-gray-700">
                    {comment.comment}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(comment.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;