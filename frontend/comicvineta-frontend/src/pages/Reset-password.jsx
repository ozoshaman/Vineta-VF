import React, { useState } from 'react';
import { forgotPassword, resetForgottenPassword } from '../api/auth';
import '../styles/ResetPassword.css';

function ResetPassword() {
  const [step, setStep] = useState(1); // 1: solicitar código, 2: restablecer contraseña
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Paso 1: Solicitar código de verificación
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email) {
      return setError('Por favor ingresa tu correo electrónico');
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setMessage(res.data.message);
      setStep(2); // Avanzar al siguiente paso
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar el código');
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Restablecer contraseña con código
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!code) {
      return setError('Por favor ingresa el código de verificación');
    }

    if (newPassword !== confirm) {
      return setError('Las contraseñas no coinciden');
    }

    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(newPassword)) {
      return setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo especial');
    }

    setLoading(true);
    try {
      const res = await resetForgottenPassword(email, newPassword, code);
      setMessage(res.data.message);
      // Opcional: redirigir al login después de unos segundos
      setTimeout(() => {
        // window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setCode('');
    setNewPassword('');
    setConfirm('');
    setError('');
    setMessage('');
  };

  const handleResendCode = () => {
    setStep(1);
    setCode('');
    setError('');
    setMessage('Haz clic en "Enviar Código" para recibir un nuevo código');
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        {step === 1 ? (
          // Parte 1: Solicitar código
          <div className="form-container">
            <h2 className="form-title">Recuperar Contraseña</h2>
            
            <form onSubmit={handleRequestCode}>
              <div className="input-group">
                <label className="input-label">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                  className="input-field"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}
              >
                {loading ? 'Enviando...' : 'Enviar Código'}
              </button>
            </form>

            {message && <div className="message success">{message}</div>}
            {error && <div className="message error">{error}</div>}
          </div>
        ) : (
          // Parte 2: Restablecer contraseña
          <div className="form-container">
            <h2 className="form-title">Nueva Contraseña</h2>

            <div className="email-info">
              Se ha enviado un código de verificación a: <strong>{email}</strong>
            </div>

            <form onSubmit={handleResetPassword}>
              <div className="input-group">
                <label className="input-label">Código de Verificación</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ingresa el código de 6 dígitos"
                  maxLength="6"
                  className="input-field code-input"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Nueva Contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ingresa tu nueva contraseña"
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  className="input-field"
                  required
                />
              </div>

              <div className="password-hint">
                La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un símbolo especial.
              </div>

              <div className="button-group">
                <button
                  type="button"
                  onClick={handleBackToStep1}
                  className="btn btn-secondary"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn btn-success ${loading ? 'btn-disabled' : ''}`}
                >
                  {loading ? 'Restableciendo...' : 'Restablecer'}
                </button>
              </div>
            </form>

            {message && <div className="message success">{message}</div>}
            {error && <div className="message error">{error}</div>}

            <div className="resend-section">
              <button
                onClick={handleResendCode}
                className="link-button"
              >
                ¿No recibiste el código? Enviar otro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;