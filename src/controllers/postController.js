import {
  Post,
  User,
  PostLike,
  Comment,
  Reply,
  CommentLike,
  ReplyLike,
} from "../models/index.js";

export const getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: PostLike,
          as: "likes",
          attributes: ["id", "userId"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstName", "lastName"],
            },
          ],
        },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: CommentLike,
              as: "likes",
              attributes: ["id", "userId"],
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "firstName", "lastName"],
                },
              ],
            },
            {
              model: User,
              as: "author",
              attributes: ["id", "firstName", "lastName"],
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
                {
                  model: ReplyLike,
                  as: "likes",
                  attributes: ["id", "userId"],
                  include: [
                    {
                      model: User,
                      as: "user",
                      attributes: ["id", "firstName", "lastName"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    let posts = rows.filter((post) => {
      if (post.isPrivate) {
        return post.authorId === req.userId;
      }
      return true;
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    posts = posts.map((post) => {
      const likedByCurrentUser = post.likes.some(
        (like) => like.userId === req.userId,
      );
      post.comments.map((comment) => {
        comment.likedByCurrentUser = comment.likes.some(
          (like) => like.userId === req.userId,
        );
        comment.replies.map((reply) => {
          reply.likedByCurrentUser = reply.likes.some(
            (like) => like.userId === req.userId,
          );
          return reply;
        });
        return comment;
      });
      post.image = post.image ? `${baseUrl}/${post.image}` : null;
      return {
        ...post.toJSON(),
        likedByCurrentUser,
        likesCount: post.likes.length,
      };
    });

    return res.status(200).json({
      posts,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      hasMore: offset + limit < count,
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { content, isPrivate } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const image = req.file
      ? `uploads/${req.userId}/${req.file.filename}`
      : null;

    const post = await Post.create({
      content,
      image,
      isPrivate: isPrivate === "true" || isPrivate === true,
      authorId: req.userId,
    });

    const postWithAuthor = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    });

    return res.status(201).json({
      message: "Post created successfully",
      post: {
        ...postWithAuthor.toJSON(),
        likedByCurrentUser: false,
        likesCount: 0,
        likes: [],
        comments: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: PostLike,
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
          model: Comment,
          as: "comments",
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

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.isPrivate && post.authorId !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const likedByCurrentUser = post.likes.some(
      (like) => like.userId === req.userId,
    );

    return res.status(200).json({
      ...post.toJSON(),
      likedByCurrentUser,
      likesCount: post.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await post.destroy();

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};
