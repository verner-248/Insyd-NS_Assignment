# Insyd Notification System - Complete User Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [How the App Works](#how-the-app-works)
4. [Features & Functionality](#features--functionality)
5. [API Reference](#api-reference)
6. [Troubleshooting](#troubleshooting)
7. [Development Guide](#development-guide)

---

## 🎯 Overview

The **Insyd Notification System** is a real-time social media notification platform designed specifically for the architecture industry. It simulates a social networking platform where architects can share posts, interact with each other, and receive instant notifications for various activities.

### What This App Does
- **Social Interactions**: Like posts, comment on posts, follow other users
- **Real-time Notifications**: Get instant alerts for all social activities
- **User Management**: Switch between different user profiles
- **Demo Environment**: Pre-loaded with sample data for testing

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 16 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

### Step 1: Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd Insyd-Full_Stack_Assignment-main

# Install all dependencies
npm run install-all
```

### Step 2: Database Setup

#### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Get your connection string
4. Add your IP address to the whitelist

#### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/insyd-notifications`

### Step 3: Environment Configuration
```bash
# Create environment file
cp .env.example .env

# Edit .env file with your MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/insyd-notifications
PORT=5000
NODE_ENV=development
```

### Step 4: Start the Application
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
# Backend only
npm run server

# Frontend only (in another terminal)
cd frontend && npm run dev
```

### Step 5: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 🔧 How the App Works

### Architecture Overview
```
User Interface (Next.js Frontend)
         ↕️ HTTP Requests
    Backend API (Node.js/Express)
         ↕️ Database Operations
    MongoDB Database
```

### Data Flow
1. **User Action**: User performs an action (like, comment, follow)
2. **API Request**: Frontend sends request to backend
3. **Database Update**: Backend updates relevant data in MongoDB
4. **Notification Creation**: System creates notification for affected users
5. **Response**: Backend sends response to frontend
6. **UI Update**: Frontend updates the interface

### Key Components

#### Frontend (Next.js)
- **Pages**: Main dashboard, user profiles, notifications
- **Components**: Reusable UI components (PostCard, UserCard, NotificationCard)
- **API Integration**: HTTP requests to backend endpoints
- **State Management**: React hooks for local state

#### Backend (Node.js/Express)
- **Routes**: API endpoints for different operations
- **Models**: MongoDB schemas (User, Post, Notification)
- **Controllers**: Business logic for each operation
- **Middleware**: Authentication, validation, error handling

#### Database (MongoDB)
- **Users**: User profiles and relationships
- **Posts**: Content shared by users
- **Notifications**: Real-time alerts for user activities

---

## 🎮 Features & Functionality

### 1. User Management
- **Switch Users**: Test the app with different user profiles
- **User Profiles**: View user information, followers, and posts
- **Follow System**: Follow/unfollow other users

### 2. Post Interactions
- **Create Posts**: Share architecture-related content
- **Like Posts**: Show appreciation for posts
- **Comment on Posts**: Engage in discussions
- **View Post Details**: See likes, comments, and engagement

### 3. Notification System
- **Real-time Alerts**: Get notified instantly for all activities
- **Notification Types**:
  - **Like Notifications**: When someone likes your post
  - **Comment Notifications**: When someone comments on your post
  - **Follow Notifications**: When someone follows you
  - **Post Notifications**: When someone you follow creates a post
  - **Trending Notifications**: When posts become popular

### 4. Demo Features
- **Pre-loaded Data**: Sample users and posts for testing
- **Interactive Demo**: Real-time simulation of social interactions
- **User Switching**: Test different perspectives

---

## 📚 API Reference

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
Currently, the app uses simple user IDs for demo purposes. In production, this would be replaced with JWT tokens.

### Endpoints

#### Users
```http
GET /users
GET /users/:userId
GET /users/:userId/posts
GET /users/:userId/followers
GET /users/:userId/following
```

#### Posts
```http
GET /posts
GET /posts/:postId
POST /posts
PATCH /posts/:postId
DELETE /posts/:postId
```

#### Notifications
```http
GET /notifications/:userId
PATCH /notifications/:notificationId/read
PATCH /notifications/:userId/read-all
```

#### Events (Actions)
```http
POST /events/like
POST /events/comment
POST /events/follow
POST /events/unfollow
```

### Request/Response Examples

#### Like a Post
```http
POST /events/like
Content-Type: application/json

{
  "fromUserId": "u2",
  "postId": "p1"
}

Response:
{
  "success": true,
  "message": "Post liked successfully",
  "notification": {
    "id": "n123",
    "type": "like",
    "message": "u2 liked your post"
  }
}
```

#### Get User Notifications
```http
GET /notifications/u1?page=1&limit=10&unreadOnly=false

Response:
{
  "notifications": [
    {
      "id": "n123",
      "type": "like",
      "message": "u2 liked your post",
      "isRead": false,
      "createdAt": "2025-01-10T14:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

---

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Error
**Error**: `MongooseServerSelectionError: Could not connect to any servers`

**Solution**:
1. Check your MongoDB connection string in `.env`
2. Ensure MongoDB Atlas IP whitelist includes your IP
3. Verify network connectivity

```bash
# Test MongoDB connection
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection failed:', err));
"
```

#### 2. Port Already in Use
**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find and kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

#### 3. Frontend Build Errors
**Error**: `Module not found` or build failures

**Solution**:
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 4. API CORS Errors
**Error**: `Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution**: The backend is already configured with CORS. If you still get errors:
1. Check that backend is running on port 5000
2. Verify CORS configuration in `backend/server.js`
3. Clear browser cache

### Performance Issues

#### Slow Loading
1. **Check Database Indexes**: Ensure MongoDB indexes are created
2. **Reduce Data Load**: Implement pagination
3. **Optimize Queries**: Use database aggregation

#### Memory Issues
1. **Monitor Node.js Memory**: Use `--max-old-space-size=4096`
2. **Database Connection Pool**: Limit concurrent connections
3. **Garbage Collection**: Monitor heap usage

---

## 🛠️ Development Guide

### Project Structure
```
Insyd-Full_Stack_Assignment-main/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── seeders/         # Sample data
│   └── server.js        # Main server file
├── frontend/
│   ├── components/      # React components
│   ├── pages/          # Next.js pages
│   ├── lib/            # Utilities and API calls
│   └── styles/         # CSS and styling
├── package.json         # Root dependencies
└── README.md           # Project overview
```

### Adding New Features

#### 1. New API Endpoint
```javascript
// backend/routes/newFeature.js
const express = require('express');
const router = express.Router();

router.get('/new-endpoint', async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

#### 2. New Frontend Component
```javascript
// frontend/components/NewComponent.jsx
import React from 'react';

const NewComponent = ({ data }) => {
  return (
    <div className="new-component">
      {/* Your JSX here */}
    </div>
  );
};

export default NewComponent;
```

#### 3. Database Schema Changes
```javascript
// backend/models/NewModel.js
const mongoose = require('mongoose');

const newModelSchema = new mongoose.Schema({
  field1: { type: String, required: true },
  field2: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NewModel', newModelSchema);
```

### Testing

#### Manual Testing Checklist
- [ ] User registration/login
- [ ] Post creation and editing
- [ ] Like/unlike functionality
- [ ] Comment system
- [ ] Follow/unfollow users
- [ ] Notification generation
- [ ] Notification reading/marking as read
- [ ] User switching
- [ ] Responsive design

#### API Testing
```bash
# Test endpoints with curl
curl -X GET http://localhost:5000/api/v1/users
curl -X POST http://localhost:5000/api/v1/events/like \
  -H "Content-Type: application/json" \
  -d '{"fromUserId":"u1","postId":"p1"}'
```

### Deployment

#### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

#### Backend (Railway/Render)
```bash
# Set environment variables
# Deploy to Railway or Render
```

#### Database (MongoDB Atlas)
1. Create production cluster
2. Set up database indexes
3. Configure connection string
4. Set up monitoring and alerts

---

## 📊 Monitoring and Analytics

### Key Metrics to Track
- **User Engagement**: Daily active users, session duration
- **Notification Performance**: Delivery rates, read rates
- **API Performance**: Response times, error rates
- **Database Performance**: Query times, connection usage

### Logging
```javascript
// Add logging to your endpoints
const logger = require('morgan');
app.use(logger('combined'));
```

### Error Tracking
```javascript
// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});
```

---

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Commit** with descriptive messages
6. **Push** to your branch
7. **Create** a Pull Request

### Code Standards
- Use **ESLint** for code formatting
- Follow **conventional commits**
- Write **comprehensive tests**
- Update **documentation**

---

## 📞 Support

### Getting Help
1. **Check this documentation** first
2. **Review the README.md** for project overview
3. **Search existing issues** on GitHub
4. **Create a new issue** with detailed information

### Issue Template
When reporting issues, include:
- **Environment**: OS, Node.js version, MongoDB version
- **Steps to reproduce**: Detailed step-by-step instructions
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Error messages**: Full error logs
- **Screenshots**: If applicable

---

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built for the Insyd Architecture Community
- Inspired by modern social media platforms
- Designed for scalability and performance

---

**Happy Coding! 🚀**

For questions or support, please open an issue in the repository or contact the development team. 