const pool = require('../config/database');

const gastoController = {
    async getAll(req, res) {
        try {
            const [gastos] = await pool.query(
                `SELECT g.*, u.nombre as usuario_nombre
                FROM gastos g
                JOIN usuarios u ON g.usuario_id = u.id
                ORDER BY g.fecha DESC`
            );
            res.json(gastos);
        } catch (error) {
            console.error('Get gastos error:', error);
            res.status(500).json({ error: 'Error al obtener gastos' });
        }
    },

    async create(req, res) {
        try {
            const { descripcion, monto, categoria } = req.body;
            const usuario_id = req.user.id;

            if (!descripcion || !monto) {
                return res.status(400).json({ error: 'Descripción y monto son requeridos' });
            }

            const [result] = await pool.query(
                'INSERT INTO gastos (descripcion, monto, categoria, usuario_id) VALUES (?, ?, ?, ?)',
                [descripcion, monto, categoria, usuario_id]
            );

            res.status(201).json({ message: 'Gasto registrado', id: result.insertId });
        } catch (error) {
            console.error('Create gasto error:', error);
            res.status(500).json({ error: 'Error al registrar gasto' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const [result] = await pool.query('DELETE FROM gastos WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Gasto no encontrado' });
            }
            res.json({ message: 'Gasto eliminado' });
        } catch (error) {
            console.error('Delete gasto error:', error);
            res.status(500).json({ error: 'Error al eliminar gasto' });
        }
    }
};

module.exports = gastoController;