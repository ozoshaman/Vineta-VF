const pool = require('../config/db');

const getUserProfileByUserId = async (userId) => {
  const profile = await pool.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
  return profile.rows[0];
};

const getUserBasicInfo = async (userId) => {
  const result = await pool.query('SELECT username, email, avatar FROM users WHERE id = $1', [userId]);
  return result.rows[0];
};

// Nueva función para obtener perfil público completo de un usuario
const getPublicUserProfile = async (userId) => {
  try {
    // Obtener información básica del usuario
    const userInfo = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userInfo.rows.length === 0) {
      return null;
    }

    // Obtener información del perfil
    const profileInfo = await pool.query(
      'SELECT avatar_base64, description FROM user_profiles WHERE user_id = $1',
      [userId]
    );

    // Contar publicaciones del usuario
    const postsCount = await pool.query(
      'SELECT COUNT(*) as count FROM posts WHERE author_id = $1 AND active = true',
      [userId]
    );

    // Contar seguidores (usuarios que siguen a este usuario)
    const followersCount = await pool.query(
      'SELECT COUNT(*) as count FROM user_followers WHERE followed_id = $1',
      [userId]
    );

    // Contar seguidos (usuarios que este usuario sigue)
    const followingCount = await pool.query(
      'SELECT COUNT(*) as count FROM user_followers WHERE follower_id = $1',
      [userId]
    );

    // Contar likes totales en las publicaciones del usuario
    const totalLikes = await pool.query(
      'SELECT COUNT(*) as count FROM post_likes pl JOIN posts p ON pl.post_id = p.id WHERE p.author_id = $1 AND p.active = true',
      [userId]
    );

    return {
      ...userInfo.rows[0],
      avatar_base64: profileInfo.rows[0]?.avatar_base64 || null,
      description: profileInfo.rows[0]?.description || '',
      stats: {
        posts: parseInt(postsCount.rows[0].count),
        followers: parseInt(followersCount.rows[0].count),
        following: parseInt(followingCount.rows[0].count),
        totalLikes: parseInt(totalLikes.rows[0].count)
      }
    };
  } catch (error) {
    console.error('Error en getPublicUserProfile:', error);
    throw error;
  }
};

// Función para obtener las publicaciones de un usuario específico
const getUserPosts = async (userId, limit = 10, offset = 0) => {
  const query = `
    SELECT 
      p.id AS post_id,
      p.title,
      p.content,
      p.created_at,
      p.image_base64,
      p.active,
      u.username,
      up.avatar_base64,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count
    FROM posts p
    INNER JOIN users u ON p.author_id = u.id
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE p.author_id = $1 AND p.active = true
    ORDER BY p.created_at DESC
    LIMIT $2 OFFSET $3
  `;
  
  const result = await pool.query(query, [userId, limit, offset]);
  return result.rows;
};

// Función para obtener seguidores de un usuario
const getUserFollowers = async (userId, limit = 20, offset = 0) => {
  const query = `
    SELECT 
      u.id,
      u.username,
      up.avatar_base64,
      uf.created_at as followed_at
    FROM user_followers uf
    INNER JOIN users u ON uf.follower_id = u.id
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE uf.followed_id = $1
    ORDER BY uf.created_at DESC
    LIMIT $2 OFFSET $3
  `;
  
  const result = await pool.query(query, [userId, limit, offset]);
  return result.rows;
};

// Función para obtener usuarios que sigue un usuario
const getUserFollowing = async (userId, limit = 20, offset = 0) => {
  const query = `
    SELECT 
      u.id,
      u.username,
      up.avatar_base64,
      uf.created_at as followed_at
    FROM user_followers uf
    INNER JOIN users u ON uf.followed_id = u.id
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE uf.follower_id = $1
    ORDER BY uf.created_at DESC
    LIMIT $2 OFFSET $3
  `;
  
  const result = await pool.query(query, [userId, limit, offset]);
  return result.rows;
};

const createUserProfile = async (userId, avatarBase64, description) => {
  await pool.query(
    'INSERT INTO user_profiles (user_id, avatar_base64, description) VALUES ($1, $2, $3)',
    [userId, avatarBase64, description]
  );
};

const updateUserProfile = async (userId, avatarBase64, description) => {
  await pool.query(
    `UPDATE user_profiles
     SET avatar_base64 = COALESCE($1, avatar_base64),
         description = COALESCE($2, description)
     WHERE user_id = $3`,
    [avatarBase64, description, userId]
  );
};

// Seguir o dejar de seguir a un usuario (toggle)
const followUser = async (followerId, followedId) => {
  try {
    console.log('🔹 [followUser] INICIO');
    console.log('➡️  followerId:', followerId, '➡️  followedId:', followedId);

    const selectQuery = 'SELECT id FROM user_followers WHERE follower_id = $1 AND followed_id = $2';
    console.log('📄 SELECT QUERY:', selectQuery, '➡️ Params:', [followerId, followedId]);
    const existing = await pool.query(selectQuery, [followerId, followedId]);

    if (existing.rows.length > 0) {
      const deleteQuery = 'DELETE FROM user_followers WHERE follower_id = $1 AND followed_id = $2 RETURNING id';
      console.log('📄 DELETE QUERY:', deleteQuery, '➡️ Params:', [followerId, followedId]);
      const del = await pool.query(deleteQuery, [followerId, followedId]);

      return { following: false, message: 'Has dejado de seguir al usuario.' };
    } else {
      const insertQuery = 'INSERT INTO user_followers (follower_id, followed_id, created_at) VALUES ($1, $2, NOW()) RETURNING id';
      console.log('📄 INSERT QUERY:', insertQuery, '➡️ Params:', [followerId, followedId]);
      const ins = await pool.query(insertQuery, [followerId, followedId]);

      return { following: true, message: 'Ahora sigues al usuario.' };
    }
  } catch (error) {
    console.error('❌ [followUser] Error:', error);
    throw error;
  }
};


// Verificar si el usuario actual sigue a otro usuario
const isFollowing = async (followerId, followedId) => {
  const result = await pool.query(
    'SELECT id FROM user_followers WHERE follower_id = $1 AND followed_id = $2',
    [followerId, followedId]
  );
  return result.rows.length > 0;
};

// Ajustar getFullUserProfileWithPosts para recibir author_id directamente
const getFullUserProfileWithPosts = async (author_id, limit = 10, offset = 0) => {
  // author_id ya es el id numérico
  const userId = parseInt(author_id);
  const profile = await getPublicUserProfile(userId);
  if (!profile) return null;
  const posts = await getUserPosts(userId, limit, offset);
  return { ...profile, posts };
};

module.exports = {
  getUserProfileByUserId,
  getUserBasicInfo,
  getPublicUserProfile,
  getUserPosts,
  getUserFollowers,
  getUserFollowing,
  createUserProfile,
  updateUserProfile,
  followUser,
  isFollowing,
  getFullUserProfileWithPosts
};
