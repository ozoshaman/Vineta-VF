import { useState } from 'react';
import { createPost } from '../api/auth';
import '../styles/CreatePost.css';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

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

    try {
      const postData = {
        title,
        content,
        image_base64: imagePreview || null
      };

      await createPost(postData, token);

      setTitle('');
      setContent('');
      setImageFile(null);
      setImagePreview('');
      navigate('/myposts');
    } catch (error) {
      console.error('Error al crear publicación:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2>✏️ Crear Nueva Publicación</h2>
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

        <button className='create_button' type="submit" disabled={loading}>
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
