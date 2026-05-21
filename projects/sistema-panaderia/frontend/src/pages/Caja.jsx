import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, CreditCard, Banknote, Building,
  CheckCircle, X, DollarSign, Clock, User, Receipt
} from 'lucide-react';
import api from '../utils/api';
import { useAuth }    from '../context/AuthContext';
import { useToast }   from '../context/ToastContext';
import { useConfirm } from '../components/ui/ConfirmDialog';
import { playPaymentSuccess, playError } from '../utils/sounds';
import { Spinner } from '../components/ui/SkeletonLoader';

const DARK_CARD       = 'bg-[#111827]/80 backdrop-blur-md border border-white/5 rounded-2xl';
const DARK_BTN_PRIMARY= 'flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-sm font-semibold transition-all shadow-lg shadow-orange-500/20';
const DARK_BTN_GHOST  = 'flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-all';

export default function Caja() {
  const { user }  = useAuth();
  const toast     = useToast();
  const confirm   = useConfirm();

  const [pedidos,           setPedidos]           = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [showPago,          setShowPago]          = useState(false);
  const [pedidoSeleccionado,setPedidoSeleccionado]= useState(null);
  const [metodoPago,        setMetodoPago]        = useState('efectivo');

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/pedidos/estado/por_pagar');
      setPedidos(res.data.data);
    } catch { toast.error('Error', 'No se pudieron cargar los pedidos'); }
    finally { setLoading(false); }
  };

  useEffect(() => { cargarPedidos(); }, []);

  const facturarPedido = async () => {
    try {
      await api.post(`/pedidos/${pedidoSeleccionado.id}/facturar`, { metodo_pago: metodoPago });
      playPaymentSuccess();
      toast.success('¡Pago registrado!', `Pedido #${pedidoSeleccionado.id} facturado con ${metodoPago}`);
      setShowPago(false); setPedidoSeleccionado(null);
      cargarPedidos();
    } catch (e) {
      playError();
      toast.error('Error al facturar', e.response?.data?.message || e.message);
    }
  };

  const cerrarPedido = async (pedidoId) => {
    const ok = await confirm({
      title:        'Cerrar pedido',
      message:      `¿Confirmas el cierre del pedido #${pedidoId}?`,
      confirmLabel: 'Cerrar pedido',
      cancelLabel:  'Cancelar',
      type:         'warning',
    });
    if (!ok) return;
    try {
      await api.post(`/pedidos/${pedidoId}/cerrar`);
      toast.success('Pedido cerrado', `El pedido #${pedidoId} fue cerrado`);
      cargarPedidos();
    } catch (e) {
      toast.error('Error', e.response?.data?.message || e.message);
    }
  };

  const totalPendiente = pedidos.reduce((sum, p) => sum + (p.total || 0), 0);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Caja 💰</h2>
            <p className="text-gray-500 text-xs mt-0.5">Pedidos pendientes de pago</p>
          </div>
        </div>
        <div className={`${DARK_CARD} px-6 py-4`}>
          <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total por cobrar</div>
          <div className="text-3xl font-black text-emerald-400">${totalPendiente.toFixed(2)}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-5 lg:gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`${DARK_CARD} p-5 lg:p-6 flex items-center justify-between hover:border-amber-500/20 hover:shadow-lg transition-all`}>
          <div>
            <div className="p-2.5 bg-amber-500/10 rounded-xl w-fit mb-4"><Wallet className="w-5 h-5 text-amber-400" /></div>
            <p className="text-4xl font-black text-amber-400 mb-1">{pedidos.length}</p>
            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Pedidos por Pagar</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`${DARK_CARD} p-5 lg:p-6 flex items-center justify-between hover:border-emerald-500/20 hover:shadow-lg transition-all`}>
          <div>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl w-fit mb-4"><DollarSign className="w-5 h-5 text-emerald-400" /></div>
            <p className="text-4xl font-black text-emerald-400 mb-1">${totalPendiente.toFixed(2)}</p>
            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Total Pendiente</p>
          </div>
        </motion.div>
      </div>

      {/* Pedidos */}
      {loading ? <Spinner label="Cargando pedidos..." /> : pedidos.length === 0 ? (
        <div className={`${DARK_CARD} p-16 text-center`}>
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Todo al día</h3>
          <p className="text-gray-500 text-sm">No hay cuentas pendientes por pagar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence>
            {pedidos.map((pedido, index) => (
              <motion.div key={pedido.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className={`${DARK_CARD} overflow-hidden hover:border-amber-500/20 hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-center justify-between p-5 lg:p-6 border-b border-white/5 bg-amber-500/5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Mesa {pedido.mesa_numero || 'Local'}</h3>
                      <p className="text-gray-500 text-xs mt-0.5">Pedido #{pedido.id}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">Por pagar</span>
                </div>
                <div className="p-5 lg:p-6 space-y-3">
                  <div className="flex items-center gap-2.5 text-gray-500 text-xs">
                    <div className="p-1.5 bg-white/5 rounded-lg"><User className="w-3.5 h-3.5" /></div>
                    <span className="font-medium text-gray-400">{pedido.mesero}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-500 text-xs">
                    <div className="p-1.5 bg-white/5 rounded-lg"><Clock className="w-3.5 h-3.5" /></div>
                    <span>{new Date(pedido.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex items-center justify-between">
                    <span className="text-gray-500 text-xs uppercase tracking-wider">Total</span>
                    <span className="text-2xl font-black text-emerald-400">${(pedido.total || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button onClick={() => { setPedidoSeleccionado(pedido); setShowPago(true); }} className={`${DARK_BTN_PRIMARY} flex-1`}>
                      <DollarSign className="w-4 h-4" /> Pagar
                    </button>
                    <button onClick={() => cerrarPedido(pedido.id)} className={`${DARK_BTN_GHOST} flex-1`}>
                      <Receipt className="w-4 h-4" /> Cerrar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal Pago */}
      <AnimatePresence>
        {showPago && pedidoSeleccionado && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPago(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: -16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div>
                  <h3 className="text-base font-bold text-white">Procesar Pago</h3>
                  <p className="text-gray-500 text-xs mt-0.5">Mesa {pedidoSeleccionado.mesa_numero || 'Local'} — Pedido #{pedidoSeleccionado.id}</p>
                </div>
                <button onClick={() => setShowPago(false)} className="p-1.5 hover:bg-white/5 rounded-xl transition-colors">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="p-6">
                <div className="text-center mb-6 p-5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Total a pagar</div>
                  <div className="text-5xl font-black text-emerald-400">${(pedidoSeleccionado.total || 0).toFixed(2)}</div>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Método de pago</p>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[{ id: 'efectivo', label: 'Efectivo', icon: Banknote }, { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard }, { id: 'transferencia', label: 'Transf.', icon: Building }].map(m => {
                    const Icon = m.icon;
                    return (
                      <button key={m.id} onClick={() => setMetodoPago(m.id)}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                          metodoPago === m.id ? 'border-orange-500/60 bg-orange-500/10' : 'border-white/5 bg-white/3 hover:border-white/15 hover:bg-white/5'
                        }`}>
                        <Icon className={`w-6 h-6 ${metodoPago === m.id ? 'text-orange-400' : 'text-gray-600'}`} />
                        <span className={`text-[10px] font-semibold ${metodoPago === m.id ? 'text-orange-300' : 'text-gray-500'}`}>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
                <button onClick={facturarPedido} className={`${DARK_BTN_PRIMARY} w-full py-3 text-base`}>
                  <CheckCircle className="w-5 h-5" /> Confirmar Pago
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
