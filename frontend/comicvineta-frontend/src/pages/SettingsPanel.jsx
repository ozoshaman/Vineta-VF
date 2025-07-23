import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import '../styles/SettingsPanel.css';

function SettingsPanel() {
  const [user, setUser] = useState({});
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(token);
        setUser(data);
        setDescription(data.description || '');
        setPreview(data.avatar_base64 || '');
      } catch (error) {
        console.error('Error al obtener perfil:', error);
        setMessage('Error al cargar el perfil');
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let base64Image = preview;

      // Si el usuario seleccionó una nueva imagen, lee el archivo
      if (selectedFile && !preview.startsWith('data:image/')) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          base64Image = reader.result;
          await sendUpdate(base64Image);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        await sendUpdate(base64Image);
      }
    } catch (error) {
      console.error('Error al procesar imagen:', error);
      setMessage('Error al procesar la imagen');
      setLoading(false);
    }
  };

  const sendUpdate = async (base64Image) => {
    try {
      await updateProfile({ base64Image, description }, token);
      setMessage('Perfil actualizado exitosamente');
      setSelectedFile(null);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setMessage('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>⚙️ Configuración del Perfil</h2>
        <p>Edita tu información personal y foto de perfil</p>
      </div>

      <div className="settings-content">
        <form onSubmit={handleSubmit} className="settings-form">
          {/* Vista previa del avatar */}
          <div className="avatar-section">
            <h3>Foto de Perfil</h3>
            <div className="avatar-preview">
              <img
                src={preview || user.avatar || '/default-avatar.png'}
                alt="Avatar"
                className="avatar-preview-image"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="avatar-input"
              id="avatar-input"
            />
            <label htmlFor="avatar-input" className="avatar-input-label">
              📷 Cambiar foto
            </label>
            <p className="avatar-hint">
              Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
            </p>
          </div>

          {/* Información del usuario */}
          <div className="user-info-section">
            <h3>Información Personal</h3>
            
            <div className="form-group">
              <label htmlFor="username">Nombre de usuario</label>
              <input
                type="text"
                id="username"
                value={user.username || ''}
                disabled
                className="form-input disabled"
              />
              <small>El nombre de usuario no se puede cambiar</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                value={user.email || ''}
                disabled
                className="form-input disabled"
              />
              <small>El correo electrónico no se puede cambiar</small>
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={200}
                placeholder="Cuéntanos algo sobre ti..."
                className="form-textarea"
              />
              <small>{description.length}/200 caracteres</small>
            </div>
          </div>

          {/* Mensajes de estado */}
          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          {/* Botón de guardar */}
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading} 
              className="save-button"
            >
              {loading ? '💾 Guardando...' : '💾 Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsPanel;
