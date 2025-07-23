import { useState, useEffect } from 'react';
import { getProfile, fetchMyPosts } from '../api/auth';
import PostInteractions from '../components/PostInteractions';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

function Profile() {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const { token, user: currentUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(token);
        setUser(data);
      } catch (error) {
        console.error('Error al obtener perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const data = await fetchMyPosts(token);
        setPosts(data);
      } catch (error) {
        console.error('Error al obtener publicaciones:', error);
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    };

    if (token) {
      fetchProfile();
      fetchUserPosts();
    }
  }, [token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header del perfil */}
      <div className="profile-header">
        <div className="profile-avatar-section">
          <img
            src={user.avatar_base64 || user.avatar || '/default-avatar.png'}
            alt="Avatar"
            className="profile-avatar"
          />
        </div>
        
        <div className="profile-info">
          <h2 className="profile-username">{user.username}</h2>
          <p className="profile-email">{user.email}</p>
          {user.description && (
            <p className="profile-description">{user.description}</p>
          )}
        </div>
      </div>

      {/* Estadísticas del perfil */}
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-number">{posts.length}</span>
          <span className="stat-label">Publicaciones</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{user.followers_count || 0}</span>
          <span className="stat-label">Seguidores</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{user.following_count || 0}</span>
          <span className="stat-label">Siguiendo</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{user.total_likes || 0}</span>
          <span className="stat-label">Likes</span>
        </div>
      </div>

      {/* Sección de publicaciones */}
      <div className="profile-posts-section">
        <h3>Mis Publicaciones</h3>
        
        {postsLoading && <div className="loading">Cargando publicaciones...</div>}
        
        {!postsLoading && posts.length === 0 && (
          <div className="empty-posts">
            <p>No tienes publicaciones aún.</p>
            <p>¡Crea tu primera publicación!</p>
          </div>
        )}

        {!postsLoading && posts.length > 0 && (
          <div className="posts-grid">
            {posts.map((post) => (
              <div className="post-card" key={post.post_id}>
                <div className="post-header">
                  <img
                    src={post.avatar_base64 || post.avatar || '/default-avatar.svg'}
                    alt="Avatar"
                    className="post-avatar"
                  />
                  <div className="post-info">
                    <strong className="post-username">{post.username}</strong>
                    <small className="post-date">{formatDate(post.created_at)}</small>
                  </div>
                </div>

                <h4 className="post-title">{post.title}</h4>
                <p className="post-content">{post.content}</p>

                {post.image_base64 && (
                  <img 
                    src={post.image_base64} 
                    alt="Imagen del post" 
                    className="post-image" 
                  />
                )}

                {/* Componente de interacciones */}
                <PostInteractions 
                  post={post} 
                  token={token} 
                  currentUserId={currentUser?.id} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
