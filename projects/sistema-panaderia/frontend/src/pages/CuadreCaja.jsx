import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, DollarSign, TrendingUp, TrendingDown, X,
  Trash2, CheckCircle, AlertCircle, Wallet, CreditCard, Building, FileText
} from 'lucide-react';
import api from '../utils/api';
import { useAuth }    from '../context/AuthContext';
import { useToast }   from '../context/ToastContext';
import { useConfirm } from '../components/ui/ConfirmDialog';
import { Spinner } from '../components/ui/SkeletonLoader';

const DARK_CARD       = 'bg-[#111827]/80 backdrop-blur-md border border-white/5 rounded-2xl';
const DARK_INPUT      = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-orange-500/50 transition-all';
const DARK_BTN_PRIMARY= 'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-sm font-semibold transition-all shadow-lg shadow-orange-500/20';
const DARK_BTN_GHOST  = 'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all';

export default function CuadreCaja() {
  const { user }  = useAuth();
  const toast     = useToast();
  const confirm   = useConfirm();

  const [cuadre,        setCuadre]        = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [showCerrar,    setShowCerrar]    = useState(false);
  const [dineroSistema, setDineroSistema] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [tipoIngreso,   setTipoIngreso]   = useState('ventas');

  const cargarCuadre = async () => {
    try {
      const res = await api.get(`/cuadre/activo/${user?.id}`);
      setCuadre(res.data.data);
    } catch { /* cuadre no existe */ }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user?.id) cargarCuadre(); }, [user?.id]);

  const agregarIngreso = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      await api.post(`/cuadre/${cuadre.id}/ingreso`, {
        descripcion: data.descripcion,
        monto: parseFloat(data.monto),
        metodo_pago: data.metodo_pago,
        referencia: data.referencia,
        tipo: tipoIngreso,
      });
      e.target.reset();
      cargarCuadre();
      toast.success('Ingreso registrado', `$${parseFloat(data.monto).toFixed(2)} añadido`);
    } catch (e) { toast.error('Error', e.response?.data?.message || e.message); }
  };

  const agregarGasto = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      await api.post(`/cuadre/${cuadre.id}/gasto`, {
        descripcion: data.descripcion,
        monto: parseFloat(data.monto),
        metodo_pago: data.metodo_pago,
        referencia: data.referencia,
      });
      e.target.reset();
      cargarCuadre();
      toast.warning('Gasto registrado', `$${parseFloat(data.monto).toFixed(2)} deducido`);
    } catch (e) { toast.error('Error', e.response?.data?.message || e.message); }
  };

  const eliminarMovimiento = async (id, descripcion) => {
    const ok = await confirm({
      title:        'Eliminar movimiento',
      message:      `¿Deseas eliminar "${descripcion}"?`,
      confirmLabel: 'Eliminar',
      type:         'danger',
    });
    if (!ok) return;
    try {
      await api.delete(`/cuadre/movimiento/${id}`);
      cargarCuadre();
      toast.warning('Movimiento eliminado', descripcion);
    } catch (e) { toast.error('Error', e.response?.data?.message || e.message); }
  };

  const cerrarCuadre = async () => {
    try {
      await api.post(`/cuadre/${cuadre.id}/cerrar`, {
        dinero_sistema: parseFloat(dineroSistema),
        observaciones,
      });
      toast.success('Cuadre cerrado', 'El cuadre de caja fue cerrado exitosamente');
      setShowCerrar(false);
      cargarCuadre();
    } catch (e) { toast.error('Error al cerrar', e.response?.data?.message || e.message); }
  };

  const getIngresoIcon  = (tipo) => {
    switch (tipo) {
      case 'ventas': return <DollarSign className="w-4 h-4" />;
      case 'banco':  return <Building className="w-4 h-4" />;
      case 'tarjeta':return <CreditCard className="w-4 h-4" />;
      default:       return <Wallet className="w-4 h-4" />;
    }
  };
  const getIngresoColor = (tipo) => {
    switch (tipo) {
      case 'ventas': return 'bg-emerald-500/15 text-emerald-400';
      case 'banco':  return 'bg-orange-500/15 text-orange-400';
      case 'tarjeta':return 'bg-purple-500/15 text-purple-400';
      default:       return 'bg-gray-500/15 text-gray-400';
    }
  };

  if (loading) return <Spinner label="Cargando cuadre..." />;

  if (!cuadre) return (
    <div className={`${DARK_CARD} p-16 text-center`}>
      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-400" />
      <h3 className="text-xl font-bold text-white mb-2">No hay cuadre activo</h3>
      <p className="text-gray-500 text-sm">Inicia un nuevo cuadre de caja para comenzar</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Cuadre de Caja 📊</h2>
            <p className="text-gray-500 text-xs mt-0.5">{cuadre.fecha} — {user?.nombre}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            cuadre.status === 'abierto' ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30' : 'bg-gray-500/15 text-gray-300 ring-1 ring-gray-500/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cuadre.status === 'abierto' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
            {cuadre.status === 'abierto' ? 'Abierto' : 'Cerrado'}
          </span>
          {cuadre.status === 'abierto' && (
            <button onClick={() => setShowCerrar(true)} className={DARK_BTN_PRIMARY}>
              <CheckCircle className="w-4 h-4" /> Cerrar Cuadre
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 lg:gap-6 mb-8">
        {[
          { label: 'Total Ingresos', value: `$${(cuadre.total_ingresos || 0).toFixed(2)}`, icon: TrendingUp,   color: 'text-emerald-400', bg: 'bg-emerald-500/10', delay: 0    },
          { label: 'Total Gastos',   value: `$${(cuadre.total_gastos || 0).toFixed(2)}`,   icon: TrendingDown, color: 'text-red-400',     bg: 'bg-red-500/10',     delay: 0.08 },
          { label: 'Resultado',      value: `$${(cuadre.resultado || 0).toFixed(2)}`,       icon: DollarSign,   color: 'text-orange-400',  bg: 'bg-orange-500/10',  delay: 0.16 },
        ].map(s => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s.delay }}
              className={`${DARK_CARD} p-5 flex items-center justify-between`}>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${s.bg}`}><Icon className={`w-5 h-5 ${s.color}`} /></div>
            </motion.div>
          );
        })}
      </div>

      {cuadre.status === 'abierto' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ingresos */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={DARK_CARD}>
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Ingresos
              </h3>
              <span className="text-emerald-400 font-bold text-sm">+${(cuadre.total_ingresos || 0).toFixed(2)}</span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { id: 'ventas', label: 'Ventas', icon: DollarSign },
                  { id: 'banco',  label: 'Banco',  icon: Building },
                  { id: 'tarjeta',label: 'Tarjeta',icon: CreditCard },
                  { id: 'otro',   label: 'Otro',   icon: Wallet },
                ].map(t => {
                  const Icon = t.icon;
                  return (
                    <button key={t.id} onClick={() => setTipoIngreso(t.id)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        tipoIngreso === t.id ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' : 'border-white/5 bg-white/3 text-gray-600 hover:bg-white/5 hover:text-gray-400'
                      }`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] font-semibold">{t.label}</span>
                    </button>
                  );
                })}
              </div>
              <form onSubmit={agregarIngreso} className="mb-5 p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input name="descripcion" placeholder="Descripción" required className={DARK_INPUT} />
                  <input name="monto" type="number" step="0.01" placeholder="Monto" required className={DARK_INPUT} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select name="metodo_pago" className={`${DARK_INPUT} bg-white/5`}>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="banco">Banco</option>
                  </select>
                  <input name="referencia" placeholder="Referencia (opcional)" className={DARK_INPUT} />
                </div>
                <button type="submit" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-sm font-semibold border border-emerald-500/30 transition-all">
                  <Plus className="w-4 h-4" /> Agregar Ingreso
                </button>
              </form>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                <AnimatePresence>
                  {cuadre.ingresos?.map(ing => (
                    <motion.div key={ing.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-3 bg-white/3 border border-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getIngresoColor(ing.tipo || 'ventas')}`}>{getIngresoIcon(ing.tipo || 'ventas')}</div>
                        <div>
                          <div className="text-white text-sm font-medium">{ing.descripcion}</div>
                          <div className="text-gray-600 text-xs">{ing.metodo_pago}{ing.referencia && ` • ${ing.referencia}`}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-bold text-sm">+${ing.monto.toFixed(2)}</span>
                        <button onClick={() => eliminarMovimiento(ing.id, ing.descripcion)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {(!cuadre.ingresos || cuadre.ingresos.length === 0) && (
                  <p className="text-center text-gray-600 py-8 text-sm">Sin ingresos registrados</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Gastos */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={DARK_CARD}>
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <TrendingDown className="w-4 h-4 text-red-400" /> Gastos
              </h3>
              <span className="text-red-400 font-bold text-sm">-${(cuadre.total_gastos || 0).toFixed(2)}</span>
            </div>
            <div className="p-5">
              <form onSubmit={agregarGasto} className="mb-5 p-4 bg-red-500/5 border border-red-500/15 rounded-xl space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input name="descripcion" placeholder="Descripción" required className={DARK_INPUT} />
                  <input name="monto" type="number" step="0.01" placeholder="Monto" required className={DARK_INPUT} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select name="metodo_pago" className={`${DARK_INPUT} bg-white/5`}>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="banco">Banco</option>
                  </select>
                  <input name="referencia" placeholder="N° comprobante" className={DARK_INPUT} />
                </div>
                <button type="submit" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 text-sm font-semibold border border-red-500/30 transition-all">
                  <Plus className="w-4 h-4" /> Agregar Gasto
                </button>
              </form>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                <AnimatePresence>
                  {cuadre.gastos?.map(gas => (
                    <motion.div key={gas.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="flex items-center justify-between p-3 bg-white/3 border border-white/5 rounded-xl">
                      <div>
                        <div className="text-white text-sm font-medium">{gas.descripcion}</div>
                        <div className="text-gray-600 text-xs">{gas.metodo_pago}{gas.referencia && ` • ${gas.referencia}`}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-red-400 font-bold text-sm">-${gas.monto.toFixed(2)}</span>
                        <button onClick={() => eliminarMovimiento(gas.id, gas.descripcion)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {(!cuadre.gastos || cuadre.gastos.length === 0) && (
                  <p className="text-center text-gray-600 py-8 text-sm">Sin gastos registrados</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`${DARK_CARD} p-16 text-center`}>
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Cuadre Cerrado</h3>
          <p className="text-gray-500 text-sm mb-5">
            Cerrado el {new Date(cuadre.fecha).toLocaleDateString()} a las {cuadre.hora_cierre}
          </p>
          {cuadre.diferencia !== 0 && (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-4 ${
              cuadre.diferencia > 0 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'
            }`}>
              {cuadre.diferencia > 0 ? <TrendingUp className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span className="font-bold">Diferencia: ${cuadre.diferencia.toFixed(2)}</span>
            </div>
          )}
          {cuadre.observaciones && (
            <div className="mt-4 p-4 bg-white/3 border border-white/5 rounded-xl max-w-sm mx-auto text-left">
              <div className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4 text-gray-500" /><span className="text-gray-500 text-xs">Observaciones</span></div>
              <p className="text-gray-400 text-sm">{cuadre.observaciones}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Modal Cerrar Cuadre */}
      <AnimatePresence>
        {showCerrar && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCerrar(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#111827] border border-white/10 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <h3 className="text-base font-bold text-white">Cerrar Cuadre de Caja</h3>
                <button onClick={() => setShowCerrar(false)} className="p-1.5 hover:bg-white/5 rounded-xl transition-colors"><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="p-6">
                <div className="text-center mb-5 p-4 bg-orange-500/5 border border-orange-500/15 rounded-xl">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Resultado del cuadre</div>
                  <div className="text-4xl font-black text-orange-400">${(cuadre.resultado || 0).toFixed(2)}</div>
                </div>
                <form onSubmit={e => { e.preventDefault(); cerrarCuadre(); }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Dinero en Caja / Sistema</label>
                    <input type="number" step="0.01" value={dineroSistema} onChange={e => setDineroSistema(e.target.value)}
                      placeholder="Cantidad física en caja" required className={DARK_INPUT} />
                  </div>
                  {dineroSistema && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        parseFloat(dineroSistema) >= cuadre.resultado ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'
                      }`}>
                      <span className="text-gray-400 text-sm">Diferencia</span>
                      <span className={`text-xl font-black ${parseFloat(dineroSistema) >= cuadre.resultado ? 'text-emerald-400' : 'text-amber-400'}`}>
                        ${(parseFloat(dineroSistema) - cuadre.resultado).toFixed(2)}
                      </span>
                    </motion.div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Observaciones (opcional)</label>
                    <textarea value={observaciones} onChange={e => setObservaciones(e.target.value)}
                      placeholder="Notas adicionales..." rows="3" className={`${DARK_INPUT} resize-none`} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowCerrar(false)} className={`${DARK_BTN_GHOST} flex-1`}>Cancelar</button>
                    <button type="submit" className={`${DARK_BTN_PRIMARY} flex-1`}><CheckCircle className="w-4 h-4" /> Confirmar</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
