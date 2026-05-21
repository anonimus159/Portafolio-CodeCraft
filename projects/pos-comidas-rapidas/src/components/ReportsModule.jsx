import React, { useMemo, useState } from 'react';
import { BarChart2, PieChart as PieChartIcon, TrendingUp, Calendar, Download, ShoppingCart, CheckCircle2, Clock, Receipt, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/format';

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

const ReportsModule = ({ orders = [], setOrders, settings = {}, products = [] }) => {
  const [dateRange, setDateRange] = useState('today');
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const stats = useMemo(() => {
    const now = new Date();
    const filteredOrders = orders.filter(o => {
      const orderDate = new Date(o.timestamp);
      if (dateRange === 'today') {
        return orderDate.toDateString() === now.toDateString();
      }
      if (dateRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo;
      }
      if (dateRange === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orderDate >= monthAgo;
      }
      return true;
    });

    const completed = filteredOrders.filter(o => o.status === 'completed');
    const totalRevenue = completed.reduce((s, o) => s + (o.total || 0), 0);

    // Payment method breakdown for Cierre
    const paymentBreakdown = completed.reduce((acc, o) => {
      const method = o.paymentMethod || 'Efectivo';
      acc[method] = (acc[method] || 0) + o.total;
      return acc;
    }, {});

    // Product frequency from all orders (not just completed)
    const productFreq = {};
    orders.forEach(o => o.items.forEach(i => {
      productFreq[i.name] = (productFreq[i.name] || 0) + i.quantity;
    }));
    const topProducts = Object.entries(productFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const maxSold = topProducts[0]?.[1] || 1;

    // Category breakdown
    const catRevenue = {};
    completed.forEach(o => o.items.forEach(i => {
      const prod = products.find(p => p.name === i.name);
      const cat = prod?.category || 'otros';
      catRevenue[cat] = (catRevenue[cat] || 0) + (i.price * i.quantity);
    }));
    const catTotal = Object.values(catRevenue).reduce((a, b) => a + b, 0) || 1;
    const catBreakdown = Object.entries(catRevenue)
      .sort((a, b) => b[1] - a[1])
      .map(([name, val]) => ({ name, val, pct: Math.round((val / catTotal) * 100) }));

    // Avg ticket
    const avgTicket = completed.length > 0 ? totalRevenue / completed.length : 0;

    // Peak hour simulation (last 12 hours with actual count)
    const hourCounts = {};
    orders.forEach(o => {
      const h = new Date(o.timestamp).getHours();
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    });

    return { completed, totalRevenue, avgTicket, topProducts, maxSold, catBreakdown, catTotal, hourCounts, paymentBreakdown };
  }, [orders, dateRange, products]);

  const handleCloseDay = () => {
    if (confirm('¿Estás seguro de cerrar la caja? Esto archivará las ventas actuales y limpiará el tablero de órdenes.')) {
      setOrders([]);
      setShowCloseModal(false);
      alert('Cierre de caja exitoso. Las órdenes han sido limpiadas.');
    }
  };

  const CAT_COLORS = [
    'bg-accent-primary',
    'bg-accent-secondary',
    'bg-warning',
    'bg-success',
    'bg-danger',
  ];

  const handleExport = () => {
    const restaurantName = settings.restaurantName || 'FastPOS';
    const nit = settings.nit || 'N/A';
    const rows = [
      [`# Reporte de Ventas — ${restaurantName}  NIT: ${nit}`],
      [`# Generado: ${new Date().toLocaleString('es-CO')}`],
      [],
      ['ID', 'Tipo', 'Mesa/Llevar', 'Total', 'Impuesto', 'Estado', 'Fecha'],
      ...orders.map(o => [
        o.id,
        o.mode || 'table',
        o.tableId === 'LLEVAR' ? 'Para Llevar' : `Mesa ${o.tableId}`,
        o.total?.toFixed(0) || '0',
        ((o.total || 0) - (o.total || 0) / (1 + ((!isNaN(parseFloat(settings.taxRate)) ? parseFloat(settings.taxRate) : 8) / 100))).toFixed(0),
        o.status,
        new Date(o.timestamp).toLocaleString('es-CO'),
      ])
    ].map(r => r.join(',')).join('\n');
    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${(settings.restaurantName || 'fastpos').replace(/\s+/g,'_')}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const now = new Date();

  return (
    <div className="flex flex-col gap-6 pt-6 h-full relative">
      {/* Header Controls */}
      <div className="flex-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Desempeño Financiero y de Servicio</h2>
          <p className="text-xs text-text-tertiary mt-1">
            {settings.restaurantName || 'Le Restaurant'} &bull; NIT: {settings.nit || 'N/A'} &bull; {settings.currency || 'COP'}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={() => setShowCloseModal(true)}
            className="btn btn-accent btn-sm shadow-glow"
          >
            <Clock size={14} className="mr-1" /> Cierre de Caja
          </button>
          <div className="flex gap-1 bg-bg-surface p-1 rounded-lg border border-border-light">
            {['today', 'week', 'month', 'all'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  dateRange === range ? 'bg-accent-primary text-white shadow-sm' : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                {range === 'today' ? 'Hoy' : range === 'week' ? 'Semana' : range === 'month' ? 'Mes' : 'Todo'}
              </button>
            ))}
          </div>
          <button onClick={() => setShowPrintPreview(true)} className="btn btn-primary btn-sm shadow-glow">
            <Receipt size={14} className="mr-1" /> Reporte Formal PDF
          </button>
          <button onClick={handleExport} className="btn btn-secondary btn-sm">
            <Download size={14} /> Exportar CSV
          </button>
        </div>
      </div>

      {/* PRINT PREVIEW MODAL */}
      <AnimatePresence>
        {showPrintPreview && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white text-black overflow-y-auto p-10 print:p-0"
          >
            <div className="max-w-4xl mx-auto bg-white p-12 shadow-2xl print:shadow-none print:max-w-none">
              {/* Toolbar (hidden on print) */}
              <div className="flex justify-between items-center mb-10 print:hidden border-b border-gray-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black text-white rounded-lg flex-center"><Receipt size={20}/></div>
                  <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm">Vista Previa de Reporte</h3>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setShowPrintPreview(false)} className="px-6 py-2 rounded-xl border border-gray-200 font-bold text-sm text-gray-500 hover:bg-gray-50">Cerrar</button>
                  <button onClick={() => window.print()} className="px-6 py-2 rounded-xl bg-black text-white font-bold text-sm shadow-xl hover:scale-105 transition-all">Imprimir / Guardar PDF</button>
                </div>
              </div>

              {/* Report Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-black mb-2 tracking-tighter">{settings.restaurantName || 'FASTPOS ENTERPRISE'}</h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs mb-6">Reporte Ejecutivo de Ventas</p>
                <div className="h-px bg-gray-200 w-40 mx-auto mb-6"></div>
                <div className="grid grid-cols-3 gap-8 text-left max-w-2xl mx-auto text-sm">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Identificación</p>
                    <p className="font-bold">NIT: {settings.nit || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Periodo</p>
                    <p className="font-bold capitalize">{dateRange === 'today' ? 'Hoy' : dateRange === 'week' ? 'Última Semana' : 'Mensual'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Generado</p>
                    <p className="font-bold">{new Date().toLocaleString('es-CO')}</p>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-4 gap-6 mb-12">
                {[
                  { label: 'Ingresos Totales', val: formatCurrency(stats.totalRevenue) },
                  { label: 'Ventas Realizadas', val: stats.completed.length },
                  { label: 'Ticket Promedio', val: formatCurrency(stats.avgTicket) },
                  { label: 'Impuestos (Estim.)', val: formatCurrency(stats.totalRevenue - (stats.totalRevenue / (1 + ((!isNaN(parseFloat(settings.taxRate)) ? parseFloat(settings.taxRate) : 8) / 100)))) }
                ].map((s, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">{s.label}</p>
                    <p className="text-lg font-black text-gray-900">{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Detailed Table */}
              <div className="mb-12">
                <h3 className="font-bold mb-4 uppercase tracking-widest text-xs text-gray-400">Detalle de Transacciones</h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="py-3 text-left font-black">ID ORDEN</th>
                      <th className="py-3 text-left font-black">FECHA / HORA</th>
                      <th className="py-3 text-left font-black">MESA / TIPO</th>
                      <th className="py-3 text-left font-black">PAGO</th>
                      <th className="py-3 text-right font-black">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.completed.map(o => (
                      <tr key={o.id}>
                        <td className="py-3 font-bold">{o.id}</td>
                        <td className="py-3 text-gray-500">{new Date(o.timestamp).toLocaleString()}</td>
                        <td className="py-3 capitalize">{o.tableId === 'LLEVAR' ? 'Para Llevar' : `Mesa ${o.tableId}`}</td>
                        <td className="py-3 text-gray-500 capitalize">{o.paymentMethod || 'Efectivo'}</td>
                        <td className="py-3 text-right font-bold">{formatCurrency(o.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer / Signatures */}
              <div className="mt-20 grid grid-cols-2 gap-20">
                <div className="border-t border-gray-200 pt-4 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Firma Responsable</p>
                </div>
                <div className="border-t border-gray-200 pt-4 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Control de Auditoría</p>
                </div>
              </div>
              
              <div className="mt-20 text-center">
                <p className="text-[9px] text-gray-300 uppercase tracking-widest">Documento generado automáticamente por FastPOS Enterprise</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CIERRE DE CAJA MODAL */}
      {showCloseModal && (
        <div className="fixed inset-0 z-[100] flex-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-bg-surface border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-white/5 bg-accent-primary/5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent-primary/20 flex-center text-accent-primary">
                <Clock size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Cierre de Caja</h2>
                <p className="text-sm text-text-tertiary">Resumen del turno: {new Date().toLocaleDateString('es-CO')}</p>
              </div>
            </div>
            
            <div className="p-8 space-y-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold text-text-tertiary uppercase mb-1">Ventas Completas</p>
                  <p className="text-2xl font-black">{stats.completed.length}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold text-text-tertiary uppercase mb-1">Total Recaudado</p>
                  <p className="text-2xl font-black text-success">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest">Desglose de Pagos</h3>
                {Object.entries(stats.paymentBreakdown).length > 0 ? (
                  Object.entries(stats.paymentBreakdown).map(([method, amount]) => (
                    <div key={method} className="flex-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-sm font-medium capitalize">{method}</span>
                      <span className="text-sm font-bold mono-font">{formatCurrency(amount)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-text-tertiary italic text-center py-4">No hay ventas completadas en este periodo.</p>
                )}
              </div>

              <div className="bg-danger/10 border border-danger/30 p-4 rounded-xl flex gap-3">
                <Receipt size={20} className="text-danger flex-shrink-0 mt-1" />
                <p className="text-xs text-danger/90 leading-relaxed">
                  Al confirmar el cierre, la lista de órdenes se limpiará para iniciar un nuevo turno. Asegúrate de haber exportado el reporte si necesitas conservar los detalles de cada orden.
                </p>
              </div>
            </div>

            <div className="p-6 bg-white/5 border-t border-white/10 flex gap-3">
              <button onClick={() => setShowCloseModal(false)} className="flex-1 btn btn-secondary h-12">Cancelar</button>
              <button 
                onClick={handleCloseDay}
                className="flex-[2] btn btn-accent h-12 shadow-glow"
              >
                Confirmar Cierre y Limpiar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Ingresos Netos',
            value: formatCurrency(stats.totalRevenue),
            trend: `${stats.completed.length} ventas completadas`,
            type: 'success',
            icon: <TrendingUp size={20} className="text-success" />,
          },
          {
            label: 'Ticket Promedio',
            value: formatCurrency(Math.round(stats.avgTicket)),
            trend: stats.completed.length > 0 ? 'Por pedido completado' : 'Sin ventas aún',
            type: 'info',
            icon: <Receipt size={20} className="text-accent-secondary" />,
          },
          {
            label: 'Total de Órdenes',
            value: `${orders.length}`,
            trend: `${orders.filter(o=>o.status==='pending'||o.status==='preparing').length} activas ahora`,
            type: 'warning',
            icon: <ShoppingCart size={20} className="text-warning" />,
          },
          {
            label: 'Más Vendido',
            value: stats.topProducts[0]?.[0] || '—',
            trend: stats.topProducts[0] ? `${stats.topProducts[0][1]} uds vendidas` : 'Sin datos aún',
            type: 'success',
            icon: <CheckCircle2 size={20} className="text-accent-primary" />,
          },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="enterprise-card p-6 border-t-4 border-t-accent-primary"
          >
            <div className="flex-between mb-4">
              {kpi.icon}
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                kpi.type === 'success' ? 'bg-success/10 text-success' :
                kpi.type === 'warning' ? 'bg-warning/10 text-warning' :
                'bg-accent-secondary/10 text-accent-secondary'
              }`}>{kpi.trend}</span>
            </div>
            <p className="text-xs text-text-tertiary font-bold uppercase tracking-widest mb-2">{kpi.label}</p>
            <h3 className="text-2xl font-black truncate">{kpi.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[380px]">
        {/* Top Products Bar Chart */}
        <div className="enterprise-card flex flex-col">
          <div className="flex-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <BarChart2 size={18} className="text-text-secondary" /> Productos Más Vendidos
            </h3>
          </div>

          {stats.topProducts.length === 0 ? (
            <div className="flex-1 flex-center flex-col text-text-tertiary opacity-40">
              <ShoppingCart size={40} className="mb-3" />
              <p className="text-sm">Procesa pedidos para ver los productos más vendidos.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center space-y-4">
              {stats.topProducts.map(([name, count], i) => (
                <div key={name} className="flex items-center gap-4 group">
                  <span className="text-sm font-bold text-text-tertiary w-4 text-right">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex-between mb-1">
                      <span className="text-sm font-medium truncate">{name}</span>
                      <span className="text-sm font-bold mono-font ml-4">{count} uds</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / stats.maxSold) * 100}%` }}
                        transition={{ delay: 0.2 + i * 0.08, duration: 0.7, ease: 'easeOut' }}
                        className="h-full rounded-full bg-accent-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue by Category Donut */}
        <div className="enterprise-card flex flex-col">
          <div className="flex-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <PieChartIcon size={18} className="text-text-secondary" /> Ingresos por Categoría
            </h3>
          </div>

          {stats.catBreakdown.length === 0 ? (
            <div className="flex-1 flex-center flex-col text-text-tertiary opacity-40">
              <PieChartIcon size={40} className="mb-3" />
              <p className="text-sm">Los datos de categoría aparecerán con ventas completadas.</p>
            </div>
          ) : (
            <div className="flex-1 flex-center flex-col relative">
              {/* CSS Donut */}
              <div
                className="w-44 h-44 rounded-full relative flex-center"
                style={{
                  background: `conic-gradient(${
                    stats.catBreakdown.reduce((acc, cat, i) => {
                      const color = [
                        'var(--accent-primary)',
                        'var(--accent-secondary)',
                        '#f59e0b',
                        '#10b981',
                        '#ef4444',
                      ][i % 5];
                      const prev = acc.pct;
                      acc.pct += cat.pct;
                      acc.str += `${color} ${prev}% ${acc.pct}%, `;
                      return acc;
                    }, { pct: 0, str: '' }).str.slice(0, -2)
                  })`
                }}
              >
                <div className="w-28 h-28 bg-bg-base rounded-full flex-center flex-col">
                  <span className="text-lg font-black mono-font">{formatCurrency(stats.totalRevenue)}</span>
                  <span className="text-[10px] text-text-tertiary">Total</span>
                </div>
              </div>

              <div className="w-full mt-6 grid grid-cols-2 gap-3 px-4">
                {stats.catBreakdown.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${CAT_COLORS[i % CAT_COLORS.length]}`} />
                    <span className="text-sm font-medium flex-1 truncate capitalize">{cat.name}</span>
                    <span className="text-sm font-bold mono-font text-text-tertiary">{cat.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsModule;
