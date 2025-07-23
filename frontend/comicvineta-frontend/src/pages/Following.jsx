import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchFollowingFeed, isFollowingUser, toggleFollowUser } from '../api/auth';
import PostInteractions from '../components/PostInteractions';
import { useAuth } from '../context/AuthContext';
import '../styles/Feed.css';

function Following() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followStates, setFollowStates] = useState({}); // userId: true/false
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadFollowingFeed = async () => {
      try {
        const data = await fetchFollowingFeed(token);
        setPosts(data);
        // Consultar seguimiento solo para autores distintos al usuario actual
        const followChecks = await Promise.all(
          data.map(async (post) => {
            if (user && post.author_id !== user.id) {
              try {
                const res = await isFollowingUser(post.author_id, token);
                return [post.author_id, res.following];
              } catch {
                return [post.author_id, false];
              }
            }
            return [post.author_id, null];
          })
        );
        const followObj = Object.fromEntries(followChecks);
        setFollowStates(followObj);
      } catch (error) {
        console.error('Error al cargar el feed de seguidos:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadFollowingFeed();
  }, [token, user]);

  const handleFollow = async (author_id) => {
    console.log('🔹 handleFollow ejecutado');
    console.log('➡️  author_id:', author_id);
    console.log('📦 Enviando token:', token);
    try {
      const res = await toggleFollowUser(author_id, token);
      console.log('✅ Respuesta de toggleFollowUser:', res);
      setFollowStates((prev) => ({ ...prev, [author_id]: res.following }));
    } catch (error) {
      console.error('❌ Error en handleFollow:', error);
      alert('Error al seguir/dejar de seguir al usuario');
    }
  };

  return (
    <div className="feed-container">
      <h2>👥 Publicaciones de Usuarios que Sigues</h2>

      {loading && <p>Cargando publicaciones...</p>}

      {!loading && posts.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>No hay publicaciones de usuarios que sigues por ahora.</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Comienza a seguir usuarios para ver sus publicaciones aquí.
          </p>
        </div>
      )}

      {posts.map((post) => {
        console.log('POST EN FOLLOWING:', post);
        return (
          <div className="post-card" key={post.post_id}>
            <div className="post-header">
              <img
                src={post.avatar_base64 || post.avatar || '/default-avatar.png'}
                alt="Avatar"
                className="avatar"
              />
              <div>
                <Link 
                  to={`/user/${post.author_id}`}
                  style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}
                  onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.target.style.textDecoration = 'none'}
                >
                  {post.username}
                </Link>
                {/* Botón de seguir */}
                {user && post.author_id !== user.id && followStates[post.author_id] !== null && (
                  <button
                    style={{
                      marginLeft: 10,
                      padding: '2px 10px',
                      borderRadius: 12,
                      border: 'none',
                      background: followStates[post.author_id] ? '#e0e0e0' : '#007bff',
                      color: followStates[post.author_id] ? '#333' : '#fff',
                      cursor: 'pointer',
                      fontSize: 13
                    }}
                    onClick={() => handleFollow(post.author_id)}
                  >
                    {followStates[post.author_id] ? 'Siguiendo' : 'Seguir'}
                  </button>
                )}
                <br />
                <small>{new Date(post.created_at).toLocaleString()}</small>
              </div>
            </div>

            <h3>{post.title}</h3>
            <p>{post.content}</p>

            {post.image_base64 && (
              <img src={post.image_base64} alt="Imagen del post" className="post-image" />
            )}

            {/* Componente de interacciones */}
            <PostInteractions 
              post={post} 
              token={token} 
              currentUserId={user?.id} 
            />
          </div>
        );
      })}
    </div>
  );
}

export default Following;
