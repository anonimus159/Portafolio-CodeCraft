const db = require('../db/mysql');

exports.getCuadreActivo = async (req, res) => {
  try {
    const usuario_id = req.params.usuario_id;
    let cuadre = await db.cuadre.getActivo(usuario_id);

    if (!cuadre) {
      const fecha = new Date().toISOString().split('T')[0];
      cuadre = await db.cuadre.create({
        usuario_id,
        efectivo_inicial: 0
      });
    }

    const ingresos = await db.query(
      'SELECT * FROM cuadre_detalle WHERE cuadre_id = ? AND tipo = ?',
      [cuadre.id, 'ingreso']
    );
    const gastos = await db.query(
      'SELECT * FROM cuadre_detalle WHERE cuadre_id = ? AND tipo = ?',
      [cuadre.id, 'gasto']
    );

    res.json({
      success: true,
      data: { ...cuadre, ingresos, gastos }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { desde, hasta, usuario_id } = req.query;
    let sql = 'SELECT c.*, u.nombre as usuario_nombre FROM cuadre c LEFT JOIN usuarios u ON c.usuario_id = u.id';
    const params = [];
    const conditions = [];

    if (desde) { conditions.push('c.fecha >= ?'); params.push(desde); }
    if (hasta) { conditions.push('c.fecha <= ?'); params.push(hasta); }
    if (usuario_id) { conditions.push('c.usuario_id = ?'); params.push(usuario_id); }

    if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY c.fecha DESC';

    const cuadres = await db.query(sql, params);
    res.json({ success: true, data: cuadres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const cuadre = await db.cuadre.getById(req.params.id);
    if (!cuadre) {
      return res.status(404).json({ success: false, message: 'Cuadre no encontrado' });
    }

    const ingresos = await db.query(
      'SELECT * FROM cuadre_detalle WHERE cuadre_id = ? AND tipo = ?',
      [cuadre.id, 'ingreso']
    );
    const gastos = await db.query(
      'SELECT * FROM cuadre_detalle WHERE cuadre_id = ? AND tipo = ?',
      [cuadre.id, 'gasto']
    );

    res.json({
      success: true,
      data: { ...cuadre, ingresos, gastos }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.agregarIngreso = async (req, res) => {
  try {
    const { descripcion, monto, metodo_pago, referencia, tipo_ingreso } = req.body;
    const cuadre_id = req.params.cuadre_id;

    await db.cuadre.agregarMovimiento(cuadre_id, 'ingreso', {
      descripcion,
      monto: parseFloat(monto),
      metodo_pago,
      referencia,
      tipo_ingreso
    });

    res.status(201).json({ success: true, message: 'Ingreso agregado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.agregarGasto = async (req, res) => {
  try {
    const { descripcion, monto, metodo_pago, referencia } = req.body;
    const cuadre_id = req.params.cuadre_id;

    await db.cuadre.agregarMovimiento(cuadre_id, 'gasto', {
      descripcion,
      monto: parseFloat(monto),
      metodo_pago,
      referencia
    });

    res.status(201).json({ success: true, message: 'Gasto agregado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.eliminarMovimiento = async (req, res) => {
  try {
    await db.query('DELETE FROM cuadre_detalle WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Movimiento eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cerrarCuadre = async (req, res) => {
  try {
    const { dinero_sistema, observaciones } = req.body;
    const cuadre = await db.cuadre.getById(req.params.id);

    if (!cuadre) {
      return res.status(404).json({ success: false, message: 'Cuadre no encontrado' });
    }

    const diferencia = parseFloat(dinero_sistema) - parseFloat(cuadre.resultado);

    await db.cuadre.cerrar(req.params.id, diferencia, observaciones);
    res.json({ success: true, message: 'Cuadre cerrado', data: { diferencia } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};