import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions
export const notificationAPI = {
  // Get notifications for a user
  getNotifications: async (userId, params = {}) => {
    const response = await api.get(`/notifications/${userId}`, { params });
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (userId) => {
    const response = await api.patch(`/notifications/${userId}/read-all`);
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Get notification stats
  getStats: async (userId) => {
    const response = await api.get(`/notifications/${userId}/stats`);
    return response.data;
  },
};

export const eventAPI = {
  // Like a post
  likePost: async (fromUserId, postId) => {
    const response = await api.post('/events/like', { fromUserId, postId });
    return response.data;
  },

  // Follow a user
  followUser: async (fromUserId, toUserId) => {
    const response = await api.post('/events/follow', { fromUserId, toUserId });
    return response.data;
  },

  // Comment on a post
  commentOnPost: async (fromUserId, postId, comment) => {
    const response = await api.post('/events/comment', { fromUserId, postId, comment });
    return response.data;
  },

  // Create a new post
  createPost: async (authorId, content, images = [], tags = []) => {
    const response = await api.post('/events/post', { authorId, content, images, tags });
    return response.data;
  },

  // Trigger trending notification
  triggerTrending: async (postId, threshold = 100) => {
    const response = await api.post('/events/trending', { postId, threshold });
    return response.data;
  },
};

export const userAPI = {
  // Get all users
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get user by ID
  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // Get followers
  getFollowers: async (userId) => {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data;
  },

  // Get following
  getFollowing: async (userId) => {
    const response = await api.get(`/users/${userId}/following`);
    return response.data;
  },
};

export const postAPI = {
  // Get all posts
  getPosts: async (params = {}) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  // Get post by ID
  getPost: async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  // Create new post
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Update post
  updatePost: async (postId, postData) => {
    const response = await api.put(`/posts/${postId}`, postData);
    return response.data;
  },

  // Delete post
  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  // Get trending posts
  getTrendingPosts: async () => {
    const response = await api.get('/posts/trending');
    return response.data;
  },
};

export default api;