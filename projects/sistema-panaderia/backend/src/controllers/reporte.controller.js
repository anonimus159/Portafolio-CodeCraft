const db = require('../db/mysql');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { format } = require('date-fns');

exports.getDashboard = async (req, res) => {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    
    const ventasHoy = await db.query(
      'SELECT COALESCE(SUM(total), 0) as total, COUNT(*) as pedidos FROM pedidos WHERE DATE(created_at) = ? AND estado = ?',
      [hoy, 'entregado']
    );
    
    const ventasSemana = await db.query(
      `SELECT COALESCE(SUM(total), 0) as total, COUNT(*) as pedidos FROM pedidos 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND estado = 'entregado'`
    );
    
    const ventasMes = await db.query(
      `SELECT COALESCE(SUM(total), 0) as total, COUNT(*) as pedidos FROM pedidos 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND estado = 'entregado'`
    );
    
    const productosTop = await db.query(
      `SELECT p.nombre, SUM(d.cantidad) as cantidad, SUM(d.cantidad * d.precio_unitario) as total
       FROM pedido_detalle d
       LEFT JOIN pedidos pe ON d.pedido_id = pe.id
       LEFT JOIN productos p ON d.producto_id = p.id
       WHERE pe.estado = 'entregado'
       GROUP BY p.id
       ORDER BY cantidad DESC
       LIMIT 10`
    );
    
    const mesasOcupadas = await db.query(
      "SELECT COUNT(*) as total FROM mesas WHERE estado = 'ocupada'"
    );
    
    const pedidosPendientes = await db.query(
      "SELECT COUNT(*) as total FROM pedidos WHERE estado IN ('pendiente', 'en_preparacion')"
    );
    
    const inventarioBajo = await db.query(
      "SELECT COUNT(*) as total FROM inventario WHERE cantidad <= stock_minimo AND activo = true"
    );

    const metodosPago = await db.query(
      `SELECT metodo_pago, COUNT(*) as cantidad, SUM(total) as total 
       FROM pedidos WHERE DATE(created_at) = ? AND estado = 'entregado' AND metodo_pago IS NOT NULL
       GROUP BY metodo_pago`,
      [hoy]
    );

    res.json({
      success: true,
      data: {
        ventas: {
          hoy: {
            total: parseFloat(ventasHoy[0]?.total || 0),
            pedidos: parseInt(ventasHoy[0]?.pedidos || 0)
          },
          semana: {
            total: parseFloat(ventasSemana[0]?.total || 0),
            pedidos: parseInt(ventasSemana[0]?.pedidos || 0)
          },
          mes: {
            total: parseFloat(ventasMes[0]?.total || 0),
            pedidos: parseInt(ventasMes[0]?.pedidos || 0)
          }
        },
        productosTop: productosTop.map(p => ({
          nombre: p.nombre,
          cantidad: parseInt(p.cantidad),
          total: parseFloat(p.total)
        })),
        mesasOcupadas: mesasOcupadas[0]?.total || 0,
        pedidosPendientes: pedidosPendientes[0]?.total || 0,
        inventarioBajoStock: inventarioBajo[0]?.total || 0,
        metodosPago: metodosPago.map(m => ({
          metodo: m.metodo_pago,
          cantidad: parseInt(m.cantidad),
          total: parseFloat(m.total)
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReporteVentas = async (req, res) => {
  try {
    const { inicio, fin, formato } = req.query;
    
    const ventas = await db.query(
      `SELECT DATE(pe.created_at) as fecha, COUNT(pe.id) as pedidos, SUM(pe.total) as total, pe.metodo_pago
       FROM pedidos pe
       WHERE pe.estado = 'entregado' AND DATE(pe.created_at) BETWEEN ? AND ?
       GROUP BY DATE(pe.created_at), pe.metodo_pago
       ORDER BY fecha DESC`,
      [inicio, fin]
    );

    if (formato === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Ventas');
      
      sheet.columns = [
        { header: 'Fecha', key: 'fecha', width: 15 },
        { header: 'Pedidos', key: 'pedidos', width: 12 },
        { header: 'Total', key: 'total', width: 15 },
        { header: 'Método de Pago', key: 'metodo_pago', width: 15 }
      ];
      
      ventas.forEach(v => {
        sheet.addRow({
          fecha: v.fecha,
          pedidos: v.pedidos,
          total: v.total,
          metodo_pago: v.metodo_pago
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte_ventas.xlsx');
      await workbook.xlsx.write(res);
      res.end();
    } else if (formato === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte_ventas.pdf');
      
      doc.pipe(res);
      doc.fontSize(18).text('Reporte de Ventas', { align: 'center' });
      doc.fontSize(12).text(`Período: ${inicio} al ${fin}`, { align: 'center' });
      doc.moveDown();
      
      let totalVentas = 0;
      let totalPedidos = 0;
      
      ventas.forEach(v => {
        doc.fontSize(10)
          .text(`Fecha: ${v.fecha} | Pedidos: ${v.pedidos} | Total: $${v.total} | Método: ${v.metodo_pago || 'N/A'}`);
        totalVentas += parseFloat(v.total);
        totalPedidos += parseInt(v.pedidos);
      });
      
      doc.moveDown();
      doc.fontSize(12).text(`Total Ventas: $${totalVentas}`);
      doc.text(`Total Pedidos: ${totalPedidos}`);
      
      doc.end();
    } else {
      res.json({ success: true, data: ventas });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReporteProductos = async (req, res) => {
  try {
    const { inicio, fin, formato } = req.query;
    
    const productos = await db.query(
      `SELECT p.nombre, c.nombre as categoria, SUM(d.cantidad) as cantidad, 
              SUM(d.cantidad * d.precio_unitario) as ingresos
       FROM pedido_detalle d
       LEFT JOIN pedidos pe ON d.pedido_id = pe.id
       LEFT JOIN productos p ON d.producto_id = p.id
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE pe.estado = 'entregado' AND DATE(pe.created_at) BETWEEN ? AND ?
       GROUP BY p.id
       ORDER BY cantidad DESC`,
      [inicio, fin]
    );

    if (formato === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Productos');
      
      sheet.columns = [
        { header: 'Producto', key: 'nombre', width: 25 },
        { header: 'Categoría', key: 'categoria', width: 15 },
        { header: 'Cantidad', key: 'cantidad', width: 12 },
        { header: 'Ingresos', key: 'ingresos', width: 15 }
      ];
      
      productos.forEach(p => {
        sheet.addRow({
          nombre: p.nombre,
          categoria: p.categoria,
          cantidad: p.cantidad,
          ingresos: p.ingresos
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte_productos.xlsx');
      await workbook.xlsx.write(res);
      res.end();
    } else if (formato === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte_productos.pdf');
      
      doc.pipe(res);
      doc.fontSize(18).text('Reporte de Productos', { align: 'center' });
      doc.fontSize(12).text(`Período: ${inicio} al ${fin}`, { align: 'center' });
      doc.moveDown();
      
      productos.forEach(p => {
        doc.fontSize(10)
          .text(`${p.nombre} (${p.categoria}): ${p.cantidad} unidades - $${p.ingresos}`);
      });
      
      doc.end();
    } else {
      res.json({ success: true, data: productos });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReporteInventario = async (req, res) => {
  try {
    const { formato } = req.query;
    
    const inventario = await db.query(
      `SELECT i.nombre, i.unidad, i.cantidad, i.stock_minimo, i.precio_unitario,
              (i.cantidad * i.precio_unitario) as valor_total
       FROM inventario i
       WHERE i.activo = true
       ORDER BY i.cantidad ASC`
    );

    if (formato === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Inventario');
      
      sheet.columns = [
        { header: 'Producto', key: 'nombre', width: 25 },
        { header: 'Unidad', key: 'unidad', width: 10 },
        { header: 'Cantidad', key: 'cantidad', width: 12 },
        { header: 'Stock Mínimo', key: 'stock_minimo', width: 12 },
        { header: 'Precio', key: 'precio_unitario', width: 12 },
        { header: 'Valor Total', key: 'valor_total', width: 15 }
      ];
      
      inventario.forEach(i => {
        sheet.addRow({
          nombre: i.nombre,
          unidad: i.unidad,
          cantidad: i.cantidad,
          stock_minimo: i.stock_minimo,
          precio_unitario: i.precio_unitario,
          valor_total: i.valor_total
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte_inventario.xlsx');
      await workbook.xlsx.write(res);
      res.end();
    } else if (formato === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte_inventario.pdf');
      
      doc.pipe(res);
      doc.fontSize(18).text('Reporte de Inventario', { align: 'center' });
      doc.moveDown();
      
      inventario.forEach(i => {
        doc.fontSize(10)
          .text(`${i.nombre}: ${i.cantidad} ${i.unidad} (Min: ${i.stock_minimo}) - $${i.precio_unitario} c/u`);
      });
      
      doc.end();
    } else {
      res.json({ success: true, data: inventario });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReportePedidos = async (req, res) => {
  try {
    const { inicio, fin, estado, formato } = req.query;
    
    const pedidos = await db.query(
      `SELECT pe.id, pe.created_at as fecha, m.numero as mesa, u.nombre as mesero,
              pe.total, pe.metodo_pago, pe.estado
       FROM pedidos pe
       LEFT JOIN mesas m ON pe.mesa_id = m.id
       LEFT JOIN usuarios u ON pe.usuario_id = u.id
       WHERE DATE(pe.created_at) BETWEEN ? AND ?
       ${estado ? 'AND pe.estado = ?' : ''}
       ORDER BY pe.created_at DESC`,
      estado ? [inicio, fin, estado] : [inicio, fin]
    );

    if (formato === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Pedidos');
      
      sheet.columns = [
        { header: 'ID', key: 'id', width: 8 },
        { header: 'Fecha', key: 'fecha', width: 18 },
        { header: 'Mesa', key: 'mesa', width: 8 },
        { header: 'Mesero', key: 'mesero', width: 15 },
        { header: 'Total', key: 'total', width: 12 },
        { header: 'Método', key: 'metodo_pago', width: 12 },
        { header: 'Estado', key: 'estado', width: 12 }
      ];
      
      pedidos.forEach(p => {
        sheet.addRow({
          id: p.id,
          fecha: p.fecha,
          mesa: p.mesa,
          mesero: p.mesero,
          total: p.total,
          metodo_pago: p.metodo_pago,
          estado: p.estado
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte_pedidos.xlsx');
      await workbook.xlsx.write(res);
      res.end();
    } else if (formato === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte_pedidos.pdf');
      
      doc.pipe(res);
      doc.fontSize(18).text('Reporte de Pedidos', { align: 'center' });
      doc.fontSize(12).text(`Período: ${inicio} al ${fin}`, { align: 'center' });
      doc.moveDown();
      
      pedidos.forEach(p => {
        doc.fontSize(9)
          .text(`#${p.id} | ${p.fecha} | Mesa ${p.mesa} | ${p.mesero} | $${p.total} | ${p.metodo_pago || 'N/A'} | ${p.estado}`);
      });
      
      doc.end();
    } else {
      res.json({ success: true, data: pedidos });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};