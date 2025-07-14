const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  createPost,
  getPostById,
  deletePost,
  toggleLike,
  getReplies,
  addReply
} = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

// 📬 Posts
router.get('/posts', getAllPosts);
router.post('/posts', protect, createPost);
router.get('/posts/:id', getPostById);
router.delete('/posts/:id', protect, deletePost);

// ❤️ Like/Unlike
router.post('/posts/:id/like', protect, toggleLike);

// 💬 Replies
router.get('/posts/:id/replies', getReplies);
router.post('/posts/:id/replies', protect, addReply);

module.exports = router;
