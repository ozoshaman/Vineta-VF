const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../models/sendEmail');
const {
  createUser, findUserByEmail, findUserById,
  updateUserProfile, updateUserPassword,
  deleteUserById, updateUserAvatar,
  verifyUser, updateVerificationCode, disableMustChangePassword,
  setVerificationCode,clearResetCode
} = require('../models/User');
const {
  generateTempPassword,
  generateVerificationCode,
  isValidEmail,
  isStrongPassword
} = require('../utils/utils');


const JWT_SECRET = process.env.JWT_SECRET;

//Metodo para Registrar un usuario
const registerUser = async (req, res) => {
  const { username, email } = req.body;
  try {
    if (!isValidEmail(email)) return res.status(400).json({ message: 'Correo no válido' });

    if (await findUserByEmail(email)) return res.status(400).json({ message: 'El email ya está en uso' });

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const verificationCode = generateVerificationCode();

    await createUser(username, email, hashedPassword, verificationCode);
    await sendEmail(email, 'Código de verificación', `Hola ${username}, tu contraseña temporal es: ${tempPassword}\nTu código de verificación es: ${verificationCode}`);

    res.status(201).json({ message: 'Usuario creado. Revisa tu correo.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar' });
  }
};
//Metodo para Logearse como usuario
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

    if (!user.is_verified) return res.status(403).json({ message: 'Verifica tu cuenta antes de iniciar sesión' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ message: 'Login correcto', token, mustChangePassword: user.must_change_password });
  } catch (err) {
    res.status(500).json({ error: 'Error en login' });
  }
};
//Actualizar perfil
const updateProfile = async (req, res) => {
  const { username, email } = req.body;
  try {
    const updatedUser = await updateUserProfile(req.user.id, username, email);
    res.json({ message: 'Perfil actualizado', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};
//Cambio de contraseña Se divide en caso de que sea el cambio o primer inicio.
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!isStrongPassword(newPassword)) {
    return res.status(400).json({
      message: 'La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un caracter especial',
    });
  }

  try {
    const user = await findUserById(req.user.id);

    if (user.must_change_password) {
      const hashed = await bcrypt.hash(newPassword, 10);
      await updateUserPassword(user.id, hashed);
      await disableMustChangePassword(user.id);
      return res.json({ message: 'Contraseña actualizada (cambio obligatorio)' });
    }

    if (!currentPassword) return res.status(400).json({ message: 'Debes proporcionar tu contraseña actual' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña actual incorrecta' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(user.id, hashedPassword);
    res.json({ message: 'Contraseña actualizada correctamente' });

  } catch (err) {
    console.error('Error al cambiar contraseña:', err);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
};

// Método separado si prefieres mantenerlos divididos (opcional)
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Correo no encontrado' });
    }

    const code = crypto.randomInt(100000, 999999).toString();
    await setVerificationCode(user.id, code);

    await sendEmail(
      user.email,
      'Código para restablecer contraseña',
      `Tu código de recuperación es: ${code}. Este código expira en 15 minutos.`
    );

    res.json({ message: 'Código enviado al correo' });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Método para restablecer contraseña (solo valida código y cambia contraseña)
const resetForgottenPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    // Validar que se proporcionaron todos los campos requeridos
    if (!email || !code || !newPassword) {
      return res.status(400).json({ 
        message: 'Email, código y nueva contraseña son requeridos' 
      });
    }

    // Validar que el usuario existe
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar código
    if (user.verification_code !== code) {
      return res.status(400).json({ message: 'Código inválido o expirado' });
    }

    // Validar fortaleza de la contraseña
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        message: 'Contraseña débil. Debe tener al menos 8 caracteres, mayúscula, número y símbolo especial',
      });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Actualizar contraseña y limpiar código de verificación
    await updateUserPassword(user.id, hashedPassword);
    await clearResetCode(user.id);

    res.json({ 
      message: 'Contraseña restablecida con éxito'
    });

  } catch (error) {
    console.error('Error en resetForgottenPassword:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

//Eliminar un usuario
const deleteAccount = async (req, res) => {
  try {
    await deleteUserById(req.user.id);
    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar cuenta' });
  }
};
//Cambia una imagen de perfil
const updateAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No se subió ningún archivo' });
  const path = `/uploads/${req.file.filename}`;
  try {
    await updateUserAvatar(req.user.id, path);
    res.json({ message: 'Avatar actualizado', avatar: path });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar avatar' });
  }
};
//Verificiar el codigo de confirmacion
const verifyCode = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    if (user.is_verified) return res.status(400).json({ message: 'Ya está verificado' });
    if (user.verification_code != code) return res.status(400).json({ message: 'Código incorrecto' });

    await verifyUser(email);
    res.json({ message: 'Cuenta verificada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al verificar cuenta' });
  }
};
//Reenviar el codigo de verificacion
const resendCode = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });
    if (user.is_verified) return res.status(400).json({ message: 'Este usuario ya fue verificado' });

    const code = generateVerificationCode();
    await updateVerificationCode(email, code);
    await sendEmail(email, 'Nuevo Código de Verificación', `Tu nuevo código es: ${code}`);
    res.json({ message: 'Código reenviado. Revisa tu correo.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al reenviar código' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
  deleteAccount,
  updateAvatar,
  verifyCode,
  resendCode,
  forgotPassword,
  resetForgottenPassword
};
