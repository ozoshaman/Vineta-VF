const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('❌ Token no proporcionado o mal formado');
    return res.status(401).json({ message: 'Token no proporcionado o mal formado' });
  }

  const token = authHeader.split(' ')[1];
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    console.error('❌ JWT_SECRET no está definido en variables de entorno');
    return res.status(500).json({ message: 'Error del servidor: JWT mal configurado' });
  }

  try {
    //console.log('🔐 Token recibido:', token);
    const decoded = jwt.verify(token, JWT_SECRET);
    //console.log('✅ Payload decodificado:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Token inválido o expirado:', error.message);
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
}

module.exports = authenticate;
