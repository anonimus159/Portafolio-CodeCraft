const db = require('../db/mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const SALT_ROUNDS = 10;

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    const user = await db.usuarios.getByEmail(email);

    if (!user || !user.activo) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    let passwordValid = false;
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$'))) {
      passwordValid = await bcrypt.compare(password, user.password);
    } else {
      passwordValid = user.password === password;
    }

    if (!passwordValid) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol, nombre: user.nombre, email: user.email },
      config.jwtSecret,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        token,
        usuario: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol
        }
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son requeridos'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const existingUser = await db.usuarios.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'El email ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await db.usuarios.create({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'mesero'
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: { id: newUser.id }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Token válido',
      data: req.usuario
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { passwordActual, passwordNuevo } = req.body;
    const usuarioId = req.usuario.id;

    if (!passwordActual || !passwordNuevo) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual y nueva son requeridas'
      });
    }

    if (passwordNuevo.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    const user = await db.usuarios.getById(usuarioId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    let passwordValid = false;
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$'))) {
      passwordValid = await bcrypt.compare(passwordActual, user.password);
    } else {
      passwordValid = user.password === passwordActual;
    }

    if (!passwordValid) {
      return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta' });
    }

    const hashedPassword = await bcrypt.hash(passwordNuevo, SALT_ROUNDS);

    await db.usuarios.update(usuarioId, { password: hashedPassword });

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};