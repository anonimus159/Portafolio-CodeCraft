/**
 * Sistema de sonidos para el POS
 * Genera sonidos con Web Audio API (sin archivos externos)
 */

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function playTone({ frequency = 440, duration = 0.15, type = 'sine', volume = 0.3, delay = 0 }) {
  const ctx = getCtx();
  if (!ctx) return;

  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type      = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.05);
}

// ── Sonidos del POS ─────────────────────────────────────────────────────────

/** Nuevo pedido entrante — doble bip ascendente */
export function playNewOrder() {
  playTone({ frequency: 600,  duration: 0.15, volume: 0.35, delay: 0    });
  playTone({ frequency: 900,  duration: 0.2,  volume: 0.4,  delay: 0.18 });
}

/** Pedido listo en cocina — triple bip cheerful */
export function playOrderReady() {
  playTone({ frequency: 700,  duration: 0.12, volume: 0.3, delay: 0    });
  playTone({ frequency: 880,  duration: 0.12, volume: 0.3, delay: 0.15 });
  playTone({ frequency: 1050, duration: 0.2,  volume: 0.35, delay: 0.3  });
}

/** Producto agregado al carrito — bip suave */
export function playAddProduct() {
  playTone({ frequency: 800, duration: 0.1, type: 'sine', volume: 0.2, delay: 0 });
}

/** Pago exitoso — fanfare breve */
export function playPaymentSuccess() {
  playTone({ frequency: 523, duration: 0.1,  volume: 0.3, delay: 0    });
  playTone({ frequency: 659, duration: 0.1,  volume: 0.3, delay: 0.12 });
  playTone({ frequency: 784, duration: 0.1,  volume: 0.3, delay: 0.24 });
  playTone({ frequency: 1047,duration: 0.25, volume: 0.35, delay: 0.36 });
}

/** Error — bip grave descendente */
export function playError() {
  playTone({ frequency: 400, duration: 0.2, type: 'sawtooth', volume: 0.2, delay: 0    });
  playTone({ frequency: 300, duration: 0.2, type: 'sawtooth', volume: 0.15, delay: 0.22 });
}

/** Alerta de stock bajo — bip intermitente */
export function playStockAlert() {
  playTone({ frequency: 550, duration: 0.15, type: 'square', volume: 0.2, delay: 0    });
  playTone({ frequency: 550, duration: 0.15, type: 'square', volume: 0.2, delay: 0.25 });
}

/** Desbloquear el contexto de audio (debe llamarse en interacción del usuario) */
export function unlockAudio() {
  const ctx = getCtx();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
}
