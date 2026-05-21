const pool = require('../config/database');

const proveedorController = {
    async getAll(req, res) {
        try {
            const [proveedores] = await pool.query('SELECT * FROM proveedores WHERE activo = TRUE ORDER BY nombre');
            res.json(proveedores);
        } catch (error) {
            console.error('Get proveedores error:', error);
            res.status(500).json({ error: 'Error al obtener proveedores' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const [proveedores] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);
            if (proveedores.length === 0) {
                return res.status(404).json({ error: 'Proveedor no encontrado' });
            }
            res.json(proveedores[0]);
        } catch (error) {
            console.error('Get proveedor error:', error);
            res.status(500).json({ error: 'Error al obtener proveedor' });
        }
    },

    async create(req, res) {
        try {
            const { nombre, telefono, email, direccion } = req.body;
            if (!nombre) {
                return res.status(400).json({ error: 'Nombre es requerido' });
            }
            const [result] = await pool.query(
                'INSERT INTO proveedores (nombre, telefono, email, direccion) VALUES (?, ?, ?, ?)',
                [nombre, telefono, email, direccion]
            );
            res.status(201).json({ message: 'Proveedor creado', id: result.insertId });
        } catch (error) {
            console.error('Create proveedor error:', error);
            res.status(500).json({ error: 'Error al crear proveedor' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre, telefono, email, direccion } = req.body;
            const [result] = await pool.query(
                'UPDATE proveedores SET nombre = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?',
                [nombre, telefono, email, direccion, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Proveedor no encontrado' });
            }
            res.json({ message: 'Proveedor actualizado' });
        } catch (error) {
            console.error('Update proveedor error:', error);
            res.status(500).json({ error: 'Error al actualizar proveedor' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const [result] = await pool.query('UPDATE proveedores SET activo = FALSE WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Proveedor no encontrado' });
            }
            res.json({ message: 'Proveedor eliminado' });
        } catch (error) {
            console.error('Delete proveedor error:', error);
            res.status(500).json({ error: 'Error al eliminar proveedor' });
        }
    }
};

module.exports = proveedorController;