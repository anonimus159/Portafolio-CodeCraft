const pool = require('../config/database');

const cuadreController = {
    async getAll(req, res) {
        try {
            const [cuadres] = await pool.query(
                `SELECT c.*, u.nombre as usuario_nombre
                FROM cuadres c
                JOIN usuarios u ON c.usuario_id = u.id
                ORDER BY c.fecha DESC
                LIMIT 50`
            );
            res.json(cuadres);
        } catch (error) {
            console.error('Get cuadres error:', error);
            res.status(500).json({ error: 'Error al obtener cuadres' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const [cuadres] = await pool.query(
                `SELECT c.*, u.nombre as usuario_nombre
                FROM cuadres c
                JOIN usuarios u ON c.usuario_id = u.id
                WHERE c.id = ?`,
                [id]
            );

            if (cuadres.length === 0) {
                return res.status(404).json({ error: 'Cuadre no encontrado' });
            }

            res.json(cuadres[0]);
        } catch (error) {
            console.error('Get cuadre error:', error);
            res.status(500).json({ error: 'Error al obtener cuadre' });
        }
    },

    async create(req, res) {
        try {
            const {
                ventas_efectivo, ventas_tarjeta, ventas_transferencia,
                gastos, deudas_cobradas, deudas_pendientes,
                monto_inicial, observaciones
            } = req.body;
            const usuario_id = req.user.id;

            const total_ventas = (parseFloat(ventas_efectivo) || 0) +
                                 (parseFloat(ventas_tarjeta) || 0) +
                                 (parseFloat(ventas_transferencia) || 0);

            const total_ingresos = total_ventas +
                                   (parseFloat(deudas_cobradas) || 0) +
                                   (parseFloat(monto_inicial) || 0);

            const total_egresos = (parseFloat(gastos) || 0);
            const diferencia = total_ingresos - total_egresos;

            const [result] = await pool.query(
                `INSERT INTO cuadres (usuario_id, ventas_efectivo, ventas_tarjeta, ventas_transferencia,
                total_ventas, gastos, deudas_cobradas, deudas_pendientes,
                monto_inicial, total_ingresos, total_egresos, diferencia, observaciones)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [usuario_id, ventas_efectivo || 0, ventas_tarjeta || 0, ventas_transferencia || 0,
                 total_ventas, gastos || 0, deudas_cobradas || 0, deudas_pendientes || 0,
                 monto_inicial || 0, total_ingresos, total_egresos, diferencia, observaciones]
            );

            res.status(201).json({ message: 'Cuadre guardado', id: result.insertId, diferencia });
        } catch (error) {
            console.error('Create cuadre error:', error);
            res.status(500).json({ error: 'Error al guardar cuadre' });
        }
    },

    async getByFecha(req, res) {
        try {
            const { fecha } = req.params;
            const [cuadres] = await pool.query(
                `SELECT c.*, u.nombre as usuario_nombre
                FROM cuadres c
                JOIN usuarios u ON c.usuario_id = u.id
                WHERE DATE(c.fecha) = ?
                ORDER BY c.fecha DESC`,
                [fecha]
            );
            res.json(cuadres);
        } catch (error) {
            console.error('Get cuadres by fecha error:', error);
            res.status(500).json({ error: 'Error al obtener cuadres' });
        }
    },

    async resumen(req, res) {
        try {
            const [ventas] = await pool.query(
                `SELECT
                    COALESCE(SUM(CASE WHEN metodo_pago = 'efectivo' THEN total ELSE 0 END), 0) as ventas_efectivo,
                    COALESCE(SUM(CASE WHEN metodo_pago = 'tarjeta' THEN total ELSE 0 END), 0) as ventas_tarjeta,
                    COALESCE(SUM(CASE WHEN metodo_pago = 'transferencia' THEN total ELSE 0 END), 0) as ventas_transferencia,
                    COALESCE(SUM(total), 0) as total_ventas
                FROM ventas
                WHERE DATE(fecha) = CURDATE()`
            );

            const [gastos] = await pool.query(
                `SELECT COALESCE(SUM(monto), 0) as total
                FROM gastos
                WHERE DATE(fecha) = CURDATE()`,
            );

            const [caja] = await pool.query(
                `SELECT monto_inicial FROM cajas
                WHERE usuario_id = ? AND estado = 'abierta' AND DATE(fecha_apertura) = CURDATE()
                ORDER BY fecha_apertura DESC LIMIT 1`,
                [req.user.id]
            );

            res.json({
                ventas: ventas[0],
                gastos: gastos[0].total,
                monto_inicial: caja.length > 0 ? caja[0].monto_inicial : 0
            });
        } catch (error) {
            console.error('Resumen cuadre error:', error);
            res.status(500).json({ error: 'Error al obtener resumen' });
        }
    }
};

module.exports = cuadreController;