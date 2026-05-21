/**
 * Servicio de impresión para tickets de cocina/barra
 * Usa QZ Tray para impresión local
 */

// Configuración de impresora
const PRINTER_CONFIG = {
  cocina: {
    name: 'Cocina',
    width: 80, // mm (tamaño estándar de ticket)
    columns: 48 // Caracteres por línea para 80mm
  },
  barra: {
    name: 'Barra',
    width: 80,
    columns: 48
  }
};

/**
 * Formatea un ticket para impresión
 * @param {Object} pedido - Datos del pedido
 * @param {Array} detalles - Items del pedido
 * @param {String} tipo - 'cocina' o 'barra'
 * @returns {String} Ticket formateado
 */
function formatTicket(pedido, detalles, tipo = 'cocina') {
  const config = PRINTER_CONFIG[tipo];
  const separator = '─'.repeat(config.columns);
  const separatorDouble = '═'.repeat(config.columns);

  // Encabezado
  let ticket = '';
  ticket += '╔' + '═'.repeat(config.columns - 2) + '╗\n';
  ticket += '║' + centrarTexto('RESTAURANTE XYZ', config.columns) + '║\n';
  ticket += '╚' + '═'.repeat(config.columns - 2) + '╝\n';
  ticket += '\n';

  // Información del pedido
  ticket += `Mesa: ${pedido.mesa_numero || 'Para llevar'}\n`;
  ticket += `Pedido #: ${pedido.id}\n`;
  ticket += `Hora: ${new Date(pedido.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}\n`;
  ticket += `Fecha: ${new Date(pedido.created_at).toLocaleDateString('es-ES')}\n`;
  ticket += `Mesero: ${pedido.mesero || 'N/A'}\n`;
  ticket += '\n';
  ticket += separator + '\n';
  ticket += '\n';

  // Agrupar items por producto
  const itemsAgrupados = {};
  detalles.forEach(detalle => {
    const key = `${detalle.producto_id}-${detalle.producto_nombre}`;
    if (!itemsAgrupados[key]) {
      itemsAgrupados[key] = {
        nombre: detalle.producto_nombre,
        cantidad: 0,
        notas: []
      };
    }
    itemsAgrupados[key].cantidad += detalle.cantidad;
    if (detalle.notas) {
      itemsAgrupados[key].notas.push(detalle.notas);
    }
  });

  // Listar items
  Object.values(itemsAgrupados).forEach(item => {
    ticket += `${item.cantidad}x ${item.nombre}\n`;
    item.notas.forEach(nota => {
      ticket += `   → ${nota}\n`;
    });
  });

  ticket += '\n';
  ticket += separator + '\n';

  // Notas generales
  if (pedido.observaciones) {
    ticket += '\n';
    ticket += 'NOTAS:\n';
    ticket += pedido.observaciones + '\n';
    ticket += '\n';
  }

  // Pie
  ticket += separatorDouble + '\n';
  ticket += centrarTexto('¡Gracias por su compra!', config.columns) + '\n';
  ticket += separatorDouble + '\n';

  // Comandos de corte de papel (depende de la impresora)
  ticket += '\n\n\n'; // Saltos para el corte

  return ticket;
}

/**
 * Centra un texto en un ancho dado
 * @param {String} texto - Texto a centrar
 * @param {Number} ancho - Ancho total
 * @returns {String} Texto centrado
 */
function centrarTexto(texto, ancho) {
  const padding = Math.floor((ancho - texto.length) / 2);
  return ' '.repeat(padding) + texto + ' '.repeat(ancho - texto.length - padding);
}

/**
 * Imprime un ticket usando QZ Tray
 * @param {String} ticket - Ticket formateado
 * @param {String} printerName - Nombre de la impresora
 * @returns {Promise<Object>} Resultado de la impresión
 */
async function imprimirTicket(ticket, printerName = null) {
  // En producción, esto se comunicaría con QZ Tray vía WebSocket
  // Para desarrollo, simulamos la impresión

  console.log('🖨️  TICKET PARA IMPRIMIR:');
  console.log('─'.repeat(50));
  console.log(ticket);
  console.log('─'.repeat(50));

  // Simulación de respuesta de QZ Tray
  return {
    success: true,
    message: `Ticket enviado a impresora: ${printerName || 'Predeterminada'}`,
    ticket
  };
}

/**
 * Imprime pedido separando cocina y barra
 * @param {Object} pedido - Datos del pedido
 * @param {Array} detalles - Todos los detalles del pedido
 */
async function imprimirPedido(pedido, detalles) {
  const cocinaItems = detalles.filter(d => d.lugar_preparacion === 'cocina');
  const barraItems = detalles.filter(d => d.lugar_preparacion === 'barra');

  const resultados = [];

  // Imprimir cocina
  if (cocinaItems.length > 0) {
    const ticketCocina = formatTicket(pedido, cocinaItems, 'cocina');
    const resultado = await imprimirTicket(ticketCocina, PRINTER_CONFIG.cocina.name);
    resultados.push({ tipo: 'cocina', ...resultado });
  }

  // Imprimir barra
  if (barraItems.length > 0) {
    const ticketBarra = formatTicket(pedido, barraItems, 'barra');
    const resultado = await imprimirTicket(ticketBarra, PRINTER_CONFIG.barra.name);
    resultados.push({ tipo: 'barra', ...resultado });
  }

  return resultados;
}

/**
 * Reimprime un ticket existente
 * @param {Object} pedido - Datos del pedido
 * @param {Array} detalles - Detalles del pedido
 * @param {String} tipo - 'cocina', 'barra' o 'todos'
 */
async function reimprimirTicket(pedido, detalles, tipo = 'todos') {
  if (tipo === 'todos') {
    return imprimirPedido(pedido, detalles);
  }

  const items = detalles.filter(d => d.lugar_preparacion === tipo);
  if (items.length === 0) {
    return { success: false, message: `No hay items para ${tipo}` };
  }

  const ticket = formatTicket(pedido, items, tipo);
  const resultado = await imprimirTicket(ticket, PRINTER_CONFIG[tipo].name);
  return { tipo, ...resultado };
}

module.exports = {
  formatTicket,
  imprimirTicket,
  imprimirPedido,
  reimprimirTicket,
  PRINTER_CONFIG
};
