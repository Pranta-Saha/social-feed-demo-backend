import { PostLike, Post, User } from "../models/index.js";

export const likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = await PostLike.findOne({
      where: { postId, userId },
    });

    if (existingLike) {
      return res.status(400).json({ message: "Post already liked" });
    }

    await PostLike.create({ postId, userId });

    return res.status(201).json({ message: "Post liked successfully" });
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const like = await PostLike.findOne({
      where: { postId, userId },
    });

    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    await like.destroy();

    return res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    next(error);
  }
};

export const getPostLikes = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likes = await PostLike.findAll({
      where: { postId },
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
