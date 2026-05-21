const express = require('express');
const router = express.Router();
const db = require('../db/mysql');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const turnos = await db.turnos.getAll();
    res.json({ success: true, data: turnos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/asignaciones', async (req, res) => {
  try {
    const { fecha } = req.query;
    const asignaciones = fecha ? await db.turnos.getAllAsignaciones(fecha) : await db.turnos.getAllAsignaciones(new Date().toISOString().slice(0, 10));
    res.json({ success: true, data: asignaciones });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/sin-asignar', async (req, res) => {
  try {
    const { fecha } = req.query;
    const usuarios = await db.turnos.getUsuariosSinAsignar(fecha || new Date().toISOString().slice(0, 10));
    res.json({ success: true, data: usuarios });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const turno = await db.turnos.getById(req.params.id);
    if (!turno) {
      return res.status(404).json({ success: false, message: 'Turno no encontrado' });
    }
    res.json({ success: true, data: turno });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, hora_inicio, hora_fin, dia_semana } = req.body;
    const nuevo = await db.turnos.create({ nombre, hora_inicio, hora_fin, dia_semana });
    res.status(201).json({ success: true, message: 'Turno creado', data: { id: nuevo.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nombre, hora_inicio, hora_fin, dia_semana, activo } = req.body;
    const updated = await db.turnos.update(req.params.id, { nombre, hora_inicio, hora_fin, dia_semana, activo });
    res.json({ success: true, message: 'Turno actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.turnos.update(req.params.id, { activo: false });
    res.json({ success: true, message: 'Turno eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/asignar', async (req, res) => {
  try {
    const { usuario_id, fecha } = req.body;
    const nuevo = await db.turnos.asignarUsuario(req.params.id, usuario_id, fecha);
    res.status(201).json({ success: true, message: 'Usuario asignado al turno', data: nuevo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/asignacion/:id/iniciar', async (req, res) => {
  try {
    await db.turnos.iniciarTurno(req.params.id);
    const asignacion = await db.turnos.getAsignacionById(req.params.id);
    res.json({ success: true, message: 'Turno iniciado', data: asignacion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/asignacion/:id/finalizar', async (req, res) => {
  try {
    await db.turnos.finalizarTurno(req.params.id);
    const asignacion = await db.turnos.getAsignacionById(req.params.id);
    res.json({ success: true, message: 'Turno finalizado', data: asignacion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;