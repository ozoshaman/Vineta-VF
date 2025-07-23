const { 
  createPost,
  getAllPostsWithAuthor,
  getPostsByUser,
  getPostById,
  updatePost,
  disablePost,
  enablePost,
  getFollowingPosts
} = require('../models/feed_model');

//Obtiene el feed
const getFeed = async (req, res) => {
  try {
    const posts = await getAllPostsWithAuthor();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error al obtener el feed:', error);
    res.status(500).json({ message: 'Error al obtener el feed' });
  }
};

//Crea un nuevo post
const createNewPost = async (req, res) => {
  const { title, content, image_base64 } = req.body;
  const author_id = req.user.id; // Viene del token

  if (!title || !content) {
    return res.status(400).json({ message: 'Título y contenido son obligatorios' });
  }

  try {
    const postId = await createPost({ title, content, author_id, image_base64 });
    res.status(201).json({ message: 'Publicación creada', postId });
  } catch (error) {
    console.error('Error al crear publicación:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

//Obtener el post por usuario 
const getMyPosts = async (req, res) => {
  const userId = req.user.id; // viene del token

  try {
    const posts = await getPostsByUser(userId);
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error al obtener publicaciones del usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


// Obtener un post específico para editar
const getPostForEdit = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await getPostById(postId, userId);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Error al obtener publicación para editar:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Actualizar un post
const updateExistingPost = async (req, res) => {
  const { postId } = req.params;
  const { title, content, image_base64 } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ message: 'Título y contenido son obligatorios' });
  }

  try {
    const updatedPost = await updatePost(postId, userId, { title, content, image_base64 });
    if (!updatedPost) {
      return res.status(404).json({ message: 'Publicación no encontrada o no tienes permisos' });
    }
    res.status(200).json({ message: 'Publicación actualizada', post: updatedPost });
  } catch (error) {
    console.error('Error al actualizar publicación:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Deshabilitar un post
const disableExistingPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const disabledPost = await disablePost(postId, userId);
    if (!disabledPost) {
      return res.status(404).json({ message: 'Publicación no encontrada o no tienes permisos' });
    }
    res.status(200).json({ message: 'Publicación deshabilitada', post: disabledPost });
  } catch (error) {
    console.error('Error al deshabilitar publicación:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Habilitar un post
const enableExistingPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const enabledPost = await enablePost(postId, userId);
    if (!enabledPost) {
      return res.status(404).json({ message: 'Publicación no encontrada o no tienes permisos' });
    }
    res.status(200).json({ message: 'Publicación habilitada', post: enabledPost });
  } catch (error) {
    console.error('Error al habilitar publicación:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener publicaciones de usuarios seguidos
const getFollowingFeed = async (req, res) => {
  const userId = req.user.id; // Viene del token

  try {
    const posts = await getFollowingPosts(userId);
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error al obtener el feed de seguidos:', error);
    res.status(500).json({ message: 'Error al obtener el feed de seguidos' });
  }
};

module.exports = {
  getFeed,
  createNewPost,
  getMyPosts,
  getPostForEdit,
  updateExistingPost,
  disableExistingPost,
  enableExistingPost,
  getFollowingFeed
};
