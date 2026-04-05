import { ReplyLike, Reply, User } from "../models/index.js";

export const likeReply = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    const userId = req.userId;

    const reply = await Reply.findByPk(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const existingLike = await ReplyLike.findOne({
      where: { replyId, userId },
    });

    if (existingLike) {
      return res.status(400).json({ message: "Reply already liked" });
    }

    await ReplyLike.create({ replyId, userId });

    return res.status(201).json({ message: "Reply liked successfully" });
  } catch (error) {
    next(error);
  }
};

export const unlikeReply = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    const userId = req.userId;

    const like = await ReplyLike.findOne({
      where: { replyId, userId },
    });

    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    await like.destroy();

    return res.status(200).json({ message: "Reply unliked successfully" });
  } catch (error) {
    next(error);
  }
};

export const getReplyLikes = async (req, res, next) => {
  try {
    const { replyId } = req.params;

    const reply = await Reply.findByPk(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const likes = await ReplyLike.findAll({
      where: { replyId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
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
