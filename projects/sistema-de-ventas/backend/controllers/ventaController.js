const pool = require('../config/database');

const ventaController = {
    async getAll(req, res) {
        try {
            const { fecha, usuario_id } = req.query;
            let query = `
                SELECT v.*, u.nombre as usuario_nombre, c.nombre as cliente_nombre
                FROM ventas v
                JOIN usuarios u ON v.usuario_id = u.id
                LEFT JOIN clientes c ON v.cliente_id = c.id
                WHERE 1=1
            `;
            const params = [];

            if (fecha) {
                query += ' AND DATE(v.fecha) = ?';
                params.push(fecha);
            }

            if (usuario_id) {
                query += ' AND v.usuario_id = ?';
                params.push(usuario_id);
            }

            query += ' ORDER BY v.fecha DESC';

            const [ventas] = await pool.query(query, params);
            res.json(ventas);
        } catch (error) {
            console.error('Get ventas error:', error);
            res.status(500).json({ error: 'Error al obtener ventas' });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const [ventas] = await pool.query(
                `SELECT v.*, u.nombre as usuario_nombre, c.nombre as cliente_nombre
                FROM ventas v
                JOIN usuarios u ON v.usuario_id = u.id
                LEFT JOIN clientes c ON v.cliente_id = c.id
                WHERE v.id = ?`,
                [id]
            );

            if (ventas.length === 0) {
                return res.status(404).json({ error: 'Venta no encontrada' });
            }

            const [detalle] = await pool.query(
                `SELECT dv.*, p.nombre as producto_nombre
                FROM detalle_ventas dv
                JOIN productos p ON dv.producto_id = p.id
                WHERE dv.venta_id = ?`,
                [id]
            );

            res.json({ ...ventas[0], detalle });
        } catch (error) {
            console.error('Get venta error:', error);
            res.status(500).json({ error: 'Error al obtener venta' });
        }
    },

    async create(req, res) {
        const connection = await pool.getConnection();
        try {
            const { cliente_id, metodo_pago, productos } = req.body;
            const usuario_id = req.user.id;

            if (!productos || productos.length === 0) {
                return res.status(400).json({ error: 'Productos requeridos' });
            }

            await connection.beginTransaction();

            let total = 0;
            for (const item of productos) {
                const [productos] = await connection.query(
                    'SELECT precio FROM productos WHERE id = ? AND activo = TRUE',
                    [item.producto_id]
                );
                if (productos.length === 0) {
                    throw new Error(`Producto ${item.producto_id} no encontrado o inactivo`);
                }
                total += productos[0].precio * item.cantidad;
            }

            const [ventaResult] = await connection.query(
                'INSERT INTO ventas (usuario_id, cliente_id, metodo_pago, total) VALUES (?, ?, ?, ?)',
                [usuario_id, cliente_id || null, metodo_pago || 'efectivo', total]
            );

            const venta_id = ventaResult.insertId;

            for (const item of productos) {
                const [productos] = await connection.query(
                    'SELECT precio, stock FROM productos WHERE id = ?',
                    [item.producto_id]
                );

                const precio = productos[0].precio;
                const subtotal = precio * item.cantidad;
                const nuevoStock = productos[0].stock - item.cantidad;

                await connection.query(
                    'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                    [venta_id, item.producto_id, item.cantidad, precio, subtotal]
                );

                await connection.query(
                    'UPDATE productos SET stock = ? WHERE id = ?',
                    [nuevoStock, item.producto_id]
                );
            }

            await connection.commit();
            res.status(201).json({ message: 'Venta creada', id: venta_id, total });
        } catch (error) {
            await connection.rollback();
            console.error('Create venta error:', error);
            res.status(500).json({ error: error.message || 'Error al crear venta' });
        } finally {
            connection.release();
        }
    },

    async getByFecha(req, res) {
        try {
            const { fecha } = req.params;
            const [ventas] = await pool.query(
                `SELECT v.*, u.nombre as usuario_nombre
                FROM ventas v
                JOIN usuarios u ON v.usuario_id = u.id
                WHERE DATE(v.fecha) = ?
                ORDER BY v.fecha DESC`,
                [fecha]
            );
            res.json(ventas);
        } catch (error) {
            console.error('Get ventas by fecha error:', error);
            res.status(500).json({ error: 'Error al obtener ventas' });
        }
    }
};

module.exports = ventaController;