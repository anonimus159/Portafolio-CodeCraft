import React, { useState, useMemo } from 'react';
import { Shield, Search, Calendar, User, Activity, AlertTriangle, Info, Trash2, Key, RefreshCw, ChevronRight, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuditModule = () => {
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('fastpos_audit_logs');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);

  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      const matchesSearch = 
        l.details.toLowerCase().includes(search.toLowerCase()) ||
        l.user.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = filterType === 'all' || l.action.includes(filterType);
      
      return matchesSearch && matchesType;
    });
  }, [logs, search, filterType]);

  const getActionIcon = (action) => {
    if (action.includes('ELIMINAR')) return <Trash2 size={16} className="text-danger" />;
    if (action.includes('PAGO')) return <Shield size={16} className="text-success" />;
    if (action.includes('CARRITO')) return <RefreshCw size={16} className="text-warning" />;
    if (action.includes('ITEM_CANCELADO')) return <AlertTriangle size={16} className="text-danger" />;
    if (action.includes('LOGIN')) return <Key size={16} className="text-accent-secondary" />;
    return <Info size={16} className="text-text-tertiary" />;
  };

  const clearLogs = () => {
    if (window.confirm('¿Estás seguro de vaciar el historial de auditoría?')) {
      localStorage.setItem('fastpos_audit_logs', '[]');
      setLogs([]);
    }
  };

  return (
    <div className="flex flex-col gap-6 pt-6 h-full">
      {/* Header */}
      <div className="flex-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 flex-center text-accent-primary">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Registro de Auditoría</h2>
            <p className="text-xs text-text-tertiary mt-1">Control de seguridad y trazabilidad de acciones administrativas</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="command-bar m-0 w-[280px]">
            <Search size={16} className="text-text-tertiary" />
            <input 
              type="text" 
              placeholder="Buscar por usuario o detalle..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button onClick={clearLogs} className="btn btn-secondary btn-sm text-danger hover:bg-danger/10">
            <Trash2 size={14} /> Limpiar Logs
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex gap-2 p-1 bg-bg-surface border border-border-light rounded-xl w-fit">
        {[
          { id: 'all', label: 'Todo' },
          { id: 'CANCELADO', label: 'Anulaciones' },
          { id: 'ELIMINAR', label: 'Borrados' },
          { id: 'PAGO', label: 'Pagos' },
          { id: 'CARRITO', label: 'Carrito' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterType(cat.id)}
            className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
              filterType === cat.id ? 'bg-accent-primary text-white shadow-glow' : 'text-text-tertiary hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div className="flex-1 overflow-y-auto pr-2 scroll-hide">
        <div className="enterprise-card p-0 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-base/50 text-[10px] font-black uppercase tracking-widest text-text-tertiary border-b border-white/5">
                <th className="px-6 py-4">Acción</th>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Detalle</th>
                <th className="px-6 py-4">Fecha y Hora</th>
                <th className="px-6 py-4 text-right">Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, i) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.01 }}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getActionIcon(log.action)}
                        <span className="text-xs font-bold text-white whitespace-nowrap">{log.action.replace(/_/g, ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-accent-secondary/20 flex-center text-accent-secondary text-[10px] font-bold">
                          {log.user.charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-text-secondary">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-text-tertiary truncate max-w-[300px]">{log.details}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-text-secondary">{new Date(log.timestamp).toLocaleDateString()}</span>
                        <span className="text-[10px] text-text-tertiary">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight size={14} className="inline text-text-tertiary group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-text-tertiary opacity-40">
                    <Activity size={48} className="mx-auto mb-4" />
                    <p className="text-sm">No hay registros de auditoría que coincidan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details Modal */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedLog(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-bg-surface border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/5 flex-between bg-bg-base/50">
                <div className="flex items-center gap-3">
                  {getActionIcon(selectedLog.action)}
                  <h3 className="text-lg font-bold">Detalle del Evento</h3>
                </div>
                <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={20}/></button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-accent-secondary/10 flex-center text-accent-secondary">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Ejecutado por</p>
                      <p className="text-lg font-black text-white">{selectedLog.user}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex-center text-accent-primary">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Fecha y Hora</p>
                      <p className="text-lg font-black text-white">
                        {new Date(selectedLog.timestamp).toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Detalles de la Operación</p>
                  <div className="p-6 bg-bg-base border border-white/5 rounded-2xl">
                    <p className="text-sm text-text-secondary leading-relaxed font-medium italic">"{selectedLog.details}"</p>
                  </div>
                </div>

                <div className="p-4 bg-accent-primary/5 border border-accent-primary/20 rounded-xl flex items-start gap-3">
                  <Shield size={16} className="text-accent-primary mt-0.5" />
                  <p className="text-[10px] text-accent-primary/80 font-medium leading-normal uppercase tracking-wider">
                    Este evento ha sido firmado digitalmente y almacenado en el registro persistente de seguridad del sistema.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuditModule;
