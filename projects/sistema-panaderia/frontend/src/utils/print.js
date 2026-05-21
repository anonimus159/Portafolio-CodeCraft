// Utilidad para imprimir tickets usando QZ Tray
// En producción, instalar QZ Tray desde https://qz.io/download/

const IMPRESORAS = {
  cocina: 'COMANDA',
  barra: 'BARRA',
  caja: 'FACTURA'
};

// Conectar con QZ Tray
export async function initPrinting() {
  if (window.qz) {
    try {
      await window.qz.websocket.connect();
      return true;
    } catch (err) {
      console.warn('QZ Tray no disponible:', err);
      return false;
    }
  }
  return false;
}

// Imprimir ticket genérico
export async function printTicket(tipo, contenido) {
  try {
    const printer = IMPRESORAS[tipo] || IMPRESORAS.caja;

    if (window.qz) {
      const qz = window.qz;
      const config = qz.configs.create(printer);

      await qz.print(config, [{
        type: 'pixel',
        flavor: 'ESC',
        data: formatTicketESC(contenido)
      }]);
    } else {
      // Fallback: imprimir en consola
      console.log('📋 Ticket para:', tipo);
      console.log(contenido);
      // Abrir ventana de impresión del navegador
      const printWindow = window.open('', '', 'width=300,height=400');
      printWindow.document.write(`
        <pre style="font-family: monospace; font-size: 12px;">
${contenido}
        </pre>
      `);
      printWindow.print();
    }
  } catch (err) {
    console.error('Error imprimiendo:', err);
  }
}

// Formatear ticket para impresoras ESC/POS
function formatTicketESC(texto) {
  const esc = '\x1B';
  const commands = [];

  commands.push(esc + '@'); // Inicializar impresora
  commands.push(esc + 'a' + '\x01'); // Centrar
  commands.push(esc + '!'\x30'); // Negrita + tamaño grande

  // Split por líneas
  texto.split('\n').forEach(line => {
    commands.push(line);
    commands.push('\x0A'); // Nueva línea
  });

  commands.push(esc + 'd\x03'); // Cortar papel
  return commands.join('');
}

// Formato de comando para cocina
export function formatComanda(pedido) {
  const fecha = new Date().toLocaleString('es-CO');
  let ticket = `
================================
         COMANDA
================================
Fecha: ${fecha}
Mesa: ${pedido.mesa_numero || 'Local'}
Pedido #: ${pedido.id}
--------------------------------
`;

  pedido.detalles?.forEach(d => {
    ticket += `${d.cantidad}x ${d.producto_nombre}\n`;
    if (d.notas) ticket += `   NOTA: ${d.notas}\n`;
  });

  ticket += `
================================
  ${pedido.mesero}
================================
`;

  return ticket;
}

// Formato de factura
export function formatFactura(pedido) {
  const fecha = new Date().toLocaleString('es-CO');
  let ticket = `
================================
      RESTAURANTE POS
================================
Fecha: ${fecha}
Mesa: ${pedido.mesa_numero || 'Local'}
================================
`;

  pedido.detalles?.forEach(d => {
    const subtotal = (d.cantidad * d.precio_unitario).toFixed(2);
    ticket += `${d.cantidad} ${d.producto_nombre}
   $${subtotal}\n`;
  });

  const subtotal = pedido.subtotal || 0;
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  ticket += `
--------------------------------
Subtotal:          $${subtotal.toFixed(2)}
IVA (19%):         $${iva.toFixed(2)}
================================
TOTAL:             $${total.toFixed(2)}
================================
Método: ${pedido.metodo_pago?.toUpperCase() || 'EFECTIVO'}

¡Gracias por su visita!
`;

  return ticket;
}