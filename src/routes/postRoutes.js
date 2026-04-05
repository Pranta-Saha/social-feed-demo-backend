import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
  getFeed,
  createPost,
  getPost,
  deletePost,
} from "../controllers/postController.js";
import {
  likePost,
  unlikePost,
  getPostLikes,
} from "../controllers/postLikeController.js";
import {
  getComments,
  createComment,
  deleteComment,
} from "../controllers/commentController.js";
import {
  likeComment,
  unlikeComment,
  getCommentLikes,
} from "../controllers/commentLikeController.js";
import {
  getReplies,
  createReply,
  deleteReply,
} from "../controllers/replyController.js";
import {
  likeReply,
  unlikeReply,
  getReplyLikes,
} from "../controllers/replyLikeController.js";

const router = express.Router();

// Apply auth middleware to all post routes
router.use(authMiddleware);

// Post routes
router.get("/", getFeed);
router.post("/", upload.single("image"), createPost);
router.get("/:postId", getPost);
router.delete("/:postId", deletePost);

// Post like routes
router.post("/:postId/like", likePost);
router.post("/:postId/unlike", unlikePost);
router.get("/:postId/likes", getPostLikes);

// Comment routes
router.get("/:postId/comments", getComments);
router.post("/:postId/comments", createComment);

// Reply routes have to come after specific routes to avoid conflicts
router.get("/comments/:commentId/likes", getCommentLikes);
router.post("/comments/:commentId/like", likeComment);
router.post("/comments/:commentId/unlike", unlikeComment);
router.get("/comments/:commentId/replies", getReplies);
router.post("/comments/:commentId/replies", createReply);

// Delete routes
router.delete("/comments/:commentId", deleteComment);
router.delete("/replies/:replyId", deleteReply);

// Reply like routes
router.post("/replies/:replyId/like", likeReply);
router.post("/replies/:replyId/unlike", unlikeReply);
router.get("/replies/:replyId/likes", getReplyLikes);

export default router;
