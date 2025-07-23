import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostForEdit, updatePost } from '../api/auth';
import '../styles/CreatePost.css';

function EditPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { postId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadPost = async () => {
      try {
        const post = await fetchPostForEdit(postId, token);
        setTitle(post.title);
        setContent(post.content);
        setImagePreview(post.image_base64 || '');
      } catch (error) {
        console.error('Error al cargar la publicación:', error);
        setError('No se pudo cargar la publicación');
      } finally {
        setInitialLoading(false);
      }
    };

    loadPost();
  }, [postId, token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const postData = {
        title,
        content,
        image_base64: imagePreview || null
      };

      await updatePost(postId, postData, token);

      navigate('/myposts');
    } catch (error) {
      console.error('Error al actualizar publicación:', error);
      setError('Error al actualizar la publicación');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="create-post-container">Cargando publicación...</div>;
  }

  if (error) {
    return (
      <div className="create-post-container">
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => navigate('/myposts')}>Volver a mis publicaciones</button>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      <h2>✏️ Editar Publicación</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="¿Qué estás pensando?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {imagePreview && (
          <img src={imagePreview} alt="Vista previa" className="preview-image" />
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            type="button" 
            onClick={() => navigate('/myposts')}
            style={{ backgroundColor: '#6c757d' }}
          >
            Cancelar
          </button>
          <button className='create_button' type="submit" disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPost; 