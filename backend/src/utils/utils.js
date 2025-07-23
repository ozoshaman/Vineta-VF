const crypto = require('crypto');

// Genera una contraseña temporal aleatoria
function generateTempPassword() {
  return crypto.randomBytes(6).toString('hex'); // ej: 'a1b2c3d4e5f6'
}

// Genera un código de verificación de 6 dígitos
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000); // ej: 753281
}

// Valida formato de correo electrónico
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Valida fortaleza de la contraseña
function isStrongPassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
  return regex.test(password);
}

// Valida que el string sea una imagen base64 válida
function isValidBase64Image(base64String) {
  if (!base64String || typeof base64String !== 'string') return false;

  // Patrón para detectar imágenes en base64 con encabezado correcto
  const regex = /^data:image\/(png|jpeg|jpg|gif);base64,[A-Za-z0-9+/=\s]+$/;

  return regex.test(base64String);
}


module.exports = {
  generateTempPassword,
  generateVerificationCode,
  isValidEmail,
  isStrongPassword,
  isValidBase64Image
};
