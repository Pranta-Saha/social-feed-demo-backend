# Social Feed Backend API

A complete Express.js backend API for a social media application with posts, comments, replies, and like/unlike functionality. Built with Sequelize ORM for PostgreSQL database.

## Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Posts**: Create, read, update, delete posts with privacy control
- **Comments**: Add comments to posts with nested replies
- **Replies**: Reply to comments with full like/unlike support
- **Likes**: Full like/unlike system for posts, comments, and replies
- **Privacy**: Private and public posts - private posts only visible to author
- **Error Handling**: Comprehensive error handling and validation

## Project Structure

```
appifylab-backend/
├── src/
│   ├── config/
│   │   ├── database.js                # Sequelize database instance
│   │   └── sequelize-config.js        # Environment-based config
│   ├── migrations/                    # Database schema migrations
│   │   ├── 001-create-users.js
│   │   ├── 002-create-posts.js
│   │   ├── 003-create-comments.js
│   │   ├── 004-create-replies.js
│   │   ├── 005-create-post-likes.js
│   │   ├── 006-create-comment-likes.js
│   │   └── 007-create-reply-likes.js
│   ├── seeders/                       # Database sample data
│   │   ├── 001-seed-users.js
│   │   ├── 002-seed-posts.js
│   │   ├── 003-seed-comments.js
│   │   ├── 004-seed-replies.js
│   │   ├── 005-seed-post-likes.js
│   │   ├── 006-seed-comment-likes.js
│   │   └── 007-seed-reply-likes.js
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Post.js              # Post model
│   │   ├── Comment.js           # Comment model
│   │   ├── Reply.js             # Reply model
│   │   ├── PostLike.js          # Post like model
│   │   ├── CommentLike.js       # Comment like model
│   │   ├── ReplyLike.js         # Reply like model
│   │   └── index.js             # Model associations
│   ├── controllers/
│   │   ├── authController.js    # Auth logic (register, login)
│   │   ├── postController.js    # Post CRUD operations
│   │   ├── postLikeController.js # Post like logic
│   │   ├── commentController.js # Comment CRUD operations
│   │   ├── commentLikeController.js # Comment like logic
│   │   ├── replyController.js   # Reply CRUD operations
│   │   └── replyLikeController.js # Reply like logic
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── postRoutes.js        # Post-related endpoints
│   ├── middleware/
│   │   └── auth.js              # Auth middleware & error handler
│   └── utils/
│       └── jwt.js               # JWT utilities
├── server.js                    # Main server file
├── .sequelizerc                 # Sequelize CLI config
├── package.json
├── .env.example
└── .gitignore
```

## Prerequisites

- **Node.js** v18 or higher
- **npm** or yarn
- **PostgreSQL** 12 or higher (running locally or remote)

## Complete Setup & Installation Guide

### Step 1: PostgreSQL Installation

**Windows:**
- Download PostgreSQL from https://www.postgresql.org/download/windows/
- Run the installer and follow the setup wizard
- Remember the password you set for the `postgres` user
- PostgreSQL runs on port 5432 by default

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### Step 2: Create PostgreSQL Database

Connect to PostgreSQL and create the database:

```bash
# Open PostgreSQL client
psql -U postgres

# In psql prompt, create the database
CREATE DATABASE appifylab_db;

# Verify creation
\l

# Exit psql
\q
```

### Step 3: Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd appifylab-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with your PostgreSQL credentials**
   ```
   NODE_ENV=development
   PORT=3000
   
   # PostgreSQL Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=appifylab_db
   DB_USER=postgres
   DB_PASSWORD=<your_postgres_password>
   
   DB_SSL=false
   
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRY=7d
   
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Run database migrations**
   ```bash
   npm run migrate:up
   ```
   This creates all tables: Users, Posts, Comments, Replies, PostLikes, CommentLikes, ReplyLikes

6. **Seed sample data (optional)**
   ```bash
   npm run seed:all
   ```
   This populates the database with 5 test users, 15 posts, 20 comments, 15 replies, and various likes

7. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server will start on `http://localhost:3000`

### Step 4: Frontend Setup

1. **Navigate to frontend folder** (from project root)
   ```bash
   cd appifylab-task
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   Frontend will start on `http://localhost:5173`

## Database Management Commands

### Migrations
```bash
# Run all pending migrations
npm run migrate:up

# Undo all migrations (careful!)
npm run migrate:down

# Create a new migration file
npm run migrate:create -- --name=your_migration_name
```

### Seeders
```bash
# Seed all data
npm run seed:all

# Undo all seeds
npm run seed:undo:all
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get paginated feed (private posts excluded except from author)
- `GET /api/posts/:id` - Get specific post
- `POST /api/posts` - Create new post (requires auth)
- `DELETE /api/posts/:id` - Delete post (auth required, author only)

### Post Likes
- `POST /api/posts/:id/like` - Like a post
- `DELETE /api/posts/:id/like` - Unlike a post
- `GET /api/posts/:id/likes` - Get post likes count

### Comments
- `GET /api/posts/:postId/comments` - Get comments on post
- `POST /api/posts/:postId/comments` - Create comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required, author only)

### Comment Likes
- `POST /api/comments/:id/like` - Like a comment
- `DELETE /api/comments/:id/like` - Unlike a comment
- `GET /api/comments/:id/likes` - Get comment likes count

### Replies
- `GET /api/comments/:commentId/replies` - Get replies on comment
- `POST /api/comments/:commentId/replies` - Create reply (auth required)
- `DELETE /api/replies/:id` - Delete reply (auth required, author only)

### Reply Likes
- `POST /api/replies/:id/like` - Like a reply
- `DELETE /api/replies/:id/like` - Unlike a reply
- `GET /api/replies/:id/likes` - Get reply likes count

## Authentication

- JWT tokens are issued on login with 7-day expiry
- Include token in `Authorization: Bearer <token>` header for protected routes
- Passwords are hashed with bcrypt (10 rounds)

## Troubleshooting

**"Connection refused" error:**
- Check PostgreSQL is running
- Verify DB_HOST and DB_PORT in .env
- Ensure database user and password are correct

**"Database does not exist" error:**
- Create database: `CREATE DATABASE appifylab_db;` in psql

**"Relation does not exist" error:**
- Run migrations: `npm run migrate:up`

**"Password authentication failed":**
- Check DB_USER and DB_PASSWORD in .env match PostgreSQL credentials

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": { ... }
}
```

### Posts

#### Get Feed (Paginated)
```http
GET /api/posts?page=1&limit=10
Authorization: Bearer <token>
```

#### Create Post
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is my post",
  "isPrivate": false
}
```

#### Get Single Post
```http
GET /api/posts/{postId}
Authorization: Bearer <token>
```

#### Delete Post
```http
DELETE /api/posts/{postId}
Authorization: Bearer <token>
```

### Post Likes

#### Like Post
```http
POST /api/posts/{postId}/like
Authorization: Bearer <token>
```

#### Unlike Post
```http
POST /api/posts/{postId}/unlike
Authorization: Bearer <token>
```

#### Get Post Likes
```http
GET /api/posts/{postId}/likes
Authorization: Bearer <token>
```

### Comments

#### Get Comments
```http
GET /api/posts/{postId}/comments
Authorization: Bearer <token>
```

#### Create Comment
```http
POST /api/posts/{postId}/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great post!"
}
```

#### Delete Comment
```http
DELETE /api/comments/{commentId}
Authorization: Bearer <token>
```

### Comment Likes

#### Like Comment
```http
POST /api/comments/{commentId}/like
Authorization: Bearer <token>
```

#### Unlike Comment
```http
POST /api/comments/{commentId}/unlike
Authorization: Bearer <token>
```

#### Get Comment Likes
```http
GET /api/comments/{commentId}/likes
Authorization: Bearer <token>
```

### Replies

#### Get Replies
```http
GET /api/comments/{commentId}/replies
Authorization: Bearer <token>
```

#### Create Reply
```http
POST /api/comments/{commentId}/replies
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Thanks for the comment!"
}
```

#### Delete Reply
```http
DELETE /api/replies/{replyId}
Authorization: Bearer <token>
```

### Reply Likes

#### Like Reply
```http
POST /api/replies/{replyId}/like
Authorization: Bearer <token>
```

#### Unlike Reply
```http
POST /api/replies/{replyId}/unlike
Authorization: Bearer <token>
```

#### Get Reply Likes
```http
GET /api/replies/{replyId}/likes
Authorization: Bearer <token>
```

## Database Schema

### Users Table
```
- id (UUID, Primary Key)
- firstName (String)
- lastName (String)
- email (String, Unique)
- password (String, Hashed)
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

### Posts Table
```
- id (UUID, Primary Key)
- content (Text)
- image (String, nullable)
- isPrivate (Boolean, default: false)
- authorId (UUID, Foreign Key → Users)
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

### Comments Table
```
- id (UUID, Primary Key)
- content (Text)
- postId (UUID, Foreign Key → Posts)
- authorId (UUID, Foreign Key → Users)
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

### Replies Table
```
- id (UUID, Primary Key)
- content (Text)
- commentId (UUID, Foreign Key → Comments)
- authorId (UUID, Foreign Key → Users)
- createdAt (Timestamp)
- updatedAt (Timestamp)
```

### PostLikes Table
```
- id (UUID, Primary Key)
- postId (UUID, Foreign Key → Posts)
- userId (UUID, Foreign Key → Users)
- Unique Index: (postId, userId)
- createdAt (Timestamp)
```

### CommentLikes Table
```
- id (UUID, Primary Key)
- commentId (UUID, Foreign Key → Comments)
- userId (UUID, Foreign Key → Users)
- Unique Index: (commentId, userId)
- createdAt (Timestamp)
```

### ReplyLikes Table
```
- id (UUID, Primary Key)
- replyId (UUID, Foreign Key → Replies)
- userId (UUID, Foreign Key → Users)
- Unique Index: (replyId, userId)
- createdAt (Timestamp)
```

## Key Features

### Authentication
- JWT tokens with configurable expiry
- Bcrypt password hashing (10 salt rounds)
- Bearer token required for all protected endpoints

### Privacy Control
- Posts can be marked as private
- Private posts only returned to the author
- Public posts visible to all authenticated users

### Relationships
- Cascading deletes for posts, comments, and replies
- Proper foreign key constraints
- UUID primary keys for security

### Error Handling
- Input validation
- Unique constraint handling (duplicate emails)
- Authorization checks (can only delete own content)
- Proper HTTP status codes

### Performance
- Efficient database queries with associations
- Pagination support on feed endpoint
- Indexed unique constraints on likes

## Testing

You can test the API using Postman, cURL, or any REST client:

```bash
# Test health endpoint
curl http://localhost:3000/health

# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john@test.com",
    "password":"test123"
  }'

# Login and get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@test.com",
    "password":"test123"
  }'

# Get feed (use token from login)
curl http://localhost:3000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | development | Environment mode |
| PORT | 3000 | Server port |
| DB_HOST | localhost | Database host |
| DB_NAME | appifylab_db | Database name |
| DB_USER | root | Database user |
| DB_PASSWORD | password | Database password |
| DB_DIALECT | sqlite | Database dialect (sqlite, mysql, postgres) |
| DB_STORAGE | appifylab.db | SQLite database file path |
| JWT_SECRET | your_secret_key | JWT secret key |
| JWT_EXPIRY | 7d | JWT token expiry |
| CORS_ORIGIN | http://localhost:5173 | Frontend origin for CORS |

## Technologies Used

- **Express.js**: Web framework
- **Sequelize**: ORM for database
- **SQLite**: Database (can be switched to MySQL/PostgreSQL)
- **JWT**: Authentication
- **Bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing
- **UUID**: Unique identifiers

## Security Considerations

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Validate all inputs** on the backend
4. **Use environment variables** for sensitive data
5. **Implement rate limiting** for production
6. **Add request validation middleware** for production
7. **Use database connection pooling** for production

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Notes

- SQLite is used by default for development. Switch to MySQL or PostgreSQL for production.
- All timestamps are in UTC
- UUIDs are used for all IDs for better security and distribution
- Cascading deletes are enabled for maintaining data integrity
- Duplicate likes are prevented with unique constraints

## Support

For issues or questions, please refer to the API documentation or contact the development team.
