const pool = require('../config/database');

const compraController = {
    async getAll(req, res) {
        try {
            const [compras] = await pool.query(
                `SELECT c.*, p.nombre as proveedor_nombre, u.nombre as usuario_nombre
                FROM compras c
                JOIN proveedores p ON c.proveedor_id = p.id
                JOIN usuarios u ON c.usuario_id = u.id
                ORDER BY c.fecha DESC`
            );
            res.json(compras);
        } catch (error) {
            console.error('Get compras error:', error);
            res.status(500).json({ error: 'Error al obtener compras' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const [compras] = await pool.query(
                `SELECT c.*, p.nombre as proveedor_nombre, u.nombre as usuario_nombre
                FROM compras c
                JOIN proveedores p ON c.proveedor_id = p.id
                JOIN usuarios u ON c.usuario_id = u.id
                WHERE c.id = ?`,
                [id]
            );

            if (compras.length === 0) {
                return res.status(404).json({ error: 'Compra no encontrada' });
            }

            const [detalle] = await pool.query(
                `SELECT dc.*, pr.nombre as producto_nombre
                FROM detalle_compras dc
                JOIN productos pr ON dc.producto_id = pr.id
                WHERE dc.compra_id = ?`,
                [id]
            );

            res.json({ ...compras[0], detalle });
        } catch (error) {
            console.error('Get compra error:', error);
            res.status(500).json({ error: 'Error al obtener compra' });
        }
    },

    async create(req, res) {
        const connection = await pool.getConnection();
        try {
            const { proveedor_id, productos } = req.body;
            const usuario_id = req.user.id;

            if (!proveedor_id || !productos || productos.length === 0) {
                return res.status(400).json({ error: 'Proveedor y productos son requeridos' });
            }

            await connection.beginTransaction();

            let total = 0;
            for (const item of productos) {
                const [prod] = await connection.query('SELECT precio FROM productos WHERE id = ?', [item.producto_id]);
                if (prod.length === 0) {
                    throw new Error(`Producto ${item.producto_id} no encontrado`);
                }
                total += prod[0].precio * item.cantidad;
            }

            const [compraResult] = await connection.query(
                'INSERT INTO compras (proveedor_id, usuario_id, total) VALUES (?, ?, ?)',
                [proveedor_id, usuario_id, total]
            );

            const compra_id = compraResult.insertId;

            for (const item of productos) {
                const [prod] = await connection.query('SELECT precio FROM productos WHERE id = ?', [item.producto_id]);
                const precio_unitario = prod[0].precio;

                await connection.query(
                    'INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                    [compra_id, item.producto_id, item.cantidad, precio_unitario]
                );

                await connection.query(
                    'UPDATE productos SET stock = stock + ? WHERE id = ?',
                    [item.cantidad, item.producto_id]
                );
            }

            await connection.commit();
            res.status(201).json({ message: 'Compra registrada', id: compra_id, total });
        } catch (error) {
            await connection.rollback();
            console.error('Create compra error:', error);
            res.status(500).json({ error: error.message || 'Error al crear compra' });
        } finally {
            connection.release();
        }
    }
};

module.exports = compraController;