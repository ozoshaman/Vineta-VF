const {
  likePost,
  getPostLikes,
  checkUserLike,
  getPostLikesCount,
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  getPostCommentsCount,
  getCommentById
} = require('../models/likes_comments');

// ===== CONTROLADORES PARA LIKES =====

// Dar/quitar like a un post
const toggleLike = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const result = await likePost(postId, userId);
    const likesCount = await getPostLikesCount(postId);
    
    res.json({
      success: true,
      liked: result.liked,
      likesCount,
      message: result.message
    });
  } catch (error) {
    console.error('Error al manejar like:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al procesar el like' 
    });
  }
};

// Obtener likes de un post
const getLikes = async (req, res) => {
  const { postId } = req.params;
  try {
    const likes = await getPostLikes(postId);
    const likesCount = await getPostLikesCount(postId);
    
    res.json({
      success: true,
      likes,
      count: likesCount
    });
  } catch (error) {
    console.error('Error al obtener likes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener likes' 
    });
  }
};

// Verificar si el usuario actual dio like
const checkCurrentUserLike = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  try {
    const hasLiked = await checkUserLike(postId, userId);
    res.json({
      success: true,
      hasLiked
    });
  } catch (error) {
    console.error('Error al verificar like del usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al verificar like' 
    });
  }
};

// ===== CONTROLADORES PARA COMENTARIOS =====

// Crear un comentario
const addComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;
  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'El contenido del comentario es requerido'
    });
  }
  if (content.trim().length > 500) {
    return res.status(400).json({
      success: false,
      message: 'El comentario no puede exceder 500 caracteres'
    });
  }

  try {
    const comment = await createComment(postId, userId, content.trim());
    const commentsCount = await getPostCommentsCount(postId);
    
    // Obtener información completa del comentario
    const fullComment = await getCommentById(comment.id);
    
    res.status(201).json({
      success: true,
      comment: fullComment,
      commentsCount,
      message: 'Comentario agregado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el comentario'
    });
  }
};

// Obtener comentarios de un post
const getComments = async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const comments = await getPostComments(postId, parseInt(limit), offset);
    const commentsCount = await getPostCommentsCount(postId);
    
    res.json({
      success: true,
      comments,
      count: commentsCount,
      page: parseInt(page),
      limit: parseInt(limit),
      hasMore: offset + comments.length < commentsCount
    });
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener comentarios'
    });
  }
};

// Actualizar un comentario
const editComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'El contenido del comentario es requerido'
    });
  }

  if (content.trim().length > 500) {
    return res.status(400).json({
      success: false,
      message: 'El comentario no puede exceder 500 caracteres'
    });
  }

  try {
    const updatedComment = await updateComment(commentId, userId, content.trim());
    
    if (!updatedComment) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado o no tienes permisos para editarlo'
      });
    }

    res.json({
      success: true,
      comment: updatedComment,
      message: 'Comentario actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar comentario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el comentario'
    });
  }
};

// Eliminar un comentario
const removeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    const deletedComment = await deleteComment(commentId, userId);
    
    if (!deletedComment) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado o no tienes permisos para eliminarlo'
      });
    }

    res.json({
      success: true,
      message: 'Comentario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el comentario'
    });
  }
};

module.exports = {
  // Likes
  toggleLike,
  getLikes,
  checkCurrentUserLike,
  
  // Comentarios
  addComment,
  getComments,
  editComment,
  removeComment
}; 