# Backend API Quick Reference

## Base URL
```
http://localhost:3000/api
```

## Authentication Header
```
Authorization: Bearer {JWT_TOKEN}
```

---

## API Routes Summary

### Auth Routes (No Auth Required)
- `POST /auth/register` - Create new account
- `POST /auth/login` - Login user

### Post Routes (Auth Required)
- `GET /posts` - Get paginated feed
- `POST /posts` - Create new post
- `GET /posts/{postId}` - Get single post
- `DELETE /posts/{postId}` - Delete post (owner only)

### Post Like Routes (Auth Required)
- `POST /posts/{postId}/like` - Like a post
- `POST /posts/{postId}/unlike` - Unlike a post
- `GET /posts/{postId}/likes` - Get who liked the post

### Comment Routes (Auth Required)
- `GET /posts/{postId}/comments` - Get post comments
- `POST /posts/{postId}/comments` - Create comment
- `DELETE /comments/{commentId}` - Delete comment (owner only)

### Comment Like Routes (Auth Required)
- `POST /comments/{commentId}/like` - Like a comment
- `POST /comments/{commentId}/unlike` - Unlike a comment
- `GET /comments/{commentId}/likes` - Get who liked the comment

### Reply Routes (Auth Required)
- `GET /comments/{commentId}/replies` - Get comment replies
- `POST /comments/{commentId}/replies` - Create reply
- `DELETE /replies/{replyId}` - Delete reply (owner only)

### Reply Like Routes (Auth Required)
- `POST /replies/{replyId}/like` - Like a reply
- `POST /replies/{replyId}/unlike` - Unlike a reply
- `GET /replies/{replyId}/likes` - Get who liked the reply

---

## Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid token) |
| 403 | Forbidden (access denied) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Request Examples

### Register
```json
POST /auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```json
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Post
```json
POST /posts
{
  "content": "Hello, world!",
  "isPrivate": false
}
```

### Create Comment
```json
POST /posts/{postId}/comments
{
  "content": "Great post!"
}
```

### Create Reply
```json
POST /comments/{commentId}/replies
{
  "content": "Thanks for the comment!"
}
```

---

## Response Examples

### User Response
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com"
}
```

### Post Response
```json
{
  "id": "post_id",
  "content": "Hello, world!",
  "image": null,
  "isPrivate": false,
  "authorId": "user_id",
  "createdAt": "2024-04-01T10:00:00Z",
  "updatedAt": "2024-04-01T10:00:00Z",
  "likedByCurrentUser": false,
  "likesCount": 5,
  "author": { ... },
  "likes": [ ... ],
  "comments": [ ... ]
}
```

### Comment Response
```json
{
  "id": "comment_id",
  "content": "Great post!",
  "postId": "post_id",
  "authorId": "user_id",
  "createdAt": "2024-04-01T10:05:00Z",
  "updatedAt": "2024-04-01T10:05:00Z",
  "likedByCurrentUser": false,
  "likesCount": 2,
  "author": { ... },
  "likes": [ ... ],
  "replies": [ ... ]
}
```

---

## Setup Steps

1. Install dependencies
   ```bash
   npm install
   ```

2. Configure environment
   ```bash
   cp .env.example .env
   ```

3. Start server
   ```bash
   npm run dev
   ```

4. Database automatically creates on first run (SQLite)

---

## Key Implementation Details

- **JWT Authentication**: Tokens expire in 7 days by default
- **Password Hashing**: Bcrypt with 10 salt rounds
- **Privacy Control**: Private posts visible only to author
- **Cascading Deletes**: Deleting post deletes comments and replies
- **Unique Likes**: Users can't like the same item twice
- **UUID IDs**: All primary keys use UUID v4
- **Database**: SQLite for dev, easily upgradeable to MySQL/PostgreSQL
