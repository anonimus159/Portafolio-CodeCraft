const pool = require('../config/database');

const reporteController = {
    async ventas(req, res) {
        try {
            const { periodo } = req.query;
            let fechaInicio;

            const today = new Date();
            if (periodo === 'dia') {
                fechaInicio = today.toISOString().split('T')[0];
            } else if (periodo === 'semana') {
                const semanaAtras = new Date(today);
                semanaAtras.setDate(semanaAtras.getDate() - 7);
                fechaInicio = semanaAtras.toISOString().split('T')[0];
            } else {
                const mesAtras = new Date(today);
                mesAtras.setMonth(mesAtras.getMonth() - 1);
                fechaInicio = mesAtras.toISOString().split('T')[0];
            }

            const [ventas] = await pool.query(
                `SELECT DATE(fecha) as fecha, COUNT(*) as cantidad, SUM(total) as total
                FROM ventas
                WHERE fecha >= ?
                GROUP BY DATE(fecha)
                ORDER BY fecha DESC`,
                [fechaInicio]
            );

            const [resumen] = await pool.query(
                `SELECT COUNT(*) as total_ventas, SUM(total) as ingreso_total
                FROM ventas
                WHERE fecha >= ?`,
                [fechaInicio]
            );

            res.json({ detalle: ventas, resumen: resumen[0] });
        } catch (error) {
            console.error('Reporte ventas error:', error);
            res.status(500).json({ error: 'Error al generar reporte' });
        }
    },

    async productosMasVendidos(req, res) {
        try {
            const [productos] = await pool.query(
                `SELECT p.nombre, p.codigo_barras, SUM(dv.cantidad) as cantidad_vendida, SUM(dv.subtotal) as total_vendido
                FROM detalle_ventas dv
                JOIN productos p ON dv.producto_id = p.id
                JOIN ventas v ON dv.venta_id = v.id
                WHERE v.fecha >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                GROUP BY p.id
                ORDER BY cantidad_vendida DESC
                LIMIT 10`
            );
            res.json(productos);
        } catch (error) {
            console.error('Productos mas vendidos error:', error);
            res.status(500).json({ error: 'Error al generar reporte' });
        }
    },

    async resumen(req, res) {
        try {
            const [ventasDia] = await pool.query(
                `SELECT COUNT(*) as ventas, COALESCE(SUM(total), 0) as total
                FROM ventas
                WHERE DATE(fecha) = CURDATE()`
            );

            const [ventasMes] = await pool.query(
                `SELECT COUNT(*) as ventas, COALESCE(SUM(total), 0) as total
                FROM ventas
                WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())`
            );

            const [gastosMes] = await pool.query(
                `SELECT COALESCE(SUM(monto), 0) as total
                FROM gastos
                WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())`
            );

            const [alertas] = await pool.query(
                'SELECT COUNT(*) as count FROM productos WHERE stock <= stock_minimo AND activo = TRUE'
            );

            res.json({
                ventas_hoy: ventasDia[0],
                ventas_mes: ventasMes[0],
                gastos_mes: gastosMes[0],
                alertas_stock: alertas[0].count
            });
        } catch (error) {
            console.error('Resumen error:', error);
            res.status(500).json({ error: 'Error al generar resumen' });
        }
    },

    async utilidad(req, res) {
        try {
            const { inicio, fin } = req.query;

            const [ingresos] = await pool.query(
                `SELECT COALESCE(SUM(total), 0) as total FROM ventas WHERE fecha BETWEEN ? AND ?`,
                [inicio, fin]
            );

            const [gastos] = await pool.query(
                `SELECT COALESCE(SUM(monto), 0) as total FROM gastos WHERE fecha BETWEEN ? AND ?`,
                [inicio, fin]
            );

            const utilidad = ingresos[0].total - gastos[0].total;

            res.json({
                ingresos: ingresos[0].total,
                gastos: gastos[0].total,
                utilidad
            });
        } catch (error) {
            console.error('Utilidad error:', error);
            res.status(500).json({ error: 'Error al calcular utilidad' });
        }
    }
};

module.exports = reporteController;