import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const { login, setUserInfo } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading('patito');
    try {
      const res = await loginUser(form);
      login(res.data.token);
      
      // Decodificar el token para obtener información del usuario
      const tokenPayload = JSON.parse(atob(res.data.token.split('.')[1]));
      setUserInfo({ id: tokenPayload.id, email: tokenPayload.email });
      
      if (res.data.mustChangePassword) {
        navigate('/change-password');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
    setLoading(null);
    }
  };

 return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit" disabled = {loading !== null} >
          {loading === 'patito' ? 'Ingresando...' : 'Entrar'}
        </button>
        <p className="login-links">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link><br />
          <Link to="/reset-password">¿Olvidaste tu contraseña?</Link>
        </p>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default Login;
