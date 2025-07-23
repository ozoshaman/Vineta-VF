import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyCode, resendVerificationCode } from '../api/auth';
import '../styles/VerifyCode.css';

function VerifyCode() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(null); // valores: 'verify', 'resend', o null


  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
     setLoading('resend');
    try {
      const res = await verifyCode({ email, code });
      setMessage(res.data.message);

      // Redirigir después de 2 segundos al login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al verificar código');
    } finally {
    setLoading(null);
    }
  };

  const handleResend = async () => {
    setMessage('');
    setError('');
    try {
      const res = await resendVerificationCode({ email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al reenviar código');
    } finally {
    setLoading(null);
    }
  };

  return (
    <div className="verify-container">
      <form onSubmit={handleVerify} className="verify-form">
        <h2>Verificar cuenta</h2>

        <label>Correo electrónico:</label>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Código de verificación:</label>
        <input
          type="text"
          value={code}
          required
          onChange={(e) => setCode(e.target.value)}
        />

        <div className="button-group">
          <button type="submit" disabled={loading !== null}>
            {loading === 'verify' ? 'Verificando...' : 'Verificar'}
          </button>
          <button type="button" onClick={handleResend} disabled={loading !== null}>
            {loading === 'resend' ? 'Reenviando...' : 'Reenviar código'}
          </button>
        </div>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default VerifyCode;
