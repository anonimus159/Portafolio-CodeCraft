import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat, Plus, X, Search, Package, Utensils, Trash2, Edit, Check, BookOpen
} from 'lucide-react';
import api from '../utils/api';
import { useToast }   from '../context/ToastContext';
import { useConfirm } from '../components/ui/ConfirmDialog';
import { Spinner } from '../components/ui/SkeletonLoader';

const DARK_CARD       = 'bg-[#111827]/80 backdrop-blur-md border border-white/5 rounded-2xl';
const DARK_INPUT      = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-orange-500/50 transition-all';
const DARK_BTN_PRIMARY= 'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-sm font-semibold transition-all shadow-lg shadow-orange-500/20';
const DARK_BTN_GHOST  = 'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all';

export default function Recetas() {
  const toast   = useToast();
  const confirm = useConfirm();

  const [recetas,           setRecetas]           = useState([]);
  const [productos,         setProductos]         = useState([]);
  const [inventario,        setInventario]        = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [showModal,         setShowModal]         = useState(false);
  const [recetaSeleccionada,setRecetaSeleccionada]= useState(null);
  const [searchTerm,        setSearchTerm]        = useState('');
  const [filtroSinReceta,   setFiltroSinReceta]   = useState(false);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [recetasRes, productosRes, inventarioRes] = await Promise.all([
        api.get('/recetas'), api.get('/productos'), api.get('/inventario'),
      ]);
      setRecetas(recetasRes.data.data);
      setProductos(productosRes.data.data);
      setInventario(inventarioRes.data.data.filter(i => i.activo !== false));
    } catch { toast.error('Error', 'No se pudieron cargar los datos'); }
    finally { setLoading(false); }
  };

  useEffect(() => { cargarDatos(); }, []);

  const crearReceta = async (productoId) => {
    try {
      const recetaExistente = recetas.find(r => r.producto_id === productoId);
      if (recetaExistente) { setRecetaSeleccionada(recetaExistente); setShowModal(true); return; }
      const res = await api.post('/recetas', { producto_id: productoId });
      const nuevaReceta = { id: res.data.data.id, producto_id: productoId, ingredientes: [] };
      setRecetaSeleccionada(nuevaReceta); setRecetas([...recetas, nuevaReceta]); setShowModal(true);
      toast.success('Receta creada', 'Ahora puedes agregar ingredientes');
    } catch (e) { toast.error('Error', e.response?.data?.message || e.message); }
  };

  const agregarIngrediente = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      await api.post('/recetas/ingrediente', {
        receta_id: recetaSeleccionada.id,
        ingrediente_id: parseInt(data.ingrediente_id),
        cantidad: parseFloat(data.cantidad),
      });
      const res = await api.get(`/recetas/${recetaSeleccionada.id}`);
      const actualizada = res.data.data;
      setRecetaSeleccionada(actualizada);
      setRecetas(recetas.map(r => r.id === actualizada.id ? actualizada : r));
      e.target.reset();
      toast.success('Ingrediente agregado', 'La receta fue actualizada');
    } catch (e) { toast.error('Error', e.response?.data?.message || e.message); }
  };

  const eliminarIngrediente = async (ingredienteId, nombre) => {
    const ok = await confirm({
      title:        'Eliminar ingrediente',
      message:      `¿Deseas quitar "${nombre}" de la receta?`,
      confirmLabel: 'Eliminar',
      type:         'danger',
    });
    if (!ok) return;
    try {
      await api.delete(`/recetas/ingrediente/${ingredienteId}`);
      const res = await api.get(`/recetas/${recetaSeleccionada.id}`);
      const actualizada = res.data.data;
      setRecetaSeleccionada(actualizada);
      setRecetas(recetas.map(r => r.id === actualizada.id ? actualizada : r));
      toast.warning('Eliminado', `${nombre} fue eliminado de la receta`);
    } catch (e) { toast.error('Error', e.response?.data?.message || e.message); }
  };

  const productosFiltrados = productos.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const tieneReceta   = recetas.some(r => r.producto_id === p.id);
    return matchesSearch && (filtroSinReceta ? !tieneReceta : true);
  });

  const getRecetaByProducto = (productoId) => recetas.find(r => r.producto_id === productoId);
  const calcularCosto = (ingredientes) => {
    if (!ingredientes) return 0;
    return ingredientes.reduce((total, ing) => {
      const item = inventario.find(i => i.id === ing.ingrediente_id);
      return total + (item?.precio_unitario || 0) * ing.cantidad;
    }, 0);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Recetas 📖</h2>
            <p className="text-gray-500 text-xs mt-0.5">Asocia ingredientes a tus productos</p>
          </div>
        </div>
        <label className="flex items-center gap-2.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/8 transition-all">
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${filtroSinReceta ? 'bg-orange-600 border-orange-600' : 'border-gray-600'}`}>
            {filtroSinReceta && <Check className="w-3 h-3 text-white" />}
          </div>
          <input type="checkbox" checked={filtroSinReceta} onChange={e => setFiltroSinReceta(e.target.checked)} className="sr-only" />
          <span className="text-gray-400 text-sm">Solo sin receta</span>
        </label>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 lg:gap-6 mb-8">
        {[
          { label: 'Total Productos', value: productos.length,                color: 'text-orange-400', bg: 'bg-orange-500/10',  delay: 0    },
          { label: 'Con Receta',      value: recetas.length,                  color: 'text-emerald-400',bg: 'bg-emerald-500/10', delay: 0.08 },
          { label: 'Sin Receta',      value: productos.length - recetas.length, color: 'text-amber-400', bg: 'bg-amber-500/10',   delay: 0.16 },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s.delay }}
            className={`${DARK_CARD} p-5 flex items-center justify-between`}>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${s.bg}`}><ChefHat className={`w-5 h-5 ${s.color}`} /></div>
          </motion.div>
        ))}
      </div>

      {/* Búsqueda */}
      <div className={`${DARK_CARD} p-4 mb-6 relative`}>
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input type="text" placeholder="Buscar productos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          className={`${DARK_INPUT} pl-9`} />
      </div>

      {/* Grid Productos */}
      {loading ? <Spinner label="Cargando recetas..." /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {productosFiltrados.map((producto, index) => {
            const receta       = getRecetaByProducto(producto.id);
            const tieneReceta  = !!receta;
            const numIngredientes = receta?.ingredientes?.length || 0;
            const costoReceta  = receta ? calcularCosto(receta.ingredientes) : 0;
            return (
              <motion.div key={producto.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
                className={`${DARK_CARD} p-5 hover:border-white/10 transition-all duration-200 hover:shadow-lg`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tieneReceta ? 'bg-emerald-500/15' : 'bg-amber-500/15'}`}>
                      {tieneReceta ? <Check className="w-5 h-5 text-emerald-400" /> : <ChefHat className="w-5 h-5 text-amber-400" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{producto.nombre}</h3>
                      <p className="text-gray-600 text-xs mt-0.5">{producto.categoria}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${tieneReceta ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30' : 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30'}`}>
                    {tieneReceta ? 'Con receta' : 'Sin receta'}
                  </span>
                </div>

                {producto.imagen && (
                  <img src={producto.imagen} alt={producto.nombre} className="w-full h-28 object-cover rounded-xl mb-4" />
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Utensils className="w-3.5 h-3.5" />{producto.tipo}</span>
                  <span className="font-black text-orange-400 text-base">${producto.precio?.toFixed(2) || '0.00'}</span>
                </div>

                {tieneReceta && (
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl mb-4 flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{numIngredientes} ingrediente{numIngredientes !== 1 ? 's' : ''}</span>
                    <span className="text-emerald-400 text-xs font-bold">Costo: ${costoReceta.toFixed(2)}</span>
                  </div>
                )}

                <button onClick={() => crearReceta(producto.id)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    tieneReceta
                      ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                      : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white shadow-lg shadow-orange-500/20'
                  }`}>
                  {tieneReceta ? <><Edit className="w-4 h-4" /> Editar Receta</> : <><Plus className="w-4 h-4" /> Crear Receta</>}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal Receta */}
      <AnimatePresence>
        {showModal && recetaSeleccionada && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/15 rounded-xl"><ChefHat className="w-5 h-5 text-orange-400" /></div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {productos.find(p => p.id === recetaSeleccionada.producto_id)?.nombre || 'Producto'}
                    </h3>
                    <p className="text-gray-500 text-xs mt-0.5">{recetaSeleccionada.ingredientes?.length || 0} ingredientes</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/5 rounded-xl transition-colors"><X className="w-4 h-4 text-gray-400" /></button>
              </div>

              <div className="p-6">
                {/* Lista ingredientes */}
                {recetaSeleccionada.ingredientes && recetaSeleccionada.ingredientes.length > 0 ? (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-4 h-4 text-orange-400" />
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Ingredientes</h4>
                    </div>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {recetaSeleccionada.ingredientes.map((ing, idx) => {
                        const itemInv = inventario.find(i => i.id === ing.ingrediente_id);
                        return (
                          <motion.div key={ing.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                            className="flex items-center justify-between p-3 bg-white/3 border border-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-orange-500/15 rounded-lg flex items-center justify-center text-orange-400 text-xs font-bold">{idx + 1}</div>
                              <div>
                                <div className="text-white text-sm font-medium">{ing.ingrediente_nombre}</div>
                                <div className="text-gray-600 text-xs">Stock: {itemInv?.cantidad || 0} {itemInv?.unidad}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-orange-400 font-bold text-sm">{ing.cantidad} {ing.unidad}</div>
                                <div className="text-gray-600 text-xs">Costo: ${((itemInv?.precio_unitario || 0) * ing.cantidad).toFixed(2)}</div>
                              </div>
                              <button onClick={() => eliminarIngrediente(ing.id, ing.ingrediente_nombre)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors">
                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                    <div className="mt-4 p-3 bg-orange-500/5 border border-orange-500/15 rounded-xl flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Costo total de receta</span>
                      <span className="text-orange-400 font-black text-xl">${calcularCosto(recetaSeleccionada.ingredientes).toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 mb-6">
                    <Package className="w-10 h-10 mx-auto mb-3 text-gray-700" />
                    <p className="text-gray-500 text-sm">Sin ingredientes. Agrega los ingredientes de la receta.</p>
                  </div>
                )}

                {/* Form agregar ingrediente */}
                <form onSubmit={agregarIngrediente} className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Agregar Ingrediente</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <select name="ingrediente_id" required className={`${DARK_INPUT} bg-white/5`}>
                      <option value="">Seleccionar...</option>
                      {inventario.filter(i => i.activo !== false).map(item => (
                        <option key={item.id} value={item.id}>{item.nombre} ({item.unidad})</option>
                      ))}
                    </select>
                    <input name="cantidad" type="number" step="0.01" min="0.01" placeholder="Cantidad" required className={DARK_INPUT} />
                  </div>
                  <button type="submit" className={`${DARK_BTN_PRIMARY} w-full`}>
                    <Plus className="w-4 h-4" /> Agregar Ingrediente
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
