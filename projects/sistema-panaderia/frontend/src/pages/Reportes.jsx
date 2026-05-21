import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, DollarSign, ShoppingCart, Package,
  AlertTriangle, CheckCircle, Calendar, FileBarChart
} from 'lucide-react';
import api from '../utils/api';

const CHART_COLORS = ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ef4444', '#06b6d4', '#eab308', '#ec4899'];
const CARD_STYLE  = { background:'#111113', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14 };
const TOOLTIP_STYLE = { backgroundColor: '#111113', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fafafa', fontSize: 12, fontFamily: 'Inter, system-ui' };
const DARK_CARD = 'bg-[#111827]/80 backdrop-blur-md border border-white/5 rounded-2xl';

export default function Reportes() {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [reporte, setReporte] = useState(null);
  const [productos, setProductos] = useState([]);
  const [ventasPorUsuario, setVentasPorUsuario] = useState([]);
  const [ventasPorMetodoPago, setVentasPorMetodoPago] = useState([]);
  const [inventario, setInventario] = useState(null);
  const [ventasSemanales, setVentasSemanales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { cargarReportes(); }, [fecha]);

  const cargarReportes = async () => {
    try {
      setLoading(true);
      const ventasRes      = await api.get('/reportes/ventas/diarias',    { params: { fecha } });
      const prodsRes       = await api.get('/reportes/ventas/productos',   { params: { limite: 10 } });
      const usuariosRes    = await api.get('/reportes/ventas/usuarios');
      const metodoPagoRes  = await api.get('/reportes/ventas/metodo-pago');
      const invRes         = await api.get('/reportes/inventario');
      const semanalesRes   = await api.get('/reportes/ventas/semanales');
      setReporte(ventasRes.data.data);
      setProductos(prodsRes.data.data);
      setVentasPorUsuario(usuariosRes.data.data);
      setVentasPorMetodoPago(metodoPagoRes.data.data);
      setInventario(invRes.data.data);
      setVentasSemanales(semanalesRes.data.data);
    } catch (error) { console.error('Error al cargar reportes:', error); }
    finally { setLoading(false); }
  };

  const datosProductos = productos.map(p => ({
    nombre: p.nombre.length > 12 ? p.nombre.substring(0, 12) + '…' : p.nombre,
    cantidad: p.cantidad_vendida, total: p.total_ventas
  }));
  const datosMetodoPago = ventasPorMetodoPago.map(m => ({
    name: m.metodo_pago || 'Sin especificar', value: m.total || 0, transacciones: m.num_ventas || 0
  }));
  const datosSemanales = ventasSemanales.map(d => ({
    fecha: new Date(d.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
    total: d.total, ventas: d.num_ventas
  }));

  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px 0', gap:14 }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'2.5px solid rgba(245,158,11,0.2)', borderTopColor:'#f59e0b', animation:'spin 0.8s linear infinite' }} />
      <p style={{ fontSize:13, color:'#52525b' }}>Cargando reportes...</p>
    </div>
  );

  const ticketPromedio = reporte?.resumen?.num_ventas > 0
    ? (reporte?.resumen?.total / reporte?.resumen?.num_ventas).toFixed(2) : '0.00';

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:'#fafafa', letterSpacing:'-0.02em', marginBottom:3 }}>Reportes 📈</h1>
          <p style={{ fontSize:12, color:'#71717a' }}>Análisis de ventas e inventario</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', background:'var(--bg-raised)', border:'1px solid var(--border-subtle)', borderRadius:10 }}>
          <Calendar style={{ width:14, height:14, color:'#52525b' }} />
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)}
            style={{ background:'transparent', border:'none', color:'#a1a1aa', fontSize:13, outline:'none', cursor:'pointer', fontFamily:'inherit' }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[
          { label:'Ventas del Día',   value:`$${(reporte?.resumen?.total||0).toFixed(2)}`, icon:DollarSign,  color:'#f59e0b', bg:'rgba(245,158,11,0.1)' },
          { label:'Transacciones',    value:reporte?.resumen?.num_ventas||0,                icon:ShoppingCart,color:'#4ade80', bg:'rgba(74,222,128,0.1)' },
          { label:'Ticket Promedio',  value:`$${ticketPromedio}`,                           icon:TrendingUp,  color:'#fbbf24', bg:'rgba(251,191,36,0.1)' },
          { label:'Items Inventario', value:inventario?.total_items||0,                     icon:Package,     color:'#a78bfa', bg:'rgba(167,139,250,0.1)' },
        ].map((s,i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
              className="stat-card" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:'#52525b', marginBottom:6 }}>{s.label}</p>
                <p style={{ fontSize:26, fontWeight:900, color:s.color, margin:0, lineHeight:1 }}>{s.value}</p>
              </div>
              <div style={{ width:38, height:38, borderRadius:12, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon style={{ width:17, height:17, color:s.color }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Gráficas fila 1 */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginBottom:12 }}>
        <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} style={{ ...CARD_STYLE, padding:'20px 22px' }}>
          <h3 style={{ fontSize:11, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:'#52525b', marginBottom:16 }}>Ventas Semana</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={datosSemanales}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="fecha" stroke="#4b5563" fontSize={11} />
              <YAxis stroke="#4b5563" fontSize={11} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Line type="monotone" dataKey="total" stroke="#f97316" strokeWidth={2.5} name="Total ($)" dot={{ r: 4, fill: '#f97316' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="ventas" stroke="#22c55e" strokeWidth={2} name="Transacciones" dot={{ r: 3, fill: '#22c55e' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Productos más vendidos */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className={`${DARK_CARD} p-6`}>
          <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Productos Más Vendidos</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={datosProductos}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="nombre" stroke="#4b5563" fontSize={10} />
              <YAxis stroke="#4b5563" fontSize={11} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Bar dataKey="cantidad" fill="#f97316" name="Cantidad" radius={[4,4,0,0]} />
              <Bar dataKey="total" fill="#3b82f6" name="Total ($)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Gráficas fila 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
        {/* Métodos de Pago */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`${DARK_CARD} p-6`}>
          <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Ingresos por Método de Pago</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={datosMetodoPago} cx="50%" cy="50%" labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={90} dataKey="value">
                {datosMetodoPago.map((_, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-3 justify-center">
            {datosMetodoPago.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                <span className="text-xs text-gray-500">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ventas por Usuario */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className={`${DARK_CARD} p-6`}>
          <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Ventas por Usuario</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-3 text-gray-500 text-xs uppercase tracking-wider">Usuario</th>
                  <th className="text-left py-3 text-gray-500 text-xs uppercase tracking-wider">Trans.</th>
                  <th className="text-left py-3 text-gray-500 text-xs uppercase tracking-wider">Total</th>
                  <th className="text-left py-3 text-gray-500 text-xs uppercase tracking-wider">Promedio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3">
                {ventasPorUsuario.map((u, i) => (
                  <tr key={i} className="hover:bg-white/2 transition-colors">
                    <td className="py-3 font-semibold text-white">{u.nombre}</td>
                    <td className="py-3 text-gray-500">{u.num_ventas}</td>
                    <td className="py-3 text-emerald-400 font-bold">${u.total.toFixed(2)}</td>
                    <td className="py-3 text-gray-500">${u.num_ventas > 0 ? (u.total / u.num_ventas).toFixed(2) : '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Inventario */}
      {inventario && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`${DARK_CARD} p-6 mb-6`}>
          <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Estado del Inventario</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Items',   value: inventario.total_items, icon: Package,       color: 'text-primary-400', border: 'border-primary-500/20 bg-primary-500/5'   },
              { label: 'Stock Crítico', value: inventario.alertas,     icon: AlertTriangle, color: 'text-red-400',     border: 'border-red-500/20 bg-red-500/5'         },
              { label: 'Stock OK',      value: inventario.ok,          icon: CheckCircle,   color: 'text-emerald-400', border: 'border-emerald-500/20 bg-emerald-500/5'  },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className={`p-5 rounded-xl border ${s.border} flex items-center justify-between`}>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">{s.label}</p>
                    <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 opacity-30 ${s.color}`} />
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Tabla Detalle Productos */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`${DARK_CARD} overflow-hidden`}>
        <div className="px-6 py-5 border-b border-white/5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Detalle Productos Más Vendidos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['#', 'Producto', 'Cant. Vendida', 'Total Ventas', '% del Total'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-gray-500 text-xs uppercase tracking-wider font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {productos.map((p, i) => {
                const totalGeneral = productos.reduce((sum, prod) => sum + prod.total_ventas, 0);
                const pct = totalGeneral > 0 ? (p.total_ventas / totalGeneral) * 100 : 0;
                return (
                  <tr key={i} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4">
                      <div className="w-6 h-6 rounded-lg bg-primary-500/15 flex items-center justify-center text-primary-400 text-xs font-bold">{i + 1}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-white">{p.nombre}</td>
                    <td className="px-5 py-4"><span className="px-2.5 py-1 rounded-full text-xs bg-primary-500/15 text-primary-300 font-bold">{p.cantidad_vendida}</span></td>
                    <td className="px-5 py-4 text-emerald-400 font-bold">${p.total_ventas.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-1.5 bg-primary-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-gray-500 text-xs">{pct.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {productos.length === 0 && (
          <div className="text-center py-16">
            <FileBarChart className="w-10 h-10 mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500 text-sm">Sin datos de ventas para esta fecha</p>
          </div>
        )}
      </motion.div>
      {/* Consejo del día */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="mt-8 rounded-2xl overflow-hidden border border-amber-500/10 bg-gradient-to-r from-amber-950/30 via-orange-950/20 to-amber-950/10 relative">
        <div className="px-6 py-5 flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary-500/20">
            <FileBarChart className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <p className="text-xs text-primary-400 font-bold uppercase tracking-widest mb-0.5">Consejo del día</p>
            <p className="text-gray-400 text-sm">Analiza las ventas por día y producto para identificar oportunidades de crecimiento en tu negocio.</p>
          </div>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.06]"><FileBarChart className="w-24 h-24 text-white" /></div>
      </motion.div>
    </div>
  );
}
