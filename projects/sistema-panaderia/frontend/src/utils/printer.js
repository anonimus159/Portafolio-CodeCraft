/**
 * Módulo de integración con QZ Tray para impresión de tickets
 * Fallback automático a window.print() si QZ Tray no está disponible
 */

const QZ_WS_URL  = 'wss://localhost:8181';
let   qzInstance = null;

// ── Helpers ──────────────────────────────────────────────────────────────────

function centerText(text, width = 42) {
  const pad = Math.max(0, Math.floor((width - text.length) / 2));
  return ' '.repeat(pad) + text;
}

function lineBreak(char = '-', width = 42) {
  return char.repeat(width);
}

function padRight(left, right, width = 42) {
  const spaces = Math.max(1, width - left.length - right.length);
  return left + ' '.repeat(spaces) + right;
}

// ── QZ Tray ──────────────────────────────────────────────────────────────────

async function connectQZ() {
  try {
    if (typeof window.qz === 'undefined') return null;
    if (qzInstance && window.qz.websocket.isActive()) return qzInstance;
    await window.qz.websocket.connect({ host: 'localhost', port: { secure: [8181, 8282] } });
    qzInstance = window.qz;
    return qzInstance;
  } catch {
    return null;
  }
}

async function printWithQZ(printerName, lines) {
  const qz = await connectQZ();
  if (!qz) return false;

  try {
    const printer = printerName || await qz.printers.getDefault();
    const config  = qz.configs.create(printer, { encoding: 'UTF-8' });
    const data    = lines.map(line => ({ type: 'raw', format: 'plain', data: line + '\n' }));
    await qz.print(config, data);
    return true;
  } catch (e) {
    console.error('[QZ Tray]', e);
    return false;
  }
}

// ── Fallback HTML ─────────────────────────────────────────────────────────────

function printWithBrowser(htmlContent) {
  const win = window.open('', '_blank', 'width=400,height=600');
  if (!win) {
    alert('Permite ventanas emergentes para imprimir el ticket.');
    return;
  }
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Ticket</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; font-size: 12px; width: 280px; padding: 8px; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .line { border-top: 1px dashed #000; margin: 4px 0; }
        .row { display: flex; justify-content: space-between; }
        .logo { font-size: 16px; font-weight: bold; text-align: center; margin: 8px 0; }
        @media print { button { display: none; } }
      </style>
    </head>
    <body>${htmlContent}</body>
    </html>
  `);
  win.document.close();
  setTimeout(() => { win.print(); win.close(); }, 500);
}

// ── Ticket Builders ───────────────────────────────────────────────────────────

function buildTicketHTML({ pedido, negocio = 'POS Panadería' }) {
  const fecha = new Date().toLocaleString('es-CO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const detalles = (pedido.detalles || []).map(d => `
    <div class="row">
      <span>${d.cantidad}x ${d.producto_nombre}</span>
      <span>$${(d.cantidad * d.precio_unitario).toFixed(2)}</span>
    </div>
  `).join('');

  const subtotal = pedido.subtotal || 0;
  const iva      = subtotal * 0.19;
  const total    = subtotal + iva;

  return `
    <div class="logo">${negocio}</div>
    <div class="center">NIT: 000.000.000-0</div>
    <div class="center">Tel: (000) 000-0000</div>
    <div class="line"></div>
    <div class="row"><span>Fecha:</span><span>${fecha}</span></div>
    <div class="row"><span>Mesa:</span><span>${pedido.mesa_numero || 'Local'}</span></div>
    <div class="row"><span>Pedido #:</span><span>${pedido.id}</span></div>
    <div class="row"><span>Mesero:</span><span>${pedido.mesero || '-'}</span></div>
    <div class="line"></div>
    <div class="bold center" style="margin:4px 0">DETALLE DEL PEDIDO</div>
    <div class="line"></div>
    ${detalles}
    <div class="line"></div>
    <div class="row"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
    <div class="row"><span>IVA (19%):</span><span>$${iva.toFixed(2)}</span></div>
    <div class="line"></div>
    <div class="row bold"><span>TOTAL:</span><span>$${total.toFixed(2)}</span></div>
    <div class="line"></div>
    <div class="center" style="margin-top:8px">¡Gracias por su visita!</div>
    <div class="center">Vuelva pronto 🍞</div>
    <br><br><br>
  `;
}

function buildKitchenHTML({ pedido }) {
  const fecha = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  const cocinaItems = (pedido.detalles || []).filter(d => d.lugar_preparacion === 'cocina');
  const barraItems  = (pedido.detalles || []).filter(d => d.lugar_preparacion === 'barra');

  const renderItems = (items) => items.map(d => `
    <div class="row bold">
      <span>${d.cantidad}x ${d.producto_nombre}</span>
    </div>
    ${d.notas ? `<div style="padding-left:12px;font-style:italic">⚠ ${d.notas}</div>` : ''}
  `).join('');

  return `
    <div class="logo">*** COCINA ***</div>
    <div class="row"><span>Mesa:</span><span>${pedido.mesa_numero || 'Local'}</span></div>
    <div class="row"><span>Pedido #:</span><span>${pedido.id}</span></div>
    <div class="row"><span>Hora:</span><span>${fecha}</span></div>
    <div class="line"></div>
    ${cocinaItems.length > 0 ? `
      <div class="bold center">🍳 COCINA</div>
      <div class="line"></div>
      ${renderItems(cocinaItems)}
    ` : ''}
    ${barraItems.length > 0 ? `
      <div class="line"></div>
      <div class="bold center">☕ BARRA</div>
      <div class="line"></div>
      ${renderItems(barraItems)}
    ` : ''}
    <div class="line"></div>
    <br><br>
  `;
}

// ── API Pública ───────────────────────────────────────────────────────────────

/**
 * Imprime el ticket del cliente.
 * @param {object} pedido - datos del pedido con detalles
 * @param {string} [printerName] - nombre de la impresora (QZ Tray)
 */
export async function printCustomerTicket(pedido, printerName = null) {
  const html = buildTicketHTML({ pedido });
  const ok   = await printWithQZ(printerName, [html]);
  if (!ok) printWithBrowser(html);
}

/**
 * Imprime el ticket de cocina.
 * @param {object} pedido - datos del pedido con detalles
 * @param {string} [printerName] - nombre de la impresora de cocina
 */
export async function printKitchenTicket(pedido, printerName = null) {
  const html = buildKitchenHTML({ pedido });
  const ok   = await printWithQZ(printerName, [html]);
  if (!ok) printWithBrowser(html);
}

/**
 * Verifica si QZ Tray está disponible y conectado.
 */
export async function isQZAvailable() {
  const qz = await connectQZ();
  return !!qz;
}
