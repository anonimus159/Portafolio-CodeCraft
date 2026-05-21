import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Clock, CheckCircle, Timer, Bell, BellOff, RefreshCw, AlertCircle, Utensils, Coffee } from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { playNewOrder, playOrderReady } from '../utils/sounds';

function LiveTimer({ since }) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const update = () => setSecs(Math.floor((Date.now() - new Date(since)) / 1000));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [since]);
  const mins = Math.floor(secs / 60);
  const ss   = secs % 60;
  const color = mins >= 20 ? '#f87171' : mins >= 10 ? '#fbbf24' : '#4ade80';
  return (
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700, color, display: 'flex', alignItems: 'center', gap: 4 }}>
      <Clock style={{ width: 10, height: 10 }} />
      {String(mins).padStart(2,'0')}:{String(ss).padStart(2,'0')}
    </span>
  );
}

const ESTADO_META = {
  pendiente:      { color: '#facc15', bg: 'rgba(234,179,8,0.12)',   border: 'rgba(234,179,8,0.25)',   label: 'Pendiente' },
  en_preparacion: { color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  border: 'rgba(251,146,60,0.25)',  label: 'Preparando' },
  listo:          { color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)',  label: 'Listo' },
};

export default function Cocina() {
  const toast = useToast();
  const [pedidos,   setPedidos]   = useState([]);
  const [filtro,    setFiltro]    = useState('todos');
  const [sonido,    setSonido]    = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [lastSync,  setLastSync]  = useState(null);
  const prevIds = useRef(new Set());

  const cargarPedidos = async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await api.get('/pedidos/cocina', { params: filtro !== 'todos' ? { tipo: filtro } : {} });
      const data = res.data.data || [];
      const nuevosIds = new Set(data.map(p => p.id));
      if (prevIds.current.size > 0 && [...nuevosIds].some(id => !prevIds.current.has(id))) {
        if (sonido) playNewOrder();
        toast.info('Nuevo pedido', 'Ha llegado un nuevo pedido a cocina');
      }
      prevIds.current = nuevosIds;
      setPedidos(data);
      setLastSync(new Date());
    } catch { /* silent */ }
    finally { if (manual) setTimeout(() => setRefreshing(false), 500); }
  };

  useEffect(() => { cargarPedidos(); const t = setInterval(cargarPedidos, 8000); return () => clearInterval(t); }, [filtro]);

  const cambiarEstado = async (detalleId, estado, nombre) => {
    try {
      await api.patch(`/pedidos/detalle/${detalleId}/estado`, { estado });
      if (estado === 'listo' && sonido) playOrderReady();
      if (estado === 'listo') toast.success('¡Listo!', `${nombre} está listo para servir`);
      cargarPedidos();
    } catch { toast.error('Error', 'No se pudo actualizar'); }
  };

  const grupos = (() => {
    const map = {};
    pedidos.forEach(p => {
      if (!map[p.pedido_id]) map[p.pedido_id] = { pedido_id: p.pedido_id, mesa_numero: p.mesa_numero, created_at: p.created_at, items: [] };
      map[p.pedido_id].items.push(p);
    });
    return Object.values(map).sort((a, b) => {
      const pri = { pendiente: 0, en_preparacion: 1, listo: 2 };
      const pa = Math.min(...a.items.map(i => pri[i.estado] ?? 9));
      const pb = Math.min(...b.items.map(i => pri[i.estado] ?? 9));
      return pa - pb || new Date(a.created_at) - new Date(b.created_at);
    });
  })();

  const getGrupoEstado = g => g.items.some(i => i.estado === 'pendiente') ? 'pendiente' : g.items.some(i => i.estado === 'en_preparacion') ? 'en_preparacion' : 'listo';

  const stats = {
    pendiente:      pedidos.filter(p => p.estado === 'pendiente').length,
    en_preparacion: pedidos.filter(p => p.estado === 'en_preparacion').length,
    listo:          pedidos.filter(p => p.estado === 'listo').length,
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 10 }}>
            Cocina KDS
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.8)', animation: 'pulse-anim 1.5s ease-in-out infinite' }} />
          </h1>
          <p style={{ fontSize: 12, color: '#71717a' }}>
            Kitchen Display System · actualiza cada 8s
            {lastSync && <span style={{ color: '#3f3f46' }}> · {lastSync.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setSonido(s => !s)}
            className={`pos-btn pos-btn-sm ${sonido ? 'pos-btn-success' : 'pos-btn-ghost'}`}
            style={{ gap: 6 }}>
            {sonido ? <Bell style={{ width: 13, height: 13 }} /> : <BellOff style={{ width: 13, height: 13 }} />}
            {sonido ? 'Sonido ON' : 'Sonido OFF'}
          </button>
          <button onClick={() => cargarPedidos(true)} className="pos-btn pos-btn-ghost pos-btn-sm pos-btn-icon"
            style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}>
            <RefreshCw style={{ width: 13, height: 13 }} />
          </button>
          <div style={{ display: 'flex', background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 4, gap: 3 }}>
            {[['todos','Todos'],[' comida','Comida'],['bebida','Bebidas']].map(([val, label]) => (
              <button key={val} onClick={() => setFiltro(val.trim())}
                style={{ padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, transition: 'all 0.15s', background: filtro === val.trim() ? 'rgba(245,158,11,0.15)' : 'transparent', color: filtro === val.trim() ? '#fbbf24' : '#71717a' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { key: 'pendiente',      label: 'Pendientes',     color: '#facc15', bg: 'rgba(234,179,8,0.1)',  icon: Clock },
          { key: 'en_preparacion', label: 'En preparación', color: '#fb923c', bg: 'rgba(251,146,60,0.1)', icon: Timer },
          { key: 'listo',          label: 'Listos',         color: '#4ade80', bg: 'rgba(74,222,128,0.1)', icon: CheckCircle },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.key} className="stat-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#52525b', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: s.color, lineHeight: 1 }}>{stats[s.key]}</div>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon style={{ width: 18, height: 18, color: s.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* KDS cards */}
      {grupos.length === 0 ? (
        <div className="pos-empty" style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)', borderRadius: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle style={{ width: 24, height: 24, color: '#4ade80' }} />
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#fafafa', margin: 0 }}>¡Todo al día!</p>
          <p style={{ fontSize: 12, color: '#52525b', margin: 0 }}>No hay pedidos activos en cocina</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          <AnimatePresence>
            {grupos.map(grupo => {
              const ge   = getGrupoEstado(grupo);
              const meta = ESTADO_META[ge];
              const mins = Math.floor((Date.now() - new Date(grupo.created_at)) / 60000);
              const urgent = mins >= 20;
              return (
                <motion.div
                  key={grupo.pedido_id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`kds-card${urgent ? ' urgent' : ''}`}
                  style={{ borderLeft: `3px solid ${meta.color}` }}
                >
                  {/* Card header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: meta.bg, border: `1px solid ${meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: meta.color }}>
                        {grupo.mesa_numero || 'L'}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fafafa' }}>Mesa {grupo.mesa_numero || 'Local'}</div>
                        <div style={{ fontSize: 10, color: '#71717a' }}>Pedido #{grupo.pedido_id}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: meta.color, background: meta.bg, border: `1px solid ${meta.border}`, padding: '2px 8px', borderRadius: 99 }}>
                        {meta.label}
                      </span>
                      <LiveTimer since={grupo.created_at} />
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {grupo.items.map(item => {
                      const im = ESTADO_META[item.estado];
                      return (
                        <div key={item.id} style={{ padding: '10px 12px', borderRadius: 10, border: `1px solid ${im.border}`, background: im.bg }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                                <span style={{ fontSize: 15, fontWeight: 900, color: '#fafafa' }}>{item.cantidad}x</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.producto_nombre}</span>
                              </div>
                              {item.observaciones && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 7px', borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                  <AlertCircle style={{ width: 10, height: 10, color: '#f87171', flexShrink: 0 }} />
                                  <span style={{ fontSize: 11, color: '#fca5a5' }}>{item.observaciones}</span>
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', flexShrink: 0 }}>
                              {item.estado === 'pendiente' && (
                                <button onClick={() => cambiarEstado(item.id, 'en_preparacion', item.producto_nombre)}
                                  className="pos-btn pos-btn-sm"
                                  style={{ fontSize: 10, background: 'rgba(251,146,60,0.15)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)', borderRadius: 7, padding: '4px 10px' }}>
                                  ▶ Preparar
                                </button>
                              )}
                              {item.estado === 'en_preparacion' && (
                                <button onClick={() => cambiarEstado(item.id, 'listo', item.producto_nombre)}
                                  className="pos-btn pos-btn-sm"
                                  style={{ fontSize: 10, background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 7, padding: '4px 10px' }}>
                                  ✓ Listo
                                </button>
                              )}
                              {item.estado === 'listo' && (
                                <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 700 }}>✓ Listo</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
