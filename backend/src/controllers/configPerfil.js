const pool = require('../config/db');
const {
  getUserProfileByUserId,
  getUserBasicInfo,
  createUserProfile,
  updateUserProfile,
  getPublicUserProfile,
  getUserPosts,
  getUserFollowers,
  getUserFollowing,
  followUser,
  isFollowing,
  getFullUserProfileWithPosts
} = require('../models/perfil');

// Helper para obtener el id a partir de id o username
const getUserIdByKey = async (userKey) => {
  if (!userKey) return null;
  if (!isNaN(userKey)) {
    // Es un id numérico
    return parseInt(userKey);
  } else {
    const user = await pool.query('SELECT id FROM users WHERE username = $1', [userKey]);
    if (user.rows.length === 0) return null;
    return user.rows[0].id;
  }
};

const getProfile = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const user = await getUserBasicInfo(userId);
    const profile = await getUserProfileByUserId(userId);

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Obtener estadísticas del usuario
    const postsCount = await pool.query(
      'SELECT COUNT(*) as count FROM posts WHERE author_id = $1 AND active = true',
      [userId]
    );

    const followersCount = await pool.query(
      'SELECT COUNT(*) as count FROM user_followers WHERE followed_id = $1',
      [userId]
    );

    const followingCount = await pool.query(
      'SELECT COUNT(*) as count FROM user_followers WHERE follower_id = $1',
      [userId]
    );

    const totalLikes = await pool.query(
      'SELECT COUNT(*) as count FROM post_likes pl JOIN posts p ON pl.post_id = p.id WHERE p.author_id = $1 AND p.active = true',
      [userId]
    );

    const responseData = {
      username: user.username,
      email: user.email,
      description: profile?.description || '',
      avatar_base64: profile?.avatar_base64 || null,
      avatar: user.avatar || null,
      followers_count: parseInt(followersCount.rows[0].count),
      following_count: parseInt(followingCount.rows[0].count),
      total_likes: parseInt(totalLikes.rows[0].count),
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Nueva función para obtener perfil público de un usuario por id o username
const getPublicProfile = async (req, res) => {
  const { author_id } = req.params;
  try {
    const profile = await getPublicUserProfile(parseInt(author_id));
    if (!profile) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error al obtener perfil público:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Función para obtener publicaciones de un usuario específico por id o username
const getUserPostsController = async (req, res) => {
  const { author_id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const posts = await getUserPosts(parseInt(author_id), parseInt(limit), offset);
    res.json(posts);
  } catch (error) {
    console.error('Error al obtener publicaciones del usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Función para obtener seguidores de un usuario por id o username
const getUserFollowersController = async (req, res) => {
  const { author_id } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const followers = await getUserFollowers(parseInt(author_id), parseInt(limit), offset);
    res.json(followers);
  } catch (error) {
    console.error('Error al obtener seguidores:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Función para obtener usuarios que sigue un usuario por id o username
const getUserFollowingController = async (req, res) => {
  const { author_id } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const following = await getUserFollowing(parseInt(author_id), parseInt(limit), offset);
    res.json(following);
  } catch (error) {
    console.error('Error al obtener seguidos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const updateProfile = async (req, res) => {
  const { id: userId } = req.user;
  const { base64Image, description } = req.body;

  if (!base64Image && !description) {
    return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
  }

  try {
    const profile = await getUserProfileByUserId(userId);

    if (!profile) {
      await createUserProfile(userId, base64Image || null, description || '');
    } else {
      await updateUserProfile(userId, base64Image || null, description || null);
    }

    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Controlador para seguir/dejar de seguir a un usuario por id
const followUserController = async (req, res) => {
  const followerId = req.user.id;
  const { author_id } = req.params;
  console.log('🔹 Petición para seguir/dejar de seguir recibida');
  console.log('➡️  ID del seguidor (followerId):', followerId);
  console.log('➡️  ID del usuario a seguir (author_id):', author_id);

  try {
    const followedId = parseInt(author_id);
    if (!followedId) return res.status(404).json({ message: 'Usuario no encontrado' });
    // Validar que el usuario seguido exista
    const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [followedId]);
    if (userExists.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    if (parseInt(followerId) === followedId) {
      return res.status(400).json({ message: 'No puedes seguirte a ti mismo.' });
    }
    const result = await followUser(followerId, followedId);
    res.json(result);
  } catch (error) {
    console.error('❌ Error al seguir usuario:', error);
    if (error instanceof Error) {
      console.error('🔴 Mensaje de error:', error.message);
      if (error.stack) console.error('🔴 Stack:', error.stack);
    } else {
      console.error('🔴 Error desconocido:', error);
    }
    res.status(500).json({ message: 'Error del servidor', error: error.message || error });
  }
};

// Controlador para verificar si el usuario actual sigue a otro usuario por id
const isFollowingController = async (req, res) => {
  const followerId = req.user.id;
  const { author_id } = req.params;
  try {
    const followedId = parseInt(author_id);
    if (!followedId) return res.status(404).json({ message: 'Usuario no encontrado' });
    const following = await isFollowing(followerId, followedId);
    res.json({ following });
  } catch (error) {
    console.error('Error al verificar seguimiento:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Nuevo controlador para obtener perfil público y publicaciones de un usuario por id o username
const getFullPublicProfileController = async (req, res) => {
  const { author_id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const data = await getFullUserProfileWithPosts(author_id, parseInt(limit), offset);
    if (!data) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(data);
  } catch (error) {
    console.error('Error al obtener perfil y publicaciones públicas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  getProfile,
  getPublicProfile,
  getUserPostsController,
  getUserFollowersController,
  getUserFollowingController,
  updateProfile,
  followUserController,
  isFollowingController,
  getFullPublicProfileController // exportar nuevo controlador
};
