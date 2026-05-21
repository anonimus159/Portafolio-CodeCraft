import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  LayoutGrid, Croissant, Package, ChefHat, BarChart3,
  Wallet, LogOut, User, BookOpen, ReceiptText,
  TrendingUp, Gauge, ChevronRight, Bell, Settings
} from 'lucide-react';

const NAV = [
  {
    group: 'Principal',
    items: [
      { path: '/',          label: 'Dashboard',    icon: Gauge,      roles: ['admin','cajero','mesero','cocina'] },
      { path: '/mesas',     label: 'Mesas',        icon: LayoutGrid, roles: ['admin','cajero','mesero','cocina'] },
      { path: '/cocina',    label: 'Cocina KDS',   icon: ChefHat,    roles: ['admin','cocina'] },
      { path: '/caja',      label: 'Caja',         icon: Wallet,     roles: ['admin','cajero'] },
    ],
  },
  {
    group: 'Gestión',
    items: [
      { path: '/inventario',label: 'Inventario',   icon: Package,    roles: ['admin'] },
      { path: '/recetas',   label: 'Recetas',      icon: BookOpen,   roles: ['admin'] },
      { path: '/cuadre',    label: 'Cuadre',       icon: ReceiptText,roles: ['admin','cajero'] },
      { path: '/reportes',  label: 'Reportes',     icon: BarChart3,  roles: ['admin'] },
    ],
  },
];

function Sparkline({ data = [] }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const w = 160, h = 40;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * (h - 6) - 3;
    return `${x},${y}`;
  }).join(' ');
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10 mt-1" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#sg)" />
      <polyline points={pts} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const fecha = new Date().toISOString().split('T')[0];
        const [dashboardRes] = await Promise.allSettled([
          api.get('/reportes/dashboard')
        ]);
        const data = dashboardRes.status === 'fulfilled' ? dashboardRes.value.data?.data : null;
        setSummary({
          ventas:  data?.ventas?.hoy?.total || 0,
          pedidos: data?.ventas?.hoy?.pedidos || 0,
          spark:   [3,5,4,7,6,9,8],
        });
      } catch { /* silent */ }
    };
    load();
  }, []);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const filteredNav = NAV.map(group => ({
    ...group,
    items: group.items.filter(item => item.roles.includes(user?.rol)),
  })).filter(g => g.items.length > 0);

  const rolLabel = { admin: 'Administrador', cajero: 'Cajero', mesero: 'Mesero', cocina: 'Cocina' };

  return (
    <aside
      style={{ width: 'var(--sidebar-w)', flexShrink: 0 }}
      className="flex flex-col h-screen sticky top-0 z-40 border-r border-[rgba(255,255,255,0.06)]"
      style={{ width: '260px', background: '#0e0e10' }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 4px 12px rgba(245,158,11,0.35)' }}>
            <Croissant className="w-5 h-5" style={{ color: '#0c0a00' }} />
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">POS Panadería</div>
            <div className="text-[10px] font-medium" style={{ color: '#f59e0b' }}>Sistema de Gestión</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto pb-3 space-y-5">
        {filteredNav.map(group => (
          <div key={group.group}>
            <div className="px-3 mb-1.5" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#52525b' }}>
              {group.group}
            </div>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon   = item.icon;
                const active = isActive(item.path);
                return (
                  <Link key={item.path} to={item.path}
                    className={`nav-item${active ? ' active' : ''}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Daily summary */}
      <div className="px-4 pb-3">
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}>
          <div className="px-4 pt-3 pb-0">
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#52525b' }}>Hoy</span>
              <TrendingUp className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-1">
              <div>
                <div style={{ fontSize: '10px', color: '#71717a', marginBottom: 2 }}>Ventas</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#fafafa', lineHeight: 1 }}>
                  ${(summary?.ventas || 0).toFixed(0)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#71717a', marginBottom: 2 }}>Pedidos</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>
                  {summary?.pedidos || 0}
                </div>
              </div>
            </div>
            <Sparkline data={summary?.spark?.length ? summary.spark : [3,5,4,7,6,9,8]} />
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-3 pb-4 pt-1 space-y-1" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'var(--bg-overlay)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
            {user?.nombre?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">{user?.nombre || 'Usuario'}</div>
            <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 600 }}>{rolLabel[user?.rol] || user?.rol}</div>
          </div>
        </div>
        <button onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ color: '#71717a', border: '1px solid transparent' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#71717a'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
