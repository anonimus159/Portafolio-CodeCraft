import React, { useMemo } from 'react';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Clock,
  ArrowUpRight,
  Activity,
  MoreHorizontal,
  ChevronRight,
  ArrowDownRight,
  CheckCircle2,
  Utensils,
  ShoppingCart,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/format';

const DashboardModule = ({ orders = [], settings = {} }) => {

  const stats = useMemo(() => {
    const completed = orders.filter(o => o.status === 'completed');
    const active    = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
    const ready     = orders.filter(o => o.status === 'ready');

    const totalRevenue = completed.reduce((s, o) => s + (o.total || 0), 0);
    const totalItems   = completed.reduce((s, o) => s + o.items.reduce((a, i) => a + i.quantity, 0), 0);
    const avgTicket    = completed.length > 0 ? totalRevenue / completed.length : 0;
    const totalOrders  = orders.length;

    // Product frequency map from completed orders
    const productFreq = {};
    completed.forEach(o => o.items.forEach(i => {
      productFreq[i.name] = (productFreq[i.name] || 0) + i.quantity;
    }));
    const topProduct = Object.entries(productFreq).sort((a, b) => b[1] - a[1])[0];

    // Last 5 orders for activity feed
    const recent = [...orders].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

    return { completed, active, ready, totalRevenue, totalItems, avgTicket, totalOrders, topProduct, recent };
  }, [orders]);

  const kpis = [
    {
      label: 'Ventas Totales',
      value: formatCurrency(stats.totalRevenue),
      sub: `${stats.completed.length} pedidos completados`,
      up: stats.completed.length > 0,
      trend: stats.completed.length > 0 ? `+${stats.completed.length} hoy` : 'Sin ventas aún',
      icon: <TrendingUp />,
    },
    {
      label: 'Platos Servidos',
      value: `${stats.totalItems}`,
      sub: 'Unidades despachadas',
      up: true,
      trend: stats.totalOrders > 0 ? `${stats.totalOrders} órdenes en total` : 'Sin órdenes',
      icon: <ShoppingBag />,
    },
    {
      label: 'En Cocina Ahora',
      value: `${stats.active.length + stats.ready.length}`,
      sub: `${stats.active.length} activas · ${stats.ready.length} listas`,
      up: stats.active.length === 0,
      trend: stats.active.length > 0 ? `${stats.active.length} pendiente(s)` : '¡Al día!',
      icon: <Users />,
    },
    {
      label: 'Ticket Promedio',
      value: formatCurrency(Math.round(stats.avgTicket)),
      sub: 'Por pedido completado',
      up: true,
      trend: stats.topProduct ? `Top: ${stats.topProduct[0]}` : 'Sin datos aún',
      icon: <Clock />,
    },
  ];

  // Activity feed colors and labels
  const activityColor = (status) => {
    if (status === 'completed') return { dot: 'bg-success', label: 'Cobrado', text: 'text-success' };
    if (status === 'ready')     return { dot: 'bg-warning animate-pulse', label: 'Listo', text: 'text-warning' };
    if (status === 'preparing') return { dot: 'bg-accent-secondary', label: 'Cocinando', text: 'text-accent-secondary' };
    return { dot: 'bg-accent-primary animate-pulse', label: 'Nuevo pedido', text: 'text-accent-primary' };
  };

  return (
    <div className="flex flex-col gap-6 pt-6">

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="enterprise-card"
          >
            <div className="flex-between mb-6">
              <div className="text-text-secondary">{React.cloneElement(kpi.icon, { size: 20 })}</div>
              <div className={`badge ${kpi.up ? 'badge-success' : 'badge-warning'}`}>
                {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-sm text-text-tertiary font-medium mb-1 uppercase tracking-wider">{kpi.label}</p>
              <h3 className="text-3xl font-bold tracking-tight">{kpi.value}</h3>
              <p className="text-xs text-text-tertiary mt-2">{kpi.sub}</p>
            </div>
            {/* Sparkline bars */}
            <div className="mt-4 flex items-end gap-1 h-8 opacity-40">
              {[4, 6, 5, 8, 7, 9, 8, 10, 7, 12].map((h, j) => (
                <div key={j} className="flex-1 bg-accent-secondary/40 rounded-t-sm" style={{ height: `${h * 10}%` }} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution Chart */}
        <div className="lg:col-span-2 enterprise-card flex flex-col">
          <div className="flex-between mb-8">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp size={18} className="text-accent-primary" /> Estado de Órdenes
              </h3>
              <p className="text-sm text-text-tertiary mt-1">
                {orders.length === 0
                  ? 'Sin órdenes registradas aún — abre el POS para empezar'
                  : `${orders.length} orden(es) registradas en esta sesión`}
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="flex-1 flex-center flex-col text-text-tertiary opacity-50 py-12">
              <ShoppingCart size={48} className="mb-4" />
              <p className="text-sm">Las métricas aparecerán aquí cuando se procesen pedidos.</p>
            </div>
          ) : (
            <div className="flex-1 flex items-end justify-around gap-4 h-[240px] relative mt-4">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[1,2,3,4].map(i => <div key={i} className="border-b border-border-subtle w-full h-0" />)}
              </div>

              {[
                { label: 'Pendientes',  count: orders.filter(o=>o.status==='pending').length,   color: 'bg-accent-primary' },
                { label: 'Cocinando',   count: orders.filter(o=>o.status==='preparing').length, color: 'bg-accent-secondary' },
                { label: 'Listos',      count: orders.filter(o=>o.status==='ready').length,     color: 'bg-warning' },
                { label: 'Completados', count: orders.filter(o=>o.status==='completed').length, color: 'bg-success' },
              ].map((col, i) => {
                const maxCount = Math.max(...[
                  orders.filter(o=>o.status==='pending').length,
                  orders.filter(o=>o.status==='preparing').length,
                  orders.filter(o=>o.status==='ready').length,
                  orders.filter(o=>o.status==='completed').length,
                  1 // avoid div by zero
                ]);
                const pct = Math.round((col.count / maxCount) * 100);
                return (
                  <div key={i} className="w-full flex flex-col items-center gap-3 z-10 group cursor-pointer">
                    <div className="w-full relative h-[200px] flex items-end justify-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(pct, 4)}%` }}
                        transition={{ delay: 0.2 + (i * 0.1), duration: 0.8, ease: 'easeOut' }}
                        className={`w-3/4 ${col.color} opacity-70 group-hover:opacity-100 border border-white/10 rounded-t-sm transition-all relative`}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {col.count} orden{col.count !== 1 ? 'es' : ''}
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-[11px] font-medium text-text-tertiary text-center">{col.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Activity Feed */}
        <div className="enterprise-card flex flex-col">
          <div className="flex-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity size={18} className="text-text-secondary" /> Actividad Reciente
            </h3>
          </div>

          {stats.recent.length === 0 ? (
            <div className="flex-1 flex-center flex-col text-text-tertiary opacity-40 py-8">
              <CheckCircle2 size={32} className="mb-2" />
              <p className="text-sm">Sin actividad aún</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scroll-hide space-y-4">
              {stats.recent.map((order, i) => {
                const act = activityColor(order.status);
                const timeAgo = (() => {
                  const secs = Math.floor((Date.now() - new Date(order.timestamp).getTime()) / 1000);
                  if (secs < 60) return 'ahora';
                  const m = Math.floor(secs / 60);
                  if (m < 60) return `hace ${m}m`;
                  return `hace ${Math.floor(m/60)}h`;
                })();
                return (
                  <div key={order.id} className="flex gap-4 group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="mt-1 relative flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full ${act.dot}`} />
                      {i !== stats.recent.length - 1 && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-px h-8 bg-border-light" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className={`font-medium ${act.text}`}>{act.label} </span>
                        <span className="font-bold text-text-primary">{order.id}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-text-tertiary">
                          {order.tableId === 'LLEVAR' ? '🛍️ Para Llevar' : `Mesa ${order.tableId}`}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border-light" />
                        <span className="text-xs text-text-tertiary">{formatCurrency(order.total || 0)}</span>
                        <span className="w-1 h-1 rounded-full bg-border-light" />
                        <span className="text-xs text-text-tertiary">{timeAgo}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardModule;
