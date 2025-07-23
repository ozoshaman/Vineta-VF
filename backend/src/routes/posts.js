const express = require('express');
const authenticate = require('../middlewares/authmiddleware');
const {
  getFeed,
  createNewPost,
  getMyPosts,
  getPostForEdit,
  updateExistingPost,
  disableExistingPost,
  enableExistingPost,
  getFollowingFeed
} = require('../controllers/feedController');

const router = express.Router();

// Rutas públicas
router.get('/feed', getFeed);

// Rutas protegidas
router.post('/create', authenticate, createNewPost);
router.get('/my-posts', authenticate, getMyPosts);
router.get('/following-feed', authenticate, getFollowingFeed);
router.get('/edit/:postId', authenticate, getPostForEdit);
router.put('/update/:postId', authenticate, updateExistingPost);
router.patch('/disable/:postId', authenticate, disableExistingPost);
router.patch('/enable/:postId', authenticate, enableExistingPost);

module.exports = router;