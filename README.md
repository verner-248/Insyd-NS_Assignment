# Insyd Notification System

A comprehensive real-time notification system for the Insyd social networking platform, designed for the Architecture Industry.

## 🏗️ System Architecture

```
User Action
   ↓
[Frontend (Next.js)]
   ↓ REST API
[Backend (Node.js)]
   ↓
MongoDB ← (Optional: Kafka/Redis Queue)
   ↓
[Notification Service]
   ↓
Frontend Polling / (Future: WebSockets/Firebase)
```

## 🚀 Features

- **Real-time Notifications**: Like, comment, follow, post creation, and trending alerts
- **Scalable Architecture**: Built to handle 1M+ DAUs with MongoDB and optional Redis/Kafka
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- **Performance Optimized**: Indexed queries, pagination, and efficient data models
- **AI Integration Ready**: OpenAI integration for personalized notification messages
- **Production Ready**: Comprehensive error handling, validation, and security

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (React) |
| Backend | Node.js + Express |
| Database | MongoDB (using Mongoose) |
| Styling | Tailwind CSS |
| AI (Optional) | OpenAI API |
| Deployment | Vercel (Frontend), Railway/Render (Backend), MongoDB Atlas |

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- MongoDB (local or Atlas)
- npm or yarn

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd insyd-notification-system
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and other settings
```

4. **Start the development servers**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend application on `http://localhost:3000`

## 🔧 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Notification Endpoints

#### Get Notifications
```http
GET /notifications/:userId?page=1&limit=20&type=like&unreadOnly=false
```

#### Mark as Read
```http
PATCH /notifications/:notificationId/read
```

#### Mark All as Read
```http
PATCH /notifications/:userId/read-all
```

### Event Endpoints

#### Like Post
```http
POST /events/like
Content-Type: application/json

{
  "fromUserId": "u2",
  "postId": "p1"
}
```

#### Follow User
```http
POST /events/follow
Content-Type: application/json

{
  "fromUserId": "u3",
  "toUserId": "u1"
}
```

#### Comment on Post
```http
POST /events/comment
Content-Type: application/json

{
  "fromUserId": "u2",
  "postId": "p1",
  "comment": "Awesome design!"
}
```

## 📊 Data Models

### User
```javascript
{
  "_id": "u1",
  "username": "alice_architect",
  "email": "alice@insyd.com",
  "avatar": "https://...",
  "bio": "Modern architecture enthusiast",
  "followers": ["u2", "u3"],
  "following": ["u4"],
  "notificationSettings": {
    "likes": true,
    "comments": true,
    "follows": true,
    "posts": true
  }
}
```

### Post
```javascript
{
  "_id": "p1",
  "authorId": "u1",
  "content": "Modern architecture post",
  "images": ["https://..."],
  "tags": ["architecture", "modern"],
  "likes": ["u2", "u3"],
  "comments": [
    {
      "userId": "u2",
      "comment": "Awesome!",
      "createdAt": "2025-01-10T14:00:00Z"
    }
  ],
  "viewCount": 45,
  "createdAt": "2025-01-10T12:00:00Z"
}
```

### Notification
```javascript
{
  "_id": "n1",
  "toUserId": "u1",
  "fromUserId": "u2",
  "type": "like", // like, comment, follow, post, trending
  "postId": "p1",
  "message": "u2 liked your post",
  "isRead": false,
  "priority": "medium", // low, medium, high
  "createdAt": "2025-01-10T14:00:00Z"
}
```

## 🎯 Demo Features

The application includes a comprehensive demo with:

- **Sample Users**: Pre-loaded architect profiles
- **Sample Posts**: Architecture-themed content
- **Interactive Actions**: Like, comment, follow functionality
- **Real-time Updates**: Immediate notification generation
- **Trending Simulation**: Trigger trending notifications
- **User Switching**: Test different user perspectives

## 🔄 Scaling Strategy

| Stage | Users | Strategy |
|-------|-------|----------|
| 0-100 DAUs | Small | Direct DB writes, no queues |
| 100-10K DAUs | Medium | Redis pub/sub for async fanout |
| 10K-1M DAUs | Large | Kafka, worker nodes, sharded DBs |

## 📈 Performance Optimizations

- **Database Indexes**: Optimized queries for notifications, users, and posts
- **Pagination**: Cursor-based pagination for large datasets
- **Caching**: Redis integration for frequently accessed data
- **Batched Operations**: Efficient bulk notification creation
- **Connection Pooling**: Optimized MongoDB connections

## 🛡️ Security Features

- **Input Validation**: Joi schema validation for all endpoints
- **Rate Limiting**: Protection against API abuse
- **CORS Configuration**: Secure cross-origin requests
- **Helmet.js**: Security headers and protection
- **Data Sanitization**: Prevention of injection attacks

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Railway/Render)
```bash
# Set environment variables
# Deploy backend to Railway or Render
```

### Database (MongoDB Atlas)
- Create MongoDB Atlas cluster
- Configure connection string
- Set up database indexes

## 🧪 Testing Scenarios

| Action | Expected Notification |
|--------|----------------------|
| A likes B's post | B gets "A liked your post" |
| A comments on B's post | B gets "A commented on your post" |
| A follows B | B gets "A started following you" |
| A creates new post | Followers get "A shared a new post" |
| Post becomes trending | Users get trending notification |

## 🔮 Future Enhancements

- **WebSocket Integration**: Real-time push notifications
- **Mobile Push Notifications**: Firebase/APNs integration
- **Email Notifications**: SMTP integration for important alerts
- **Advanced AI**: Personalized notification content and timing
- **Analytics Dashboard**: Notification engagement metrics
- **Notification Scheduling**: Delayed and scheduled notifications

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For questions or support, please open an issue in the repository or contact the development team.

---

Built with ❤️ for the Insyd Architecture Community