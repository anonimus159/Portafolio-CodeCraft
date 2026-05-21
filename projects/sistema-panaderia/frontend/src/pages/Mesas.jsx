import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Plus, Search, Users, Clock, DollarSign, RefreshCw, Wifi } from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const estadoColor = {
  libre:     { dot: '#22c55e', text: '#4ade80', accent: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.25)',  label: 'Libre' },
  ocupada:   { dot: '#f59e0b', text: '#fbbf24', accent: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', label: 'Ocupada' },
  por_pagar: { dot: '#ef4444', text: '#f87171', accent: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.25)',  label: 'Por pagar' },
};

function MesaCard({ mesa, onOpen, index }) {
  const e = estadoColor[mesa.estado] || estadoColor.libre;
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 260, damping: 22 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onOpen(mesa)}
      className={`mesa-card ${mesa.estado}`}
      style={{ width: '100%', textAlign: 'left', fontFamily: 'inherit' }}
    >
      <div style={{ padding: '20px 20px 18px' }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#fafafa', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {mesa.numero}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5, color: '#71717a', fontSize: 12 }}>
              <Users style={{ width: 12, height: 12 }} />
              <span>{mesa.capacidad} personas</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 99,
              background: e.accent, border: `1px solid ${e.border}`,
              fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: e.text,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: e.dot, boxShadow: `0 0 5px ${e.dot}` }} />
              {e.label}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: 10, color: '#52525b', marginBottom: 3 }}>Total</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: mesa.total_consumido > 0 ? '#fbbf24' : '#3f3f46' }}>
              ${(mesa.total_consumido || 0).toFixed(2)}
            </div>
          </div>
          <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: 10, color: '#52525b', marginBottom: 3 }}>Pedidos</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: mesa.pedidos_count > 0 ? '#f59e0b' : '#3f3f46' }}>
              {mesa.pedidos_count || 0}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '9px', borderRadius: 10,
          background: mesa.estado === 'libre' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
          border: `1px solid ${mesa.estado === 'libre' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`,
          fontSize: 12, fontWeight: 700,
          color: mesa.estado === 'libre' ? '#4ade80' : '#fbbf24',
        }}>
          {mesa.estado === 'libre' ? '+ Abrir Mesa' : '→ Ver Pedido'}
        </div>
      </div>
    </motion.button>
  );
}

export default function Mesas() {
  const [mesas,    setMesas]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [creating, setCreating] = useState(false);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('todas');
  const [lastSync, setLastSync] = useState(null);
  const navigate = useNavigate();
  const toast    = useToast();

  const loadTables = async () => {
    try {
      setLoading(true);
      const [mesasRes, pedidosRes] = await Promise.all([
        api.get('/mesas'),
        api.get('/pedidos/estado').catch(() => ({ data: { data: [] } })),
      ]);
      const pedidosActivos = (pedidosRes.data.data || []).filter(p => !['entregado','cancelado'].includes(p.estado));
      const enriched = await Promise.all((mesasRes.data.data || []).map(async mesa => {
        const pedidosMesa = pedidosActivos.filter(p => p.mesa_id === mesa.id);
        let total = 0;
        for (const pedido of pedidosMesa) {
          const d = await api.get(`/pedidos/${pedido.id}`).catch(() => null);
          total += d?.data?.data?.total || d?.data?.data?.subtotal || 0;
        }
        return { ...mesa, total_consumido: total, pedidos_count: pedidosMesa.length };
      }));
      setMesas(enriched);
      setLastSync(new Date());
    } catch { toast.error('Error', 'No se pudo cargar las mesas'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { loadTables(); }, []);

  const handleOpen = async (mesa) => {
    try {
      if (mesa.estado === 'libre') {
        const res = await api.post('/pedidos', { mesa_id: mesa.id, usuario_id: 1 });
        navigate(`/mesa/${res.data.data.id}`);
      } else {
        const res = await api.get(`/mesas/${mesa.id}`);
        if (res.data.data.pedido_activo) navigate(`/mesa/${res.data.data.pedido_activo.id}`);
      }
    } catch { toast.error('Error', 'No se pudo abrir la mesa'); }
  };

  const createTable = async () => {
    try {
      setCreating(true);
      const next = Math.max(0, ...mesas.map(m => Number(m.numero) || 0)) + 1;
      await api.post('/mesas', { numero: next, capacidad: 4, posicion_x: 0, posicion_y: 0 });
      await loadTables();
      toast.success('Mesa creada', `Mesa ${next} agregada correctamente`);
    } catch { toast.error('Error', 'No se pudo crear la mesa'); }
    finally { setCreating(false); }
  };

  const filtered = useMemo(() => {
    return mesas.filter(m => {
      const matchSearch = String(m.numero).includes(search) || m.estado.includes(search.toLowerCase());
      const matchFilter = filter === 'todas' || m.estado === filter;
      return matchSearch && matchFilter;
    });
  }, [mesas, search, filter]);

  const counts = {
    libre:     mesas.filter(m => m.estado === 'libre').length,
    ocupada:   mesas.filter(m => m.estado === 'ocupada').length,
    por_pagar: mesas.filter(m => m.estado === 'por_pagar').length,
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 3 }}>Mesas</h1>
          <p style={{ fontSize: 12, color: '#71717a', display: 'flex', alignItems: 'center', gap: 6 }}>
            Salón · {mesas.length} mesas en total
            {lastSync && <span style={{ color: '#3f3f46' }}>· Sync {lastSync.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={loadTables} className="pos-btn pos-btn-ghost pos-btn-sm pos-btn-icon" title="Actualizar">
            <RefreshCw style={{ width: 14, height: 14 }} />
          </button>
          <button onClick={createTable} disabled={creating} className="pos-btn pos-btn-primary">
            <Plus style={{ width: 15, height: 15 }} />
            Nueva mesa
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total',     value: mesas.length,       color: '#a1a1aa', bg: 'rgba(255,255,255,0.06)' },
          { label: 'Libres',    value: counts.libre,       color: '#4ade80', bg: 'rgba(34,197,94,0.12)'   },
          { label: 'Ocupadas',  value: counts.ocupada,     color: '#fbbf24', bg: 'rgba(245,158,11,0.12)'  },
          { label: 'Por Pagar', value: counts.por_pagar,   color: '#f87171', bg: 'rgba(239,68,68,0.12)'   },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 10, color: '#52525b', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#52525b' }} />
          <input type="text" placeholder="Buscar mesa..." value={search} onChange={e => setSearch(e.target.value)}
            className="pos-input" style={{ paddingLeft: 36, fontSize: 13 }} />
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 4 }}>
          {[['todas','Todas'],['libre','Libres'],['ocupada','Ocupadas'],['por_pagar','Por pagar']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              style={{
                padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                fontFamily: 'inherit', transition: 'all 0.15s',
                background: filter === val ? 'rgba(245,158,11,0.15)' : 'transparent',
                color:      filter === val ? '#fbbf24'                : '#71717a',
              }}
            >{label}</button>
          ))}
        </div>
      </div>

      {/* Grid mesas */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} className="pos-skeleton" style={{ height: 200, borderRadius: 14 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="pos-empty" style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)', borderRadius: 14 }}>
          <LayoutGrid style={{ width: 36, height: 36, color: '#3f3f46' }} />
          <p style={{ fontSize: 15, fontWeight: 700, color: '#fafafa', margin: 0 }}>No hay mesas</p>
          <p style={{ fontSize: 12, color: '#52525b', margin: 0 }}>Crea una nueva mesa o ajusta la búsqueda</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          <AnimatePresence>
            {filtered.map((mesa, i) => (
              <MesaCard key={mesa.id} mesa={mesa} onOpen={handleOpen} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
