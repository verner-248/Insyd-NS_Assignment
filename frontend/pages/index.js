import { useState, useEffect } from 'react';
import { 
  Bell, 
  Users, 
  FileText, 
  Plus,
  RefreshCw,
  Settings,
  Search,
  Filter
} from 'lucide-react';
import NotificationCard from '../components/NotificationCard';
import UserCard from '../components/UserCard';
import PostCard from '../components/PostCard';
import { notificationAPI, userAPI, postAPI, eventAPI } from '../lib/api';
import toast from 'react-hot-toast';

export default function Home() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ totalUnread: 0 });
  const [filters, setFilters] = useState({
    type: '',
    unreadOnly: false
  });
  const [newPost, setNewPost] = useState({
    content: '',
    tags: ''
  });
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  useEffect(() => {
    // Load initial data
    loadUsers();
    loadPosts();
  }, []);

  const loadNotifications = async (userId) => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // Filter out empty type parameter to avoid backend validation errors
      const requestParams = { ...filters };
      if (!requestParams.type || requestParams.type === '') {
        delete requestParams.type;
      }
      
      const data = await notificationAPI.getNotifications(userId, requestParams);
      setNotifications(data.notifications || []);
      setStats({ totalUnread: data.unreadCount || 0 });
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast.error('Failed to load notifications');
      setNotifications([]);
      setStats({ totalUnread: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userAPI.getUsers();
      setUsers(data.users || []);
      // Set first user as default if no user is selected
      if (data.users && data.users.length > 0 && !currentUserId) {
        setCurrentUserId(data.users[0]._id);
        loadNotifications(data.users[0]._id);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    // Refresh user data to get updated following status
    await loadUsers();
  };

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await postAPI.getPosts();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      toast.error('Failed to load posts');
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationUpdate = (updatedNotification) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif._id === updatedNotification._id ? updatedNotification : notif
      )
    );
    if (updatedNotification.isRead) {
      setStats(prev => ({ ...prev, totalUnread: Math.max(0, prev.totalUnread - 1) }));
    }
  };

  const handleNotificationDelete = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!currentUserId || !newPost.content.trim()) return;

    try {
      const tags = newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const result = await eventAPI.createPost(currentUserId, newPost.content, [], tags);
      
      toast.success('Post created successfully!');
      setNewPost({ content: '', tags: '' });
      setShowNewPostForm(false);
      
      // Reload posts to get the new post
      loadPosts();
      
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!currentUserId) return;
    
    try {
      await notificationAPI.markAllAsRead(currentUserId);
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setStats(prev => ({ ...prev, totalUnread: 0 }));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell, count: stats.totalUnread },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'posts', label: 'Posts', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Insyd Notifications</h1>
              
              {/* User selector */}
              <select
                value={currentUserId}
                onChange={(e) => {
                  setCurrentUserId(e.target.value);
                  if (e.target.value) {
                    loadNotifications(e.target.value);
                  }
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (activeTab === 'notifications') loadNotifications(currentUserId);
                  else if (activeTab === 'users') loadUsers();
                  else if (activeTab === 'posts') loadPosts();
                }}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors
                    ${activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                  {tab.count > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowNewPostForm(true)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Post</span>
                </button>
                {activeTab === 'notifications' && stats.totalUnread > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Mark All Read</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filters */}
            {activeTab === 'notifications' && (
              <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filters:</span>
                  </div>
                  
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Types</option>
                    <option value="like">Likes</option>
                    <option value="comment">Comments</option>
                    <option value="follow">Follows</option>
                    <option value="post">Posts</option>
                    <option value="trending">Trending</option>
                  </select>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.unreadOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, unreadOnly: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Unread only</span>
                  </label>
                  
                  <button
                    onClick={() => loadNotifications(currentUserId)}
                    className="px-3 py-1.5 bg-primary-500 text-white rounded-md text-sm hover:bg-primary-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="space-y-4">
              {activeTab === 'notifications' && (
                <>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : notifications.length > 0 ? (
                    notifications.map(notification => (
                      <NotificationCard
                        key={notification._id}
                        notification={notification}
                        onUpdate={handleNotificationUpdate}
                        onDelete={handleNotificationDelete}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                      <p className="text-gray-500">
                        {currentUserId 
                          ? "You're all caught up! No new notifications."
                          : "Please select a user to view notifications."
                        }
                      </p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'users' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map(user => (
                    <UserCard
                      key={user._id}
                      user={user}
                      currentUserId={currentUserId}
                      onUpdate={async (userId, isFollowing) => {
                        // Update user in local state
                        setUsers(prev => prev.map(u => 
                          u._id === userId 
                            ? { 
                                ...u, 
                                followers: isFollowing 
                                  ? [...(u.followers || []), currentUserId]
                                  : (u.followers || []).filter(id => id !== currentUserId),
                                followerCount: isFollowing 
                                  ? (u.followerCount || u.followers?.length || 0) + 1
                                  : Math.max(0, (u.followerCount || u.followers?.length || 0) - 1)
                              }
                            : u
                        ));
                        
                        // Refresh user data to ensure consistency
                        setTimeout(() => {
                          refreshUserData();
                        }, 500);
                      }}
                    />
                  ))}
                </div>
              )}

              {activeTab === 'posts' && (
                <div className="space-y-6">
                  {posts.map(post => (
                    <PostCard
                      key={post._id}
                      post={post}
                      currentUserId={currentUserId}
                      onUpdate={(postId, action, data) => {
                        // Update post in local state
                        setPosts(prev => prev.map(p => {
                          if (p._id === postId) {
                            if (action === 'like') {
                              return {
                                ...p,
                                likes: data 
                                  ? [...(p.likes || []), { _id: currentUserId }]
                                  : (p.likes || []).filter(like => like._id !== currentUserId)
                              };
                            } else if (action === 'comment') {
                              return {
                                ...p,
                                comments: [...(p.comments || []), data]
                              };
                            }
                          }
                          return p;
                        }));
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Post</h3>
            
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="What's on your mind?"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newPost.tags}
                  onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="architecture, design, modern"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={!newPost.content.trim()}
                  className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPostForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}