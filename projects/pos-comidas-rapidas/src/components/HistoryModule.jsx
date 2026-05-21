import React, { useState, useMemo } from 'react';
import { Search, Filter, Receipt, ChevronRight, ShoppingBag, Map, Calendar, Clock, X, Printer, Trash2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/format';

const HistoryModule = ({ orders = [], settings = {} }) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, cancelled, pending
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = 
        String(o.id).toLowerCase().includes(search.toLowerCase()) ||
        (o.tableId && String(o.tableId).toLowerCase().includes(search.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, filterStatus]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'cancelled': return 'bg-danger/10 text-danger border-danger/20';
      case 'pending':   return 'bg-warning/10 text-warning border-warning/20';
      case 'preparing': return 'bg-accent-primary/10 text-accent-primary border-accent-primary/20';
      default:          return 'bg-white/5 text-text-tertiary border-white/10';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      case 'pending':   return 'Pendiente';
      case 'preparing': return 'En Cocina';
      default:          return status;
    }
  };

  return (
    <div className="flex flex-col gap-6 pt-6 h-full">
      {/* Header & Controls */}
      <div className="flex-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold">Historial de Órdenes</h2>
          <p className="text-xs text-text-tertiary mt-1">Busca, revisa y re-imprime tickets de ventas pasadas</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="command-bar m-0 w-[280px]">
            <Search size={16} className="text-text-tertiary" />
            <input 
              type="text" 
              placeholder="Buscar por ID o Mesa..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <select 
            className="bg-bg-surface border border-border-light rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-accent-primary"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos los Estados</option>
            <option value="completed">Completados</option>
            <option value="cancelled">Cancelados</option>
            <option value="pending">Pendientes</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto pr-2 scroll-hide">
        <div className="grid grid-cols-1 gap-3">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedOrder(order)}
                className="enterprise-card p-4 flex items-center gap-6 cursor-pointer hover:border-accent-primary/50 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex-center ${order.tableId === 'LLEVAR' ? 'bg-accent-secondary/10 text-accent-secondary' : 'bg-accent-primary/10 text-accent-primary'}`}>
                  {order.tableId === 'LLEVAR' ? <ShoppingBag size={24} /> : <Map size={24} />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-black mono-font text-white">#{order.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-tertiary">
                    <span className="font-bold text-text-secondary">{order.tableId === 'LLEVAR' ? '🛍️ Para Llevar' : `Mesa ${order.tableId}`}</span>
                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(order.timestamp).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="text-right mr-4">
                  <p className="text-[10px] text-text-tertiary font-bold uppercase mb-0.5">Total Cobrado</p>
                  <p className="text-lg font-black text-accent-primary mono-font">{formatCurrency(order.total || 0)}</p>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/5 flex-center text-text-tertiary group-hover:text-white group-hover:bg-white/10 transition-all">
                  <ChevronRight size={18} />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex-center flex-col py-20 opacity-40">
              <Receipt size={64} strokeWidth={1} className="mb-4" />
              <p className="text-lg font-bold">No se encontraron órdenes</p>
              <p className="text-sm">Intenta ajustar los filtros o el término de búsqueda</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Side Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md h-full bg-bg-surface border-l border-white/10 shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/5 flex-between bg-bg-base/50">
                <div>
                  <h3 className="text-xl font-bold">Detalle de Orden</h3>
                  <p className="text-xs text-text-tertiary mt-1">ID: {selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-hide">
                {/* Status Card */}
                <div className={`p-4 rounded-2xl border flex items-center gap-4 ${getStatusStyle(selectedOrder.status)}`}>
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Estado Actual</p>
                    <p className="text-sm font-black uppercase">{getStatusLabel(selectedOrder.status)}</p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-bold text-text-tertiary uppercase mb-1">Fecha</p>
                    <p className="text-sm font-bold">{new Date(selectedOrder.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-bold text-text-tertiary uppercase mb-1">Hora</p>
                    <p className="text-sm font-bold">{new Date(selectedOrder.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-bold text-text-tertiary uppercase mb-1">Método de Pago</p>
                    <p className="text-sm font-bold capitalize">{selectedOrder.paymentMethod || 'Efectivo'}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-bold text-text-tertiary uppercase mb-1">Ubicación</p>
                    <p className="text-sm font-bold">{selectedOrder.tableId === 'LLEVAR' ? '🛍️ Para Llevar' : `Mesa ${selectedOrder.tableId}`}</p>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest border-b border-white/5 pb-2">Artículos del Pedido</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex-between">
                        <div className="flex gap-3">
                          <span className="text-accent-primary font-black mono-font text-sm">{item.quantity}x</span>
                          <div>
                            <p className="text-sm font-bold text-white leading-none">{item.name}</p>
                            {item.variant && <p className="text-[10px] text-text-tertiary mt-1 italic">{item.variant.name}</p>}
                          </div>
                        </div>
                        <span className="text-sm font-bold mono-font">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Section */}
                <div className="pt-6 border-t border-white/10 space-y-3">
                  <div className="flex-between text-text-tertiary text-xs">
                    <span>Subtotal</span>
                    <span>{formatCurrency((selectedOrder.total || 0) / (1 + (!isNaN(parseFloat(settings.taxRate)) ? parseFloat(settings.taxRate) : 8) / 100))}</span>
                  </div>
                  <div className="flex-between text-text-tertiary text-xs">
                    <span>Impuesto ({!isNaN(parseFloat(settings.taxRate)) ? parseFloat(settings.taxRate) : 8}%)</span>
                    <span>{formatCurrency((selectedOrder.total || 0) - (selectedOrder.total || 0) / (1 + (!isNaN(parseFloat(settings.taxRate)) ? parseFloat(settings.taxRate) : 8) / 100))}</span>
                  </div>
                  <div className="flex-between pt-2">
                    <span className="text-lg font-bold">Total Final</span>
                    <span className="text-2xl font-black text-accent-primary mono-font">{formatCurrency(selectedOrder.total || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-bg-base/80 backdrop-blur-md border-t border-white/10 flex gap-3">
                <button 
                  onClick={() => window.print()} 
                  className="flex-1 btn btn-md btn-secondary gap-2"
                >
                  <Printer size={16} /> Re-imprimir
                </button>
                {selectedOrder.status !== 'cancelled' && (
                  <button className="flex-1 btn btn-md btn-danger gap-2 opacity-50 cursor-not-allowed">
                    <Trash2 size={16} /> Anular Factura
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CheckCircle2 = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default HistoryModule;
