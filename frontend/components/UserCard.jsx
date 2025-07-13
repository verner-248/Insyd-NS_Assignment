import { useState } from 'react';
import { Users, UserPlus, UserMinus } from 'lucide-react';
import { eventAPI } from '../lib/api';
import toast from 'react-hot-toast';

const UserCard = ({ user, currentUserId, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(
    user.followers?.includes(currentUserId) || false
  );

  const handleFollow = async () => {
    if (!currentUserId || currentUserId === user._id) return;
    
    setIsLoading(true);
    try {
      const result = await eventAPI.followUser(currentUserId, user._id);
      
      // Update local state based on the response
      const newFollowingState = result.following !== undefined ? result.following : !isFollowing;
      setIsFollowing(newFollowingState);
      
      if (newFollowingState) {
        toast.success(`Now following ${user.username}`);
      } else {
        toast.success(`Unfollowed ${user.username}`);
      }
      
      if (onUpdate) {
        onUpdate(user._id, newFollowingState);
      }
    } catch (error) {
      console.error('Follow error:', error);
      toast.error('Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <img
          src={user.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face`}
          alt={user.username}
          className="w-12 h-12 rounded-full object-cover"
        />

        {/* User info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {user.username}
          </h3>
          {user.bio && (
            <p className="text-xs text-gray-500 truncate">
              {user.bio}
            </p>
          )}
          
          {/* Stats */}
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Users className="w-3 h-3" />
              <span>{user.followerCount || user.followers?.length || 0} followers</span>
            </div>
          </div>
        </div>

        {/* Follow button */}
        {currentUserId && currentUserId !== user._id && (
          <button
            onClick={handleFollow}
            disabled={isLoading}
            className={`
              px-3 py-1.5 rounded-md text-xs font-medium transition-colors
              ${isFollowing
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-primary-500 text-white hover:bg-primary-600'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isFollowing ? (
              <div className="flex items-center space-x-1">
                <UserMinus className="w-3 h-3" />
                <span>Unfollow</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <UserPlus className="w-3 h-3" />
                <span>Follow</span>
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;