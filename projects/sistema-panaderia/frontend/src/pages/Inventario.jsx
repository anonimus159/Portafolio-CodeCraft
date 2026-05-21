import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, AlertTriangle, Plus, Edit, Trash2, X,
  Search, Filter, TrendingUp, TrendingDown, PackageCheck
} from 'lucide-react';
import api from '../utils/api';
import { useToast }   from '../context/ToastContext';
import { useConfirm } from '../components/ui/ConfirmDialog';
import { Spinner, SkeletonStats } from '../components/ui/SkeletonLoader';

const DARK_CARD       = 'bg-[#111827]/80 backdrop-blur-md border border-white/5 rounded-2xl';
const DARK_INPUT      = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-orange-500/50 transition-all';
const DARK_BTN_PRIMARY= 'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-sm font-semibold transition-all shadow-lg shadow-orange-500/20';
const DARK_BTN_GHOST  = 'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all';

export default function Inventario() {
  const toast   = useToast();
  const confirm = useConfirm();

  const [items,         setItems]         = useState([]);
  const [alertas,       setAlertas]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [showModal,     setShowModal]     = useState(false);
  const [editItem,      setEditItem]      = useState(null);
  const [searchTerm,    setSearchTerm]    = useState('');
  const [filterType,    setFilterType]    = useState('todos');
  const [showMovimiento,setShowMovimiento]= useState(false);
  const [selectedItem,  setSelectedItem]  = useState(null);
  const [tipoMovimiento,setTipoMovimiento]= useState('entrada');

  const cargarInventario = async () => {
    try {
      setLoading(true);
      const [res, alertasRes] = await Promise.all([
        api.get('/inventario'),
        api.get('/inventario/alertas'),
      ]);
      setItems(res.data.data);
      setAlertas(alertasRes.data.data);
    } catch { toast.error('Error', 'No se pudo cargar el inventario'); }
    finally { setLoading(false); }
  };

  useEffect(() => { cargarInventario(); }, []);

  const guardarItem = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      if (editItem) {
        await api.put(`/inventario/${editItem.id}`, data);
        toast.success('Actualizado', `${data.nombre} ha sido actualizado`);
      } else {
        await api.post('/inventario', data);
        toast.success('Creado', `${data.nombre} agregado al inventario`);
      }
      setShowModal(false); setEditItem(null); cargarInventario();
    } catch (e) { toast.error('Error al guardar', e.response?.data?.message || e.message); }
  };

  const eliminarItem = async (id, nombre) => {
    const ok = await confirm({
      title:        'Eliminar item',
      message:      `¿Deseas eliminar "${nombre}" del inventario?`,
      confirmLabel: 'Eliminar',
      type:         'danger',
    });
    if (!ok) return;
    try {
      await api.delete(`/inventario/${id}`);
      toast.warning('Eliminado', `${nombre} fue eliminado del inventario`);
      cargarInventario();
    } catch (e) { toast.error('Error', e.response?.data?.message || e.message); }
  };

  const handleMovimiento = async (e) => {
    e.preventDefault();
    const cantidad = parseFloat(new FormData(e.target).get('cantidad'));
    const desc     = new FormData(e.target).get('descripcion');
    try {
      const item       = await api.get(`/inventario/${selectedItem.id}`);
      const nuevaCantidad = tipoMovimiento === 'entrada'
        ? item.data.data.cantidad + cantidad
        : item.data.data.cantidad - cantidad;
      await api.put(`/inventario/${selectedItem.id}/cantidad`, {
        cantidad: nuevaCantidad, tipo: tipoMovimiento, descripcion: desc,
      });
      const label = tipoMovimiento === 'entrada' ? 'Entrada registrada' : 'Salida registrada';
      toast.success(label, `${cantidad} ${selectedItem.unidad} de ${selectedItem.nombre}`);
      setShowMovimiento(false); setSelectedItem(null); cargarInventario();
    } catch (e) { toast.error('Error', e.response?.data?.message || e.message); }
  };

  const getStockStatus = (item) => {
    if (item.cantidad <= item.stock_minimo)         return { status: 'crítico',     color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30',     badge: 'bg-red-500/15 text-red-300 ring-1 ring-red-500/30',     icon: AlertTriangle };
    if (item.cantidad <= item.stock_minimo * 1.5)   return { status: 'advertencia', color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   badge: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30', icon: AlertTriangle };
    return { status: 'normal', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', badge: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30', icon: PackageCheck };
  };

  const getProgressColor = (item) => {
    const pct = (item.cantidad / item.stock_minimo) * 100;
    if (pct <= 50) return 'bg-red-500'; if (pct <= 100) return 'bg-amber-500'; return 'bg-emerald-500';
  };

  const filteredItems = items.filter(item => {
    const matchesSearch  = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter  = filterType === 'todos'
      || (filterType === 'alertas' && item.cantidad <= item.stock_minimo * 1.5)
      || (filterType === 'normal'  && item.cantidad >  item.stock_minimo * 1.5);
    return matchesSearch && matchesFilter;
  });

  const totalItems       = items.length;
  const itemsEnAlerta    = items.filter(i => i.cantidad <= i.stock_minimo).length;
  const itemsEnAdvertencia = items.filter(i => i.cantidad > i.stock_minimo && i.cantidad <= i.stock_minimo * 1.5).length;
  const valorTotal       = items.reduce((s, item) => s + item.cantidad * item.precio_unitario, 0);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Inventario 📦</h2>
            <p className="text-gray-500 text-xs mt-0.5">Gestión de insumos y materias primas</p>
          </div>
        </div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className={DARK_BTN_PRIMARY}>
          <Plus className="w-4 h-4" /> Agregar Item
        </button>
      </div>

      {/* Stats */}
      {loading ? <SkeletonStats count={4} /> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-8">
          {[
            { label: 'Total Items',    value: totalItems,              icon: Package,       color: 'text-orange-400', bg: 'bg-orange-500/10',  delay: 0    },
            { label: 'Stock Crítico',  value: itemsEnAlerta,           icon: AlertTriangle, color: 'text-red-400',    bg: 'bg-red-500/10',     delay: 0.08 },
            { label: 'En Advertencia', value: itemsEnAdvertencia,      icon: AlertTriangle, color: 'text-amber-400',  bg: 'bg-amber-500/10',   delay: 0.16 },
            { label: 'Valor Total',    value: `$${valorTotal.toFixed(0)}`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', delay: 0.24 },
          ].map(s => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s.delay }}
                className={`${DARK_CARD} p-5 flex items-center justify-between`}>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{s.label}</p>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${s.bg}`}><Icon className={`w-5 h-5 ${s.color}`} /></div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Alertas */}
      <AnimatePresence>
        {alertas.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`${DARK_CARD} mb-6 border-l-4 border-l-red-500 p-5`}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="font-bold text-red-300 text-sm">Alertas de Stock Bajo ({alertas.length})</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {alertas.map(item => {
                const s = getStockStatus(item); const Icon = s.icon;
                return (
                  <div key={item.id} className={`p-3 rounded-xl border ${s.border} ${s.bg}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-4 h-4 ${s.color}`} />
                      <span className={`font-medium text-sm ${s.color}`}>{item.nombre}</span>
                    </div>
                    <div className="text-gray-500 text-xs mb-2">Stock: {item.cantidad} / Mín: {item.stock_minimo} {item.unidad}</div>
                    <div className="w-full bg-white/5 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${getProgressColor(item)} transition-all`}
                        style={{ width: `${Math.min(100, (item.cantidad / item.stock_minimo) * 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtros */}
      <div className={`${DARK_CARD} p-5 mb-6 flex flex-wrap gap-4 items-center`}>
        <div className="flex-1 min-w-52 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`${DARK_INPUT} pl-9`} />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-gray-400 text-sm focus:outline-none focus:border-orange-500/50 w-44">
            <option value="todos">Todos</option>
            <option value="alertas">En Alerta</option>
            <option value="normal">Stock Normal</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      {loading ? <Spinner label="Cargando inventario..." /> : (
        <div className={`${DARK_CARD} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Nombre','Unidad','Stock','Mín.','Precio','Estado','Acciones'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-gray-500 text-xs uppercase tracking-wider font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3">
                {filteredItems.map(item => {
                  const s = getStockStatus(item); const Icon = s.icon;
                  const pct = Math.min(100, (item.cantidad / Math.max(item.stock_minimo, 1)) * 100);
                  return (
                    <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4 font-semibold text-white">{item.nombre}</td>
                      <td className="px-5 py-4 text-gray-500">{item.unidad}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`font-bold ${s.color}`}>{item.cantidad}</span>
                          <div className="w-16 h-1 bg-white/5 rounded-full">
                            <div className={`h-1 rounded-full ${getProgressColor(item)} transition-all`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{item.stock_minimo}</td>
                      <td className="px-5 py-4 text-gray-400">${item.precio_unitario.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${s.badge}`}>
                          <Icon className="w-3 h-3" />{s.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-emerald-500/10 rounded-lg transition-colors"
                            onClick={() => { setSelectedItem(item); setTipoMovimiento('entrada'); setShowMovimiento(true); }} title="Entrada">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                          </button>
                          <button className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                            onClick={() => { setSelectedItem(item); setTipoMovimiento('salida'); setShowMovimiento(true); }} title="Salida">
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          </button>
                          <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => { setEditItem(item); setShowModal(true); }}>
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                            onClick={() => eliminarItem(item.id, item.nombre)}>
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-10 h-10 mx-auto mb-3 text-gray-700" />
              <p className="text-gray-500 text-sm">No se encontraron items</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Nuevo/Editar */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <h3 className="text-base font-bold text-white">{editItem ? 'Editar Item' : 'Nuevo Item'}</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/5 rounded-xl transition-colors"><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <form onSubmit={guardarItem} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Nombre</label>
                  <input name="nombre" defaultValue={editItem?.nombre} required placeholder="Ej: Harina de trigo" className={DARK_INPUT} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Unidad</label>
                    <input name="unidad" defaultValue={editItem?.unidad} required placeholder="kg, lt, unidad" className={DARK_INPUT} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Cantidad Actual</label>
                    <input name="cantidad" type="number" step="0.01" defaultValue={editItem?.cantidad || 0} required className={DARK_INPUT} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Stock Mínimo</label>
                    <input name="stock_minimo" type="number" step="0.01" defaultValue={editItem?.stock_minimo || 0} required className={DARK_INPUT} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Precio Unitario</label>
                    <input name="precio_unitario" type="number" step="0.01" defaultValue={editItem?.precio_unitario || 0} required className={DARK_INPUT} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className={`${DARK_BTN_GHOST} flex-1`}>Cancelar</button>
                  <button type="submit" className={`${DARK_BTN_PRIMARY} flex-1`}>Guardar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Movimiento */}
      <AnimatePresence>
        {showMovimiento && selectedItem && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowMovimiento(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#111827] border border-white/10 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <h3 className="text-base font-bold text-white">
                  {tipoMovimiento === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida'}
                </h3>
                <button onClick={() => setShowMovimiento(false)} className="p-1.5 hover:bg-white/5 rounded-xl transition-colors"><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <form onSubmit={handleMovimiento} className="p-6 space-y-4">
                <div className="p-3 bg-white/3 border border-white/5 rounded-xl">
                  <div className="font-semibold text-white text-sm">{selectedItem.nombre}</div>
                  <div className="text-gray-500 text-xs mt-0.5">Stock actual: {selectedItem.cantidad} {selectedItem.unidad}</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Cantidad</label>
                  <input name="cantidad" type="number" step="0.01" min="0.01" required placeholder="0.00" className={DARK_INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Descripción / Motivo</label>
                  <textarea name="descripcion" rows="3" placeholder="Ej: Compra a proveedor..." required className={`${DARK_INPUT} resize-none`} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowMovimiento(false)} className={`${DARK_BTN_GHOST} flex-1`}>Cancelar</button>
                  <button type="submit" className={`flex items-center justify-center flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    tipoMovimiento === 'entrada'
                      ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
                      : 'bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30'
                  }`}>
                    {tipoMovimiento === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
