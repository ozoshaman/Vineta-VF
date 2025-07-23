const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authmiddleware');
const {
  toggleLike,
  getLikes,
  checkCurrentUserLike,
  addComment,
  getComments,
  editComment,
  removeComment
} = require('../controllers/likesCommentsController');

// ===== RUTAS PARA LIKES =====

// Dar/quitar like a un post
router.post('/posts/:postId/like', authenticate, toggleLike);

// Obtener likes de un post
router.get('/posts/:postId/likes', authenticate, getLikes);

// Verificar si el usuario actual dio like
router.get('/posts/:postId/like/check', authenticate, checkCurrentUserLike);

// ===== RUTAS PARA COMENTARIOS =====

// Crear un comentario
router.post('/posts/:postId/comments', authenticate, addComment);

// Obtener comentarios de un post
router.get('/posts/:postId/comments', authenticate, getComments);

// Actualizar un comentario
router.put('/comments/:commentId', authenticate, editComment);

// Eliminar un comentario
router.delete('/comments/:commentId', authenticate, removeComment);

module.exports = router; 