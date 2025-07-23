import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { changeForcedPassword } from '../api/auth';
import '../styles/ChangePassword.css';

// Valida que la contraseña cumpla un formato adecuado
function isStrongPassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
  return regex.test(password);
}

function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  // Verificar token al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No hay sesión activa. Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [navigate]);

  const handleChange = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Verificar token antes de proceder
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial');
      return;
    }

    try {
      setLoading('cambiando');
      const res = await changeForcedPassword(newPassword, token);
      setMessage(res.data.message);
      
      // Opcional: Limpiar campos después del éxito
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
      
    } catch (err) {
      console.error('Error cambiando contraseña:', err);
      
      // Manejo específico de errores
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Sesión expirada. Redirigiendo al login...');
        localStorage.removeItem('token'); // Limpiar token inválido
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.response?.data?.message || 'Error al cambiar contraseña');
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className='Change_Container'>
      <form className="change-form" onSubmit={handleChange}>
        <h2>Cambiar contraseña</h2>

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={loading !== null}
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading !== null}
        />

        <p className="password-hint">
          🔒 La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial.
        </p>

        <button type="submit" disabled={loading !== null}>
          {loading === 'cambiando' ? 'Actualizando...' : 'Actualizar'}
        </button>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
      </form>
    </div>
  );
}

export default ChangePassword;