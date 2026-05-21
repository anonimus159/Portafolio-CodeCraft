import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Clock, AlertCircle, ChefHat, Filter, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Pre-compute stable per-order time seeds so render stays pure
const TIME_SEEDS = {};
const getTimeSeed = (orderId) => {
  if (!TIME_SEEDS[orderId]) {
    TIME_SEEDS[orderId] = { minutes: Math.floor(Math.random() * 14) + 1, seconds: Math.floor(Math.random() * 59) };
  }
  return TIME_SEEDS[orderId];
};

const KitchenDisplay = ({ orders, setOrders, onCancelItem }) => {
  const [filter, setFilter] = useState('all');
  const [tick, setTick] = useState(0);

  // Live clock tick every second for elapsed time display
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const activeOrders = orders
    .filter(o => (o.status === 'pending' || o.status === 'preparing') && (filter === 'all' || o.station === filter))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // Sound alert for new orders
  useEffect(() => {
    if (activeOrders.length > 0) {
      // Basic beep using Web Audio API
      const playBeep = () => {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (!AudioContext) return;
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.1);
        } catch (e) {}
      };
      playBeep();
    }
  }, [activeOrders.length]);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  }, [setOrders]);

  // Compute real elapsed seconds from order timestamp
  const getElapsed = (timestamp) => {
    const secs = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return { m, s, secs };
  };

  const getTimeColor = (secs) => {
    if (secs > 1200) return 'text-white bg-danger border-danger shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse-gentle'; // > 20 mins: Critical
    if (secs > 900) return 'text-danger bg-danger/10 border-danger/30'; // > 15 mins: Late
    if (secs > 480) return 'text-warning bg-warning/10 border-warning/30'; // > 8 mins: Warning
    return 'text-success bg-success/10 border-success/30'; // Fresh
  };

  const FILTERS = [
    { id: 'all', label: `Todos (${activeOrders.length})` },
    { id: 'parrilla', label: 'Parrilla' },
    { id: 'fritadora', label: 'Fritadora' },
  ];

  return (
    <div className="h-full flex flex-col gap-6 pt-6">
      
      {/* KDS Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 enterprise-card py-4 px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent-secondary/20 flex-center text-accent-secondary">
            <ChefHat size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Pantalla de Cocina</h2>
            <p className="text-xs text-text-tertiary">Estación: Línea Principal 1</p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full sm:w-auto">
          <div className="flex gap-2 bg-bg-base p-1 rounded-lg border border-border-subtle overflow-x-auto w-full sm:w-auto">
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-1.5 text-xs font-bold rounded whitespace-nowrap transition-colors ${
                  filter === f.id ? 'bg-white text-black shadow' : 'text-text-secondary hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            className="btn btn-secondary btn-sm flex-shrink-0"
            onClick={() => setFilter('all')}
          >
            <Filter size={14} /> Todos
          </button>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden scroll-hide">
        <div className="flex gap-6 h-full pb-4 px-1" style={{ width: 'max-content' }}>
          <AnimatePresence>
            {activeOrders.map((order) => {
              const { m, s, secs } = getElapsed(order.timestamp);
              const timeColor = getTimeColor(secs);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  key={order.id}
                  className={`w-[320px] flex flex-col enterprise-card p-0 overflow-hidden flex-shrink-0 ${
                    order.status === 'preparing' ? 'border-accent-secondary/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : ''
                  }`}
                >
                  {/* Ticket Header */}
                  <div className={`p-4 border-b ${
                    order.status === 'preparing' ? 'bg-accent-secondary/10 border-accent-secondary/20' : 'bg-bg-surface border-border-light'
                  }`}>
                    <div className="flex-between mb-2">
                      <h3 className="text-xl font-black mono-font">{order.id}</h3>
                      <span className="text-sm font-bold px-2 py-0.5 bg-white/10 rounded">
                        {order.tableId === 'LLEVAR' ? '🛍️ Para Llevar' : `Mesa ${order.tableId}`}
                      </span>
                    </div>
                    <div className="flex-between">
                      <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                        {order.status === 'pending' ? 'En Espera' : 'Cocinando'}
                      </span>
                      <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded border ${timeColor}`}>
                        <Clock size={12} />
                        {m}m {String(s).padStart(2, '0')}s
                      </div>
                    </div>
                  </div>

                  {/* Ticket Items */}
                  <div className="flex-1 overflow-y-auto p-4 scroll-hide bg-bg-base">
                    <div className="space-y-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-3 group">
                          <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex-center flex-shrink-0 text-sm font-bold mono-font">
                            {item.quantity}x
                          </div>
                          <div className="flex-1">
                            <div className="flex-between">
                              <p className="text-[15px] font-bold leading-tight">{item.name}</p>
                              {onCancelItem && (
                                <button 
                                  onClick={() => onCancelItem(order.id, item)}
                                  className="p-1 text-text-tertiary hover:text-danger hover:bg-danger/10 rounded transition-all opacity-0 group-hover:opacity-100"
                                  title="Anular item"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                            {item.note && (
                              <p className="text-xs text-warning mt-1 flex items-start gap-1 bg-warning/10 p-1.5 rounded border border-warning/20">
                                <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
                                <span className="font-medium">{item.note}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ticket Action */}
                  <div className="p-4 bg-bg-surface border-t border-border-light mt-auto">
                    {order.status === 'pending' ? (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="w-full py-3 rounded-lg bg-accent-secondary text-white font-bold tracking-wide uppercase text-sm hover:brightness-110 transition-all"
                      >
                        Empezar a Preparar
                      </button>
                    ) : (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="w-full py-3 rounded-lg bg-success text-white font-bold tracking-wide uppercase text-sm flex-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                      >
                        <CheckCircle2 size={18} /> Marcar como Listo
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {activeOrders.length === 0 && (
            <div className="w-full h-full flex-center flex-col text-text-tertiary opacity-50">
              <CheckCircle2 size={64} className="mb-4" />
              <h3 className="text-2xl font-bold text-text-secondary">¡Todo al Día!</h3>
              <p className="text-sm mt-2">No hay comandas activas en la cola.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenDisplay;
