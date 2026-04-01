import User from './User.js';
import Post from './Post.js';
import Comment from './Comment.js';
import Reply from './Reply.js';
import PostLike from './PostLike.js';
import CommentLike from './CommentLike.js';
import ReplyLike from './ReplyLike.js';

// User associations
User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
User.hasMany(Comment, { foreignKey: 'authorId', as: 'comments' });
User.hasMany(Reply, { foreignKey: 'authorId', as: 'replies' });

// Post associations
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments', onDelete: 'CASCADE' });
Post.hasMany(PostLike, { foreignKey: 'postId', as: 'likes', onDelete: 'CASCADE' });

// Comment associations
Comment.belongsTo(Post, { foreignKey: 'postId' });
Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
Comment.hasMany(Reply, { foreignKey: 'commentId', as: 'replies', onDelete: 'CASCADE' });
Comment.hasMany(CommentLike, { foreignKey: 'commentId', as: 'likes', onDelete: 'CASCADE' });

// Reply associations
Reply.belongsTo(Comment, { foreignKey: 'commentId' });
Reply.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
Reply.hasMany(ReplyLike, { foreignKey: 'replyId', as: 'likes', onDelete: 'CASCADE' });

// Like associations
PostLike.belongsTo(Post, { foreignKey: 'postId' });
PostLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });

CommentLike.belongsTo(Comment, { foreignKey: 'commentId' });
CommentLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });

ReplyLike.belongsTo(Reply, { foreignKey: 'replyId' });
ReplyLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { User, Post, Comment, Reply, PostLike, CommentLike, ReplyLike };
