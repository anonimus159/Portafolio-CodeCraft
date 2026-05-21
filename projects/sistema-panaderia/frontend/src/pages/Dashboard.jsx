import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutGrid, TrendingUp, ShoppingBag, DollarSign,
  AlertTriangle, ChefHat, Wallet, Package, ArrowRight,
  Clock, ReceiptText, Zap, Activity
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const card = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06 } },
};

function StatCard({ label, value, icon: Icon, color, bg, loading }) {
  return (
    <motion.div variants={card} className="stat-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#71717a' }}>{label}</span>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon style={{ width: 16, height: 16, color }} />
        </div>
      </div>
      {loading
        ? <div className="pos-skeleton" style={{ height: 32, width: '60%' }} />
        : <p style={{ fontSize: 28, fontWeight: 800, color: '#fafafa', lineHeight: 1, margin: 0 }}>{value}</p>
      }
    </motion.div>
  );
}

function QuickAction({ icon: Icon, label, description, to, color, bg }) {
  const nav = useNavigate();
  return (
    <motion.button
      variants={card}
      whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.97 }}
      onClick={() => nav(to)}
      style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 14,
        padding: '18px 20px',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'border-color 0.18s',
        width: '100%',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
    >
      <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <Icon style={{ width: 18, height: 18, color }} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#fafafa', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#71717a', lineHeight: 1.5 }}>{description}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 14, fontSize: 11, fontWeight: 700, color, opacity: 0.8 }}>
        Abrir <ArrowRight style={{ width: 12, height: 12 }} />
      </div>
    </motion.button>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data,    setData]    = useState(null);
  const [mesas,   setMesas]   = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const fecha = new Date().toISOString().split('T')[0];
        const [dashboardRes, mRes, aRes, pRes] = await Promise.allSettled([
          api.get('/reportes/dashboard'),
          api.get('/mesas'),
          api.get('/inventario/alertas'),
          api.get('/pedidos/estado'),
        ]);
        if (dashboardRes.status === 'fulfilled') setData(dashboardRes.value.data.data);
        if (mRes.status === 'fulfilled') setMesas(mRes.value.data.data || []);
        if (aRes.status === 'fulfilled') setAlertas(aRes.value.data.data?.slice(0,4) || []);
        if (pRes.status === 'fulfilled') {
          const activos = (pRes.value.data.data || [])
            .filter(p => !['entregado','cancelado'].includes(p.estado))
            .slice(0, 6);
          setPedidos(activos);
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
    const t = setInterval(load, 60000); // Changed from 30s to 60s to avoid rate limiting
    return () => clearInterval(t);
  }, []);

  const total    = data?.ventas?.hoy?.total || 0;
  const numVentas= data?.ventas?.hoy?.pedidos || 0;
  const ticket   = numVentas > 0 ? total / numVentas : 0;
  const mesasActivas = mesas.filter(m => m.estado !== 'libre').length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  const actions = [
    { icon: LayoutGrid, label: 'Mesas',       description: 'Gestión de mesas y pedidos',         to: '/mesas',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { icon: ChefHat,    label: 'Cocina KDS',  description: 'Pantalla de cocina en tiempo real',   to: '/cocina',    color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    { icon: Wallet,     label: 'Caja',        description: 'Cobros y pagos pendientes',           to: '/caja',      color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
    { icon: Package,    label: 'Inventario',  description: 'Control de stock e insumos',          to: '/inventario',color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
    { icon: ReceiptText,label: 'Cuadre',      description: 'Cierre y cuadre de caja',             to: '/cuadre',    color: '#fb923c', bg: 'rgba(251,146,60,0.12)' },
    { icon: TrendingUp, label: 'Reportes',    description: 'Análisis de ventas y estadísticas',   to: '/reportes',  color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  ];

  const estadoDot = (estado) => {
    if (estado === 'libre')    return '#22c55e';
    if (estado === 'por_pagar')return '#ef4444';
    return '#f59e0b';
  };
  const estadoLabel = (estado) => {
    if (estado === 'libre')    return 'Libre';
    if (estado === 'por_pagar')return 'Por pagar';
    return 'Ocupada';
  };

  return (
    <div className="page-enter">
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em', marginBottom: 4 }}>
          {greeting}, {user?.nombre?.split(' ')[0] || 'Usuario'} 👋
        </h1>
        <p style={{ fontSize: 13, color: '#71717a' }}>
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <motion.div variants={stagger} initial="hidden" animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}
        className="lg:grid-cols-4 md:grid-cols-2"
      >
        <StatCard label="Ventas Hoy"      value={`$${total.toFixed(2)}`}   icon={DollarSign}  color="#f59e0b" bg="rgba(245,158,11,0.12)" loading={loading} />
        <StatCard label="Pedidos Hoy"     value={numVentas}                 icon={ShoppingBag} color="#22c55e" bg="rgba(34,197,94,0.12)"  loading={loading} />
        <StatCard label="Ticket Promedio" value={`$${ticket.toFixed(2)}`}  icon={Activity}    color="#60a5fa" bg="rgba(96,165,250,0.12)" loading={loading} />
        <StatCard label="Mesas Activas"   value={mesasActivas}              icon={LayoutGrid}  color="#a78bfa" bg="rgba(167,139,250,0.12)"loading={loading} />
      </motion.div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, marginBottom: 20 }}>

        {/* Quick actions */}
        <div>
          <div className="section-title" style={{ marginBottom: 14 }}>
            <Zap style={{ width: 12, height: 12, color: '#f59e0b' }} />
            Acceso rápido
          </div>
          <motion.div variants={stagger} initial="hidden" animate="show"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {actions.map(a => <QuickAction key={a.to} {...a} />)}
          </motion.div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Mesas status */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="section-title"><LayoutGrid style={{ width: 12, height: 12, color: '#f59e0b' }} />Mesas</span>
              <button onClick={() => { }} style={{ fontSize: 11, color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Ver todas →</button>
            </div>
            <div style={{ padding: '10px 14px', maxHeight: 200, overflowY: 'auto' }}>
              {loading ? (
                Array.from({length:4}).map((_,i) => (
                  <div key={i} className="pos-skeleton" style={{ height: 30, marginBottom: 8, borderRadius: 8 }} />
                ))
              ) : mesas.slice(0, 8).map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 6px', borderRadius: 8, transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: estadoDot(m.estado), boxShadow: `0 0 6px ${estadoDot(m.estado)}60` }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fafafa' }}>Mesa {m.numero}</span>
                    <span style={{ fontSize: 11, color: '#52525b' }}>{m.capacidad}p</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: estadoDot(m.estado) }}>{estadoLabel(m.estado)}</span>
                </div>
              ))}
              {mesas.length === 0 && !loading && (
                <p style={{ fontSize: 12, color: '#52525b', textAlign: 'center', padding: '12px 0' }}>Sin mesas</p>
              )}
            </div>
          </motion.div>

          {/* Stock alerts */}
          {alertas.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle style={{ width: 13, height: 13, color: '#f87171' }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#f87171' }}>Stock Bajo ({alertas.length})</span>
              </div>
              <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {alertas.map(a => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#a1a1aa', truncate: true }}>{a.nombre}</span>
                    <span style={{ fontWeight: 700, color: '#f87171', flexShrink: 0, marginLeft: 8 }}>{a.cantidad} {a.unidad}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      {pedidos.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="section-title"><Clock style={{ width: 12, height: 12, color: '#f59e0b' }} />Pedidos Activos</span>
            <span style={{ fontSize: 11, color: '#52525b' }}>{pedidos.length} activos</span>
          </div>
          <table className="pos-table">
            <thead>
              <tr>
                {['Pedido','Mesa','Estado','Hora',''].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {pedidos.map(p => {
                const colorMap = { pendiente: '#facc15', en_preparacion: '#fb923c', listo: '#4ade80' };
                const col = colorMap[p.estado] || '#a1a1aa';
                return (
                  <tr key={p.id}>
                    <td style={{ color: '#fafafa', fontWeight: 700 }}>#{p.id}</td>
                    <td>{p.mesa_numero ? `Mesa ${p.mesa_numero}` : 'Local'}</td>
                    <td>
                      <span className="pos-badge" style={{ background: `${col}1a`, color: col, border: `1px solid ${col}30`, textTransform: 'capitalize' }}>
                        {p.estado.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {new Date(p.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
