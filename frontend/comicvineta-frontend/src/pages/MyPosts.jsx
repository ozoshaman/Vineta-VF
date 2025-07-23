import { useEffect, useState } from 'react';
import { fetchMyPosts, disablePost, enablePost } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/Feed.css'; // reutiliza estilos del feed

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const loadMyPosts = async () => {
      try {
        const data = await fetchMyPosts(token);
        setPosts(data);
      } catch (error) {
        console.error('Error al cargar tus publicaciones:', error);
        setPosts([]); // para evitar undefined
      } finally {
        setLoading(false);
      }
    };

    loadMyPosts();
  }, [token]);

  const handleCreatePost = () => {
    navigate('/create');
  };

  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleTogglePostStatus = async (postId, currentStatus) => {
    try {
      if (currentStatus) {
        await disablePost(postId, token);
      } else {
        await enablePost(postId, token);
      }
      // Recargar las publicaciones
      const data = await fetchMyPosts(token);
      setPosts(data);
    } catch (error) {
      console.error('Error al cambiar estado de la publicación:', error);
    }
  };

  return (
    <div className="feed-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📂 Mis Publicaciones</h2>
        <button className="create-post-button" onClick={handleCreatePost}>
          ➕ Crear Publicación
        </button>
      </div>

      {loading && <p>Cargando publicaciones...</p>}

      {!loading && posts.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Aún no has publicado nada.</p>
      )}

      {posts.map((post) => (
        <div className={`post-card ${!post.active ? 'disabled-post' : ''}`} key={post.post_id}>
          <div className="post-header">
            <img
              src={post.avatar_base64 || post.avatar || '/default-avatar.png'}
              alt="Avatar"
              className="avatar"
            />
            <div>
              <strong>{post.username}</strong><br />
              <small>{new Date(post.created_at).toLocaleString()}</small>
              {!post.active && <span style={{ color: 'red', marginLeft: '10px' }}>⚠️ Deshabilitada</span>}
            </div>
          </div>

          <h3>{post.title}</h3>
          <p>{post.content}</p>

          {post.image_base64 && (
            <img src={post.image_base64} alt="Imagen del post" className="post-image" />
          )}

          <div className="post-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => handleEditPost(post.post_id)}
              style={{ 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                padding: '5px 10px', 
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              ✏️ Editar
            </button>
            <button 
              onClick={() => handleTogglePostStatus(post.post_id, post.active)}
              style={{ 
                backgroundColor: post.active ? '#dc3545' : '#28a745', 
                color: 'white', 
                border: 'none', 
                padding: '5px 10px', 
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              {post.active ? '🚫 Deshabilitar' : '✅ Habilitar'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyPosts;
