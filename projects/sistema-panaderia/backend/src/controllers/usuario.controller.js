const db = require('../db/mysql');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

exports.getAll = async (req, res) => {
  try {
    const usuarios = await db.usuarios.getAll();
    res.json({ success: true, data: usuarios });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const usuario = await db.usuarios.getById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    res.json({ success: true, data: usuario });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existing = await db.usuarios.getByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'El email ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await db.usuarios.create({ nombre, email, password: hashedPassword, rol: rol || 'mesero' });
    
    res.status(201).json({ success: true, message: 'Usuario creado', data: { id: newUser.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, email, rol, activo } = req.body;
    const updated = await db.usuarios.update(req.params.id, { nombre, email, rol, activo });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.usuarios.remove(req.params.id);
    res.json({ success: true, message: 'Usuario desactivado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};