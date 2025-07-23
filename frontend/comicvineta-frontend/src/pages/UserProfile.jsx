import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getFullUserProfileWithPosts, // importar nueva función
  getUserFollowers, 
  getUserFollowing, 
  isFollowingUser, 
  toggleFollowUser 
} from '../api/auth';
import { useAuth } from '../context/AuthContext';
import '../styles/UserProfile.css';

function UserProfile() {
  const { author_id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFollowing, setIsFollowing] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    // Solo consultar si no es tu propio perfil
    if (currentUser && currentUser.id !== author_id) {
      checkFollowing();
    } else {
      setIsFollowing(null);
    }
    // eslint-disable-next-line
  }, [author_id, currentUser]);

  useEffect(() => {
    if (user && activeTab !== 'posts') {
      fetchTabData();
    }
  }, [activeTab, currentPage, user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
       // Log para ver qué valores se están enviando
      console.log('Obteniendo perfil con los siguientes parámetros:');
      console.log('author_id:', author_id);
      console.log('token:', token);
      console.log('página:', 1);
      console.log('límite:', 10);
      // Usar la nueva función para obtener perfil y publicaciones juntos
      const userData = await getFullUserProfileWithPosts(author_id, token, 1, 10);
       // Verificar qué datos se reciben
      console.log('Datos recibidos del perfil completo:', userData);
      setUser(userData);
      setPosts(userData.posts || []);
    } catch (err) {
      console.error('Error al obtener perfil del usuario:', err);
      setError('No se pudo cargar el perfil del usuario');
    } finally {
      setLoading(false);
    }
  };

  const fetchTabData = async () => {
    try {
      setLoading(true);
      setError(null);
      let followersData, followingData;
      switch (activeTab) {
        case 'followers':
          followersData = await getUserFollowers(author_id, token, currentPage, 20);
          setFollowers(followersData);
          setHasMore(followersData.length === 20);
          break;
        case 'following':
          followingData = await getUserFollowing(author_id, token, currentPage, 20);
          setFollowing(followingData);
          setHasMore(followingData.length === 20);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(`Error al obtener datos de ${activeTab}:`, err);
      setError(`No se pudieron cargar los ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderPosts = () => {
    if (posts.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <p>Este usuario aún no ha publicado nada</p>
        </div>
      );
    }

    return (
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.post_id} className="post-card">
            <div className="post-header">
              {post.avatar_base64 && (
                <img 
                  src={post.avatar_base64} 
                  alt={post.username} 
                  className="post-avatar"
                />
              )}
              <div>
                <div className="post-author">{post.username}</div>
                <div className="post-date">{formatDate(post.created_at)}</div>
              </div>
            </div>
            <h3 className="post-title">{post.title}</h3>
            <p className="post-content">{post.content}</p>
            {post.image_base64 && (
              <img 
                src={post.image_base64} 
                alt="Post" 
                className="post-image"
              />
            )}
            <div className="post-likes">
              ❤️ {post.likes_count} me gusta
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderUsersList = (users, emptyMessage) => {
    if (users.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="users-list">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            {user.avatar_base64 && (
              <img 
                src={user.avatar_base64} 
                alt={user.username} 
                className="user-item-avatar"
              />
            )}
            <div className="user-item-info">
              <div className="user-item-username">{user.username}</div>
              <div className="user-item-date">
                {activeTab === 'followers' ? 'Te sigue desde' : 'Siguiendo desde'} {formatDate(user.followed_at)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    if (!hasMore && currentPage === 1) return null;

    return (
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="pagination-button active">{currentPage}</span>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasMore}
        >
          Siguiente
        </button>
      </div>
    );
  };

  const checkFollowing = async () => {
    try {
      const res = await isFollowingUser(author_id, token);
      setIsFollowing(res.following);
    } catch {
      setIsFollowing(false);
    }
  };

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      const res = await toggleFollowUser(author_id, token);
      setIsFollowing(res.following);
    } catch {
      alert('Error al seguir/dejar de seguir al usuario');
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="user-profile-container">
        <div className="loading">Cargando perfil...</div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="user-profile-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => navigate('/feed')}>Volver al feed</button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-container">
        <div className="error">
          <p>Usuario no encontrado</p>
          <button onClick={() => navigate('/feed')}>Volver al feed</button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        {user.avatar_base64 && (
          <img 
            src={user.avatar_base64} 
            alt={user.username} 
            className="user-avatar"
          />
        )}
        <div className="user-info">
          <h1 className="user-username" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {user.username}
            {/* Botón de seguir/deseguir */}
            {currentUser && currentUser.id !== author_id && isFollowing !== null && (
              <button
                style={{
                  padding: '4px 16px',
                  borderRadius: 16,
                  border: 'none',
                  background: isFollowing ? '#e0e0e0' : '#007bff',
                  color: isFollowing ? '#333' : '#fff',
                  cursor: followLoading ? 'wait' : 'pointer',
                  fontSize: 15
                }}
                onClick={handleFollow}
                disabled={followLoading}
              >
                {followLoading ? '...' : isFollowing ? 'Siguiendo' : 'Seguir'}
              </button>
            )}
          </h1>
          <p className="user-email">{user.email}</p>
          {user.description && (
            <p className="user-description">{user.description}</p>
          )}
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-number">{user.stats.posts}</span>
              <span className="stat-label">Publicaciones</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{user.stats.followers}</span>
              <span className="stat-label">Seguidores</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{user.stats.following}</span>
              <span className="stat-label">Siguiendo</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{user.stats.totalLikes}</span>
              <span className="stat-label">Me gusta</span>
            </div>
          </div>
        </div>
      </div>

      <div className="user-profile-tabs">
        <button
          className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => handleTabChange('posts')}
        >
          Publicaciones
        </button>
        <button
          className={`tab-button ${activeTab === 'followers' ? 'active' : ''}`}
          onClick={() => handleTabChange('followers')}
        >
          Seguidores
        </button>
        <button
          className={`tab-button ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => handleTabChange('following')}
        >
          Siguiendo
        </button>
      </div>

      <div className="tab-content">
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <>
            {activeTab === 'posts' && renderPosts()}
            {activeTab === 'followers' && renderUsersList(followers, 'Este usuario aún no tiene seguidores')}
            {activeTab === 'following' && renderUsersList(following, 'Este usuario aún no sigue a nadie')}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}

export default UserProfile; 