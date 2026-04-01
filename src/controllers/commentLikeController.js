import { CommentLike, Comment, User } from '../models/index.js';

export const likeComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const existingLike = await CommentLike.findOne({
      where: { commentId, userId },
    });

    if (existingLike) {
      return res.status(400).json({ message: 'Comment already liked' });
    }

    await CommentLike.create({ commentId, userId });

    return res.status(201).json({ message: 'Comment liked successfully' });
  } catch (error) {
    next(error);
  }
};

export const unlikeComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const like = await CommentLike.findOne({
      where: { commentId, userId },
    });

    if (!like) {
      return res.status(404).json({ message: 'Like not found' });
    }

    await like.destroy();

    return res.status(200).json({ message: 'Comment unliked successfully' });
  } catch (error) {
    next(error);
  }
};

export const getCommentLikes = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const likes = await CommentLike.findAll({
      where: { commentId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    return res.status(200).json({
      likes: likes.map((like) => ({
        id: like.id,
        user: like.user,
      })),
    });
  } catch (error) {
    next(error);
  }
};
