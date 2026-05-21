const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Middleware para validar JWT en rutas protegidas
 * Extrae el usuario del token y lo agrega a req.usuario
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó token de autenticación'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    // Agregar información del usuario al request
    req.usuario = {
      id: decoded.id,
      nombre: decoded.nombre,
      email: decoded.email,
      rol: decoded.rol
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Por favor inicie sesión nuevamente.'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error validando autenticación',
      error: error.message
    });
  }
};

/**
 * Middleware para verificar roles específicos
 * Se usa después de authMiddleware
 * @param  {...string} roles - Roles permitidos
 */
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere uno de los siguientes roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

module.exports = { authMiddleware, checkRole };
