const pool = require('../config/database');

const categoriaController = {
    async getAll(req, res) {
        try {
            const [categorias] = await pool.query('SELECT * FROM categorias ORDER BY nombre');
            res.json(categorias);
        } catch (error) {
            console.error('Get categorias error:', error);
            res.status(500).json({ error: 'Error al obtener categorías' });
        }
    },

    async create(req, res) {
        try {
            const { nombre, descripcion } = req.body;
            if (!nombre) {
                return res.status(400).json({ error: 'Nombre es requerido' });
            }
            const [result] = await pool.query(
                'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
                [nombre, descripcion]
            );
            res.status(201).json({ message: 'Categoría creada', id: result.insertId });
        } catch (error) {
            console.error('Create categoria error:', error);
            res.status(500).json({ error: 'Error al crear categoría' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre, descripcion } = req.body;
            const [result] = await pool.query(
                'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
                [nombre, descripcion, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }
            res.json({ message: 'Categoría actualizada' });
        } catch (error) {
            console.error('Update categoria error:', error);
            res.status(500).json({ error: 'Error al actualizar categoría' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const [result] = await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }
            res.json({ message: 'Categoría eliminada' });
        } catch (error) {
            console.error('Delete categoria error:', error);
            res.status(500).json({ error: 'Error al eliminar categoría' });
        }
    }
};

module.exports = categoriaController;