const pool = require('../config/database');

const cajaController = {
    async getAbierta(req, res) {
        try {
            const usuario_id = req.user.id;
            const [cajas] = await pool.query(
                'SELECT * FROM cajas WHERE usuario_id = ? AND estado = "abierta" ORDER BY fecha_apertura DESC LIMIT 1',
                [usuario_id]
            );

            if (cajas.length === 0) {
                return res.json(null);
            }

            const [ventas] = await pool.query(
                'SELECT SUM(total) as total FROM ventas WHERE usuario_id = ? AND DATE(fecha) = CURDATE()',
                [usuario_id]
            );

            res.json({
                ...cajas[0],
                ventas_dia: ventas[0].total || 0
            });
        } catch (error) {
            console.error('Get caja abierta error:', error);
            res.status(500).json({ error: 'Error al obtener caja' });
        }
    },

    async apertura(req, res) {
        try {
            const usuario_id = req.user.id;
            const { monto_inicial } = req.body;

            const [existente] = await pool.query(
                'SELECT id FROM cajas WHERE usuario_id = ? AND estado = "abierta"',
                [usuario_id]
            );

            if (existente.length > 0) {
                return res.status(400).json({ error: 'Ya tienes una caja abierta' });
            }

            const [result] = await pool.query(
                'INSERT INTO cajas (usuario_id, monto_inicial) VALUES (?, ?)',
                [usuario_id, monto_inicial || 0]
            );

            res.status(201).json({ message: 'Caja abierta', id: result.insertId });
        } catch (error) {
            console.error('Apertura caja error:', error);
            res.status(500).json({ error: 'Error al abrir caja' });
        }
    },

    async cierre(req, res) {
        try {
            const { id } = req.params;
            const { monto_final } = req.body;

            const [caja] = await pool.query('SELECT * FROM cajas WHERE id = ?', [id]);

            if (caja.length === 0) {
                return res.status(404).json({ error: 'Caja no encontrada' });
            }

            if (caja[0].estado === 'cerrada') {
                return res.status(400).json({ error: 'Caja ya está cerrada' });
            }

            await pool.query(
                'UPDATE cajas SET estado = "cerrada", monto_final = ?, fecha_cierre = NOW() WHERE id = ?',
                [monto_final, id]
            );

            res.json({ message: 'Caja cerrada', id });
        } catch (error) {
            console.error('Cierre caja error:', error);
            res.status(500).json({ error: 'Error al cerrar caja' });
        }
    },

    async historial(req, res) {
        try {
            const [cajas] = await pool.query(
                `SELECT c.*, u.nombre as usuario_nombre
                FROM cajas c
                JOIN usuarios u ON c.usuario_id = u.id
                ORDER BY c.fecha_apertura DESC
                LIMIT 30`
            );
            res.json(cajas);
        } catch (error) {
            console.error('Historial caja error:', error);
            res.status(500).json({ error: 'Error al obtener historial' });
        }
    }
};

module.exports = cajaController;