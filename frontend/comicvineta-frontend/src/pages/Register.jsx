import { useState } from 'react';
import { registerUser } from '../api/auth';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(form.email)) {
      setMessage('Correo electrónico inválido');
      return;
    }

     setLoading(true); // 🔄 Empieza la carga
     setMessage('');

    try {
      const res = await registerUser(form);
      setMessage(res.data.message);

      // ✅ Redireccionar a pantalla de verificación con el email
      navigate('/verify', { state: { email: form.email } });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error al registrar');
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Crear cuenta</h2>
        <input
          type="text"
          placeholder="Nombre de usuario"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span> Cargando...
            </>
          ) : (
            'Registrarse'
          )}
        </button>

        <p className="message">{message}</p>
        <p className="link-login">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
