import { Comment, Post, User, CommentLike, Reply } from "../models/index.js";

export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.findAll({
      where: { postId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: CommentLike,
          as: "likes",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstName", "lastName"],
            },
          ],
        },
        {
          model: Reply,
          as: "replies",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["id", "firstName", "lastName"],
            },
          ],
        },
      ],
    });

    const formattedComments = comments.map((comment) => {
      const likedByCurrentUser = comment.likes.some(
        (like) => like.userId === req.userId,
      );
      return {
        ...comment.toJSON(),
        likedByCurrentUser,
        likesCount: comment.likes.length,
      };
    });

    return res.status(200).json({ comments: formattedComments });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      content,
      postId,
      authorId: req.userId,
    });

    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    });

    return res.status(201).json({
      message: "Comment created successfully",
      comment: {
        ...commentWithAuthor.toJSON(),
        likedByCurrentUser: false,
        likesCount: 0,
        likes: [],
        replies: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.authorId !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await comment.destroy();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};
