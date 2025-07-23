const pool = require('../config/db'); // o tu conexión
//Obtener post
const getAllPostsWithAuthor = async () => {
  const getPost = await pool.query(`
    SELECT 
      p.id AS post_id,
      p.author_id,
      p.title,
      p.content,
      p.created_at,
      p.active,
      u.username,
      u.avatar,
      up.avatar_base64,
      p.image_base64,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
      (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comments_count
    FROM posts p 
    INNER JOIN users u ON p.author_id = u.id 
    LEFT JOIN user_profiles up ON u.id = up.user_id 
    WHERE p.active = true 
    ORDER BY p.created_at DESC
  `);
  return getPost.rows;
};

// Crear un post con imagen
const createPost = async ({ title, content, author_id, image_base64 }) => {
  const query = `
    INSERT INTO posts (title, content, author_id, image_base64, created_at, active)
    VALUES ($1, $2, $3, $4, NOW(), true) RETURNING *
  `;
  const result = await pool.query(query, [title, content, author_id, image_base64]);
  return result.rows[0];
};

// Crear un post simple (sin imagen)
const createPost_= async (title, content, authorId) => {
  const res = await pool.query(
    'INSERT INTO posts (title, content, author_id, active) VALUES ($1, $2, $3, true) RETURNING *',
    [title, content, authorId]
  );
  return res.rows[0];
};

// Obtener los posts por usuario
const getPostsByUser = async (userId) => {
  const query = `
    SELECT 
      p.id AS post_id,
      p.title,
      p.content,
      p.created_at,
      p.active,
      u.username,
      u.avatar,
      up.avatar_base64,
      p.image_base64,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
      (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comments_count
    FROM posts p
    INNER JOIN users u ON p.author_id = u.id
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE p.author_id = $1 AND p.active = true
    ORDER BY p.created_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

// Obtener un post específico por ID
const getPostById = async (postId, userId) => {
  const query = `
    SELECT 
      p.id AS post_id,
      p.title,
      p.content,
      p.created_at,
      p.active,
      p.image_base64,
      u.username,
      u.avatar,
      up.avatar_base64
    FROM posts p
    INNER JOIN users u ON p.author_id = u.id
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE p.id = $1 AND p.author_id = $2
  `;
  const result = await pool.query(query, [postId, userId]);
  return result.rows[0];
};

// Actualizar un post
const updatePost = async (postId, userId, { title, content, image_base64 }) => {
  const query = `
    UPDATE posts 
    SET title = $1, content = $2, image_base64 = $3, updated_at = NOW()
    WHERE id = $4 AND author_id = $5 AND active = true
    RETURNING *
  `;
  const result = await pool.query(query, [title, content, image_base64, postId, userId]);
  return result.rows[0];
};

// Deshabilitar un post (soft delete)
const disablePost = async (postId, userId) => {
  const query = `
    UPDATE posts 
    SET active = false, updated_at = NOW()
    WHERE id = $1 AND author_id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [postId, userId]);
  return result.rows[0];
};

// Habilitar un post
const enablePost = async (postId, userId) => {
  const query = `
    UPDATE posts 
    SET active = true, updated_at = NOW()
    WHERE id = $1 AND author_id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [postId, userId]);
  return result.rows[0];
};

// Obtener publicaciones de usuarios que sigue el usuario actual
const getFollowingPosts = async (userId) => {
  const query = `
    SELECT 
      p.id AS post_id,
      p.author_id,
      p.title,
      p.content,
      p.created_at,
      p.active,
      u.username,
      u.avatar,
      up.avatar_base64,
      p.image_base64,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
      (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comments_count
    FROM posts p 
    INNER JOIN users u ON p.author_id = u.id 
    LEFT JOIN user_profiles up ON u.id = up.user_id 
    INNER JOIN user_followers uf ON p.author_id = uf.followed_id
    WHERE uf.follower_id = $1 AND p.active = true 
    ORDER BY p.created_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

module.exports = { 
  createPost,
  getAllPostsWithAuthor,
  getPostsByUser,
  getPostById,
  updatePost,
  disablePost,
  enablePost,
  getFollowingPosts
};
