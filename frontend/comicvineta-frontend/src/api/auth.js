import axios from 'axios';

const API = axios.create({
  //baseURL: 'http://localhost:4000/api',
  baseURL: process.env.REACT_APP_API_URL || 'https://comic-vineta.onrender.com'
});

//Registro de un usuario
export const registerUser = (data) => API.post('/register', data);

//Logeo de un usuario
export const loginUser = (data) => API.post('/login', data);

//Verificar el codigo
export const verifyCode = (data) => API.post('/verify', data);

//Reenviar el codigo al correo
export const resendVerificationCode = (data) => API.post('/resend-code', data);

//Cambio de contraseña primer inicio
export const changeForcedPassword = (newPassword, token) => {
  return API.put('/profile/password', 
    { newPassword }, 
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

//Cambio de contraseña Olvide mi contras
export const changeForgotPassword = (newPassword, token) => {
  return API.put('/profile/password', 
    { newPassword }, 
    { headers: { Authorization: `Bearer ${token}` } }
  );
};


// Función para solicitar código de recuperación
export const forgotPassword = (email) => {
  return API.post('/forgot-password', { email });
};

// Función para restablecer contraseña con código
export const resetForgottenPassword = (email, newPassword, code) => {
  return API.put('/reset-password', { 
    email, 
    code, 
    newPassword 
  });
};

// Obtener el perfil del usuario
export const getProfile = async (token) => {
  const res = await API.get('/profile', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

// Actualizar avatar y descripción del perfil
export const updateProfile = async ({ base64Image, description }, token) => {
  const res = await API.put('/profile', {
    base64Image,
    description
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

// Obtener perfil público de un usuario por id
export const getPublicUserProfile = async (author_id, token) => {
  const res = await API.get(`/user/${author_id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

// Obtener publicaciones de un usuario específico por id
export const getUserPosts = async (author_id, token, page = 1, limit = 10) => {
  const res = await API.get(`/user/${author_id}/posts?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

// Obtener seguidores de un usuario por id
export const getUserFollowers = async (author_id, token, page = 1, limit = 20) => {
  const res = await API.get(`/user/${author_id}/followers?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

// Obtener usuarios que sigue un usuario por id
export const getUserFollowing = async (author_id, token, page = 1, limit = 20) => {
  const res = await API.get(`/user/${author_id}/following?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

// Obtener el feed general
export const fetchFeed = (token) => {
  return API.get('/posts/feed', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};

// Obtener el feed de usuarios seguidos
export const fetchFollowingFeed = (token) => {
  return API.get('/posts/following-feed', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};

// ===== FUNCIONES PARA LIKES =====

// Dar/quitar like a un post
export const toggleLike = (postId, token) => {
  return API.post(`/posts/${postId}/like`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};

// Obtener likes de un post
export const getPostLikes = (postId, token) => {
  return API.get(`/posts/${postId}/likes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};

// Verificar si el usuario dio like
export const checkUserLike = (postId, token) => {
  return API.get(`/posts/${postId}/like/check`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};

// ===== FUNCIONES PARA COMENTARIOS =====

// Crear un comentario
export const addComment = (postId, content, token) => {
  return API.post(`/posts/${postId}/comments`, { content }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};

// Obtener comentarios de un post
export const getPostComments = (postId, page = 1, limit = 10, token) => {
  return API.get(`/posts/${postId}/comments?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};

// Actualizar un comentario
export const updateComment = (commentId, content, token) => {
  return API.put(`/comments/${commentId}`, { content }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};

// Eliminar un comentario
export const deleteComment = (commentId, token) => {
  return API.delete(`/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};

// Crear una nueva publicación con imagen (opcional)
export const createPost = (postData, token) => {
  return API.post('/create', postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Obtener publicaciones del usuario logueado
export const fetchMyPosts = (token) => {
  return API.get('/posts/my-posts', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};

// Obtener un post específico para editar
export const fetchPostForEdit = (postId, token) => {
  return API.get(`/posts/edit/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};

// Actualizar un post
export const updatePost = (postId, postData, token) => {
  return API.put(`/posts/update/${postId}`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Deshabilitar un post
export const disablePost = (postId, token) => {
  return API.patch(`/posts/disable/${postId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Habilitar un post
export const enablePost = (postId, token) => {
  return API.patch(`/posts/enable/${postId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Verificar si el usuario actual sigue a otro usuario
export async function isFollowingUser(author_id, token) {
  try {
    const res = await API.get(`/user/${author_id}/is-following`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    console.error('❌ Error al verificar seguimiento:', error);
    throw new Error('Error al verificar seguimiento');
  }
}

// Seguir o dejar de seguir a un usuario (toggle)
export async function toggleFollowUser(author_id, token) {
  console.log('🔸 toggleFollowUser llamado');
  console.log('➡️  author_id:', author_id);
  console.log('📦 token:', token);

  try {
    const res = await API.post(`/user/${author_id}/follow`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Respuesta del backend:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Error al seguir/dejar de seguir:', error.response?.data || error.message);
    throw new Error('Error al seguir/dejar de seguir');
  }
}

// Obtener perfil público y publicaciones de un usuario (nueva ruta)
export const getFullUserProfileWithPosts = async (author_id, token, page = 1, limit = 10) => {
  const res = await API.get(`/user/${author_id}/full?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};