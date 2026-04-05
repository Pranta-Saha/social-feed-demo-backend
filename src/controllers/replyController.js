import { Reply, Comment, User, ReplyLike } from "../models/index.js";

export const getReplies = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const replies = await Reply.findAll({
      where: { commentId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: ReplyLike,
          as: "likes",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstName", "lastName"],
            },
          ],
        },
      ],
    });

    const formattedReplies = replies.map((reply) => {
      const likedByCurrentUser = reply.likes.some(
        (like) => like.userId === req.userId,
      );
      return {
        ...reply.toJSON(),
        likedByCurrentUser,
        likesCount: reply.likes.length,
      };
    });

    return res.status(200).json({ replies: formattedReplies });
  } catch (error) {
    next(error);
  }
};

export const createReply = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const reply = await Reply.create({
      content,
      commentId,
      authorId: req.userId,
    });

    const replyWithAuthor = await Reply.findByPk(reply.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    });

    return res.status(201).json({
      message: "Reply created successfully",
      reply: {
        ...replyWithAuthor.toJSON(),
        likedByCurrentUser: false,
        likesCount: 0,
        likes: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReply = async (req, res, next) => {
  try {
    const { replyId } = req.params;

    const reply = await Reply.findByPk(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    if (reply.authorId !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await reply.destroy();

    return res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    next(error);
  }
};
