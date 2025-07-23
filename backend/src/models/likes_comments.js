const pool = require('../config/db');

// ===== FUNCIONES PARA LIKES =====

// Dar like a un post
const likePost = async (postId, userId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Verificar si ya existe el like
    const existingLike = await client.query(
      'SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2',
      [postId, userId]
    );

    if (existingLike.rows.length > 0) {
      // Si ya existe, eliminar el like (toggle)
      await client.query(
        'DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2',
        [postId, userId]
      );
      await client.query('COMMIT');
      return { liked: false, message: 'Like removido' };
    } else {
      // Si no existe, agregar el like
      await client.query(
        'INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)',
        [postId, userId]
      );
      await client.query('COMMIT');
      return { liked: true, message: 'Post likeado' };
    }
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Obtener likes de un post
const getPostLikes = async (postId) => {
  const query = `
    SELECT 
      pl.id,
      pl.user_id,
      u.username,
      up.avatar_base64,
      pl.created_at
    FROM post_likes pl
    INNER JOIN users u ON pl.user_id = u.id
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE pl.post_id = $1
    ORDER BY pl.created_at DESC
  `;
  
  const result = await pool.query(query, [postId]);
  return result.rows;
};

// Verificar si un usuario dio like a un post
const checkUserLike = async (postId, userId) => {
  const result = await pool.query(
    'SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2',
    [postId, userId]
  );
  return result.rows.length > 0;
};

// Contar likes de un post
const getPostLikesCount = async (postId) => {
  const result = await pool.query(
    'SELECT COUNT(*) as count FROM post_likes WHERE post_id = $1',
    [postId]
  );
  return parseInt(result.rows[0].count);
};

// ===== FUNCIONES PARA COMENTARIOS =====

// Crear un comentario
const createComment = async (postId, userId, content) => {
  const query = `
    INSERT INTO post_comments (post_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING id, created_at
  `;
  
  const result = await pool.query(query, [postId, userId, content]);
  return result.rows[0];
};

// Obtener comentarios de un post
const getPostComments = async (postId, limit = 10, offset = 0) => {
  const query = `
    SELECT 
      pc.id,
      pc.content,
      pc.created_at,
      pc.updated_at,
      pc.user_id,
      u.username,
      up.avatar_base64
    FROM post_comments pc
    INNER JOIN users u ON pc.user_id = u.id
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE pc.post_id = $1
    ORDER BY pc.created_at ASC
    LIMIT $2 OFFSET $3
  `;
  
  const result = await pool.query(query, [postId, limit, offset]);
  return result.rows;
};

// Actualizar un comentario
const updateComment = async (commentId, userId, content) => {
  const query = `
    UPDATE post_comments 
    SET content = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND user_id = $3
    RETURNING *
  `;
  
  const result = await pool.query(query, [content, commentId, userId]);
  return result.rows[0];
};

// Eliminar un comentario
const deleteComment = async (commentId, userId) => {
  const query = `
    DELETE FROM post_comments 
    WHERE id = $1 AND user_id = $2
    RETURNING id
  `;
  
  const result = await pool.query(query, [commentId, userId]);
  return result.rows[0];
};

// Contar comentarios de un post
const getPostCommentsCount = async (postId) => {
  const result = await pool.query(
    'SELECT COUNT(*) as count FROM post_comments WHERE post_id = $1',
    [postId]
  );
  return parseInt(result.rows[0].count);
};

// Obtener un comentario específico
const getCommentById = async (commentId) => {
  const query = `
    SELECT 
      pc.id,
      pc.content,
      pc.created_at,
      pc.updated_at,
      pc.user_id,
      u.username,
      up.avatar_base64
    FROM post_comments pc
    INNER JOIN users u ON pc.user_id = u.id
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE pc.id = $1
  `;
  
  const result = await pool.query(query, [commentId]);
  return result.rows[0];
};

module.exports = {
  // Likes
  likePost,
  getPostLikes,
  checkUserLike,
  getPostLikesCount,
  
  // Comentarios
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  getPostCommentsCount,
  getCommentById
}; 