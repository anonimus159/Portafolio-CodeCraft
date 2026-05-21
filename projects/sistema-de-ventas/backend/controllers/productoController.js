const pool = require('../config/database');

const productoController = {
    async getAll(req, res) {
        try {
            const { categoria, search, activo } = req.query;
            let query = `
                SELECT p.*, c.nombre as categoria_nombre
                FROM productos p
                LEFT JOIN categorias c ON p.categoria_id = c.id
                WHERE 1=1
            `;
            const params = [];

            if (categoria) {
                query += ' AND p.categoria_id = ?';
                params.push(categoria);
            }

            if (search) {
                query += ' AND (p.nombre LIKE ? OR p.codigo_barras LIKE ?)';
                params.push(`%${search}%`, `%${search}%`);
            }

            if (activo !== undefined) {
                query += ' AND p.activo = ?';
                params.push(activo === 'true');
            }

            query += ' ORDER BY p.nombre';

            const [productos] = await pool.query(query, params);
            res.json(productos);
        } catch (error) {
            console.error('Get productos error:', error);
            res.status(500).json({ error: 'Error al obtener productos' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const [productos] = await pool.query(
                `SELECT p.*, c.nombre as categoria_nombre
                FROM productos p
                LEFT JOIN categorias c ON p.categoria_id = c.id
                WHERE p.id = ?`,
                [id]
            );

            if (productos.length === 0) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            res.json(productos[0]);
        } catch (error) {
            console.error('Get producto error:', error);
            res.status(500).json({ error: 'Error al obtener producto' });
        }
    },

    async getByBarras(req, res) {
        try {
            const { codigo } = req.params;
            const [productos] = await pool.query(
                `SELECT p.*, c.nombre as categoria_nombre
                FROM productos p
                LEFT JOIN categorias c ON p.categoria_id = c.id
                WHERE p.codigo_barras = ? AND p.activo = TRUE`,
                [codigo]
            );

            if (productos.length === 0) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            res.json(productos[0]);
        } catch (error) {
            console.error('Get by barras error:', error);
            res.status(500).json({ error: 'Error al buscar por código' });
        }
    },

    async create(req, res) {
        try {
            const { nombre, descripcion, precio, stock, stock_minimo, codigo_barras, categoria_id } = req.body;

            if (!nombre || !precio) {
                return res.status(400).json({ error: 'Nombre y precio son requeridos' });
            }

            const [result] = await pool.query(
                `INSERT INTO productos (nombre, descripcion, precio, stock, stock_minimo, codigo_barras, categoria_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [nombre, descripcion, precio, stock || 0, stock_minimo || 5, codigo_barras, categoria_id]
            );

            res.status(201).json({ message: 'Producto creado', id: result.insertId });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'El código de barras ya existe' });
            }
            console.error('Create producto error:', error);
            res.status(500).json({ error: 'Error al crear producto' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre, descripcion, precio, stock, stock_minimo, codigo_barras, categoria_id, activo } = req.body;

            const [result] = await pool.query(
                `UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?,
                stock_minimo = ?, codigo_barras = ?, categoria_id = ?, activo = ?
                WHERE id = ?`,
                [nombre, descripcion, precio, stock, stock_minimo, codigo_barras, categoria_id, activo, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            res.json({ message: 'Producto actualizado' });
        } catch (error) {
            console.error('Update producto error:', error);
            res.status(500).json({ error: 'Error al actualizar producto' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            res.json({ message: 'Producto eliminado' });
        } catch (error) {
            console.error('Delete producto error:', error);
            res.status(500).json({ error: 'Error al eliminar producto' });
        }
    },

    async alertas(req, res) {
        try {
            const [productos] = await pool.query(
                `SELECT p.*, c.nombre as categoria_nombre
                FROM productos p
                LEFT JOIN categorias c ON p.categoria_id = c.id
                WHERE p.stock <= p.stock_minimo AND p.activo = TRUE
                ORDER BY p.stock ASC`
            );
            res.json(productos);
        } catch (error) {
            console.error('Alertas error:', error);
            res.status(500).json({ error: 'Error al obtener alertas' });
        }
    }
};

module.exports = productoController;