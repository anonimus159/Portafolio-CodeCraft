import React, { useState, useEffect } from 'react';
import { User, Clock, AlertCircle, Utensils, Wine, Coffee, ShoppingCart, ArrowRight, Plus, X, Check, Trash2, Calendar as CalendarIcon, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/format';
import { registerAuditLog } from '../utils/audit';

const TableMap = ({ tables = [], setTables, onSelectTable, tableCartCount, allCarts = {}, settings = {}, onOpenModal, onCloseModal }) => {
  const [selectedZone,    setSelectedZone]    = useState('all');
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [showAddModal,    setShowAddModal]    = useState(false);
  const [reservations,    setReservations]    = useState(() => {
    const saved = localStorage.getItem('fastpos_reservations');
    return saved ? JSON.parse(saved) : [];
  });
  const [showResForm,     setShowResForm]     = useState(false);
  const [resForm,         setResForm]         = useState({ name: '', phone: '', time: '' });
  const [newTableForm,    setNewTableForm]    = useState({ id: '', capacity: 4, zone: 'indoor' });

  // Keep selectedDetails in sync when table statuses change reactively
  useEffect(() => {
    if (selectedDetails) {
      const updated = tables.find(t => t.id === selectedDetails.id);
      if (updated) setSelectedDetails(updated);
    }
  }, [tables, selectedDetails]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('fastpos_tables', JSON.stringify(tables));
    localStorage.setItem('fastpos_reservations', JSON.stringify(reservations));
  }, [tables, reservations]);

  const zones = [
    { id: 'all',     label: 'Todas las Zonas' },
    { id: 'indoor',  label: 'Comedor Principal' },
    { id: 'patio',   label: 'Patio Exterior' },
    { id: 'bar',     label: 'Bar' },
  ];

  const visibleTables = selectedZone === 'all'
    ? tables
    : tables.filter(t => t.zone === selectedZone);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full pt-6">
      
      {/* ─── Floor Plan ─────────────────────────────── */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Zone Selector */}
        <div className="flex-between">
          <div className="flex gap-2 p-1 bg-bg-surface border border-border-subtle rounded-lg w-fit">
            {zones.map(zone => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone.id)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                  selectedZone === zone.id
                    ? 'bg-white text-black shadow-sm'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {zone.label}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-sm btn-primary shadow-glow gap-2"
          >
            <Plus size={14} /> Nueva Mesa
          </button>
        </div>

        {/* Map Grid */}
        <div className="flex-1 enterprise-card bg-bg-base relative overflow-hidden flex-center p-8">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(var(--border-light) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
          
          <div className="w-full h-full max-w-4xl max-h-[600px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 relative z-10">
            {visibleTables.map(table => {
              const cartCount = tableCartCount ? tableCartCount(table.id) : 0;
              const isSelected = selectedDetails?.id === table.id;
              const hasReservation = reservations.some(r => r.tableId === table.id);

              let statusStyle = '';
              let dotColor    = '';
              switch (table.status) {
                case 'free':
                  statusStyle = 'bg-bg-surface border-border-light hover:border-white/30 text-text-secondary hover:text-white';
                  dotColor    = 'bg-success';
                  break;
                case 'occupied':
                  statusStyle = 'bg-accent-secondary/10 border-accent-secondary/50 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]';
                  dotColor    = 'bg-accent-secondary shadow-[0_0_10px_rgba(59,130,246,0.5)]';
                  break;
                case 'reserved':
                  statusStyle = 'bg-accent-primary/10 border-accent-primary/50 text-white';
                  dotColor    = 'bg-accent-primary';
                  break;
                case 'pending':
                  statusStyle = 'bg-warning/10 border-warning/50 text-white';
                  dotColor    = 'bg-warning animate-pulse';
                  break;
                default: break;
              }

              return (
                <button
                  key={table.id}
                  onClick={() => {
                    setSelectedDetails(table);
                  }}
                  onDoubleClick={() => onSelectTable(table)}
                  className={`
                    group relative rounded-2xl border-2 flex-center flex-col gap-1 transition-all duration-300
                    ${statusStyle}
                    ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-bg-base scale-105' : 'hover:scale-105'}
                  `}
                >
                  {/* Status dot */}
                  <div className={`absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full border border-bg-base ${dotColor}`} />

                  {/* Reservation icon */}
                  {hasReservation && (
                    <div className="absolute top-2 left-2 text-accent-primary drop-shadow-lg">
                      <CalendarIcon size={12} fill="currentColor" fillOpacity={0.2} />
                    </div>
                  )}

                  {/* Cart badge */}
                  {cartCount > 0 && (
                    <div className="absolute -top-2 -right-6 min-w-[20px] h-5 px-1 rounded-full bg-accent-primary border border-bg-base flex-center text-white text-[10px] font-bold gap-0.5 shadow-lg z-20">
                      <ShoppingCart size={9} />
                      {cartCount}
                    </div>
                  )}

                  <div className="text-text-tertiary opacity-40 group-hover:opacity-100 group-hover:text-accent-primary transition-all duration-300 mb-1">
                    {table.id % 4 === 0 ? <Wine size={26} strokeWidth={1.5} /> :
                     table.id % 3 === 0 ? <Coffee size={26} strokeWidth={1.5} /> :
                     <Utensils size={26} strokeWidth={1.5} />}
                  </div>

                  <span className="text-lg font-bold mono-font leading-none">{table.id}</span>

                  <div className="flex items-center gap-3 text-xs opacity-80">
                    <span className="flex items-center gap-1"><User size={12} /> {table.capacity}</span>
                    {table.status === 'occupied' && (
                      <span className="flex items-center gap-1"><Clock size={12} /> 45m</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Side Details ───────────────────────────── */}
      <div className="w-full lg:w-[320px] flex-shrink-0">
        {selectedDetails ? (
          <div className="enterprise-card h-full flex flex-col p-0 overflow-hidden">
            <div className="p-6 border-b border-border-subtle bg-bg-surface relative">
              <div className="absolute top-0 right-0 p-4">
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  selectedDetails.status === 'free'     ? 'bg-success/20 text-success' :
                  selectedDetails.status === 'occupied' ? 'bg-accent-secondary/20 text-accent-secondary' :
                  selectedDetails.status === 'pending'  ? 'bg-warning/20 text-warning' :
                  'bg-accent-primary/20 text-accent-primary'
                }`}>
                  {selectedDetails.status === 'free'     ? 'Libre' :
                   selectedDetails.status === 'occupied' ? 'Ocupada' :
                   selectedDetails.status === 'pending'  ? 'Esperando Pago' : 'Reservada'}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold mb-1">Mesa {selectedDetails.id}</h3>
                <p className="text-sm text-text-tertiary">
                  {selectedDetails.status === 'free'     ? 'Disponible para sentar' :
                   selectedDetails.status === 'occupied' ? 'Servicio Activo' :
                   selectedDetails.status === 'pending'  ? 'Esperando Pago' : 'Reservada para hoy'}
                </p>
              </div>
              {selectedDetails.status === 'free' && onOpenModal && (
                <button 
                  onClick={() => {
                    onOpenModal({
                      title: 'Eliminar Mesa',
                      message: `¿Estás seguro de eliminar la Mesa ${selectedDetails.id}? Esta acción no se puede deshacer.`,
                      type: 'danger',
                      requirePin: true,
                      onConfirm: () => {
                        setTables(prev => prev.filter(t => t.id !== selectedDetails.id));
                        setSelectedDetails(null);
                        registerAuditLog('ELIMINAR_MESA', `Mesa ${selectedDetails.id} eliminada`, 'Administrador');
                        onCloseModal();
                      }
                    });
                  }}
                  className="absolute bottom-6 right-6 p-2 text-text-tertiary hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                  title="Eliminar Mesa"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 scroll-hide">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-[10px] text-text-tertiary uppercase font-semibold mb-1">Capacidad</p>
                    <p className="text-sm font-medium">{selectedDetails.capacity} personas</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-[10px] text-text-tertiary uppercase font-semibold mb-1">Mesero</p>
                    <div className="text-sm font-medium flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-accent-secondary/20"></div> Alex P.
                    </div>
                  </div>
                </div>

                {/* Cart items in this table */}
                {(() => {
                  const cartItems = allCarts[selectedDetails.id] || [];
                  if (cartItems.length === 0) return null;
                  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
                  const taxRate = (!isNaN(parseFloat(settings.taxRate)) ? parseFloat(settings.taxRate) : 8) / 100;
                  const tax = cartTotal * taxRate;
                  const taxPct = Math.round(taxRate * 100);
                  return (
                    <div>
                      <h4 className="text-xs text-text-tertiary uppercase font-semibold mb-3 flex items-center gap-2">
                        <ShoppingCart size={12} /> Pedido en Curso
                        <span className="ml-auto badge badge-warning">{cartItems.reduce((s,i)=>s+i.quantity,0)} items</span>
                      </h4>
                      <div className="space-y-2 mb-3">
                        {cartItems.map(item => (
                          <div key={item.id} className="flex-between text-sm">
                            <span className="text-text-secondary">{item.quantity}× {item.name}</span>
                            <span className="mono-font font-bold">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border-subtle pt-2 flex-between">
                        <span className="text-xs text-text-tertiary">Subtotal + IVA {taxPct}%</span>
                        <span className="text-sm font-black text-accent-primary mono-font">{formatCurrency(cartTotal + tax)}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* RESERVATIONS SECTION */}
                <div className="pt-6 border-t border-white/5">
                  <div className="flex-between mb-4">
                    <h4 className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Reservas</h4>
                    {!showResForm && (
                      <button onClick={() => setShowResForm(true)} className="text-[10px] text-accent-primary font-bold uppercase hover:underline flex items-center gap-1">
                        <Plus size={12} /> Agendar
                      </button>
                    )}
                  </div>

                  {showResForm && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-4 space-y-3">
                      <input type="text" placeholder="Nombre del cliente" value={resForm.name} onChange={e => setResForm({...resForm, name: e.target.value})} className="w-full bg-bg-base border border-border-light rounded-lg px-3 py-2 text-xs" />
                      <div className="flex gap-2">
                        <input type="time" value={resForm.time} onChange={e => setResForm({...resForm, time: e.target.value})} className="flex-1 bg-bg-base border border-border-light rounded-lg px-3 py-2 text-xs" />
                        <input type="text" placeholder="Teléfono" value={resForm.phone} onChange={e => setResForm({...resForm, phone: e.target.value})} className="flex-1 bg-bg-base border border-border-light rounded-lg px-3 py-2 text-xs" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => setShowResForm(false)} className="flex-1 text-[10px] font-bold text-text-tertiary">Cancelar</button>
                        <button 
                          onClick={() => {
                            if (!resForm.name || !resForm.time) return;
                            setReservations([...reservations, { ...resForm, id: Date.now(), tableId: selectedDetails.id }]);
                            setResForm({ name: '', phone: '', time: '' });
                            setShowResForm(false);
                          }}
                          className="flex-1 btn btn-accent btn-xs"
                        >
                          Guardar
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    {reservations.filter(r => r.tableId === selectedDetails.id).length > 0 ? (
                      reservations.filter(r => r.tableId === selectedDetails.id).map(r => (
                        <div key={r.id} className="flex-between p-3 bg-white/5 border border-white/5 rounded-xl group/res">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex-center text-accent-primary">
                              <Clock size={14} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">{r.name}</p>
                              <p className="text-[10px] text-text-tertiary">{r.time} &bull; {r.phone}</p>
                            </div>
                          </div>
                          <button onClick={() => setReservations(reservations.filter(x => x.id !== r.id))} className="p-2 opacity-0 group-hover/res:opacity-100 text-text-tertiary hover:text-danger transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-text-tertiary italic text-center py-2">Sin reservas programadas.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border-subtle bg-bg-surface/80 backdrop-blur-md">
              {selectedDetails.status === 'free' ? (
                <button
                  onClick={() => onSelectTable(selectedDetails)}
                  className="w-full btn btn-lg btn-accent shadow-glow flex items-center justify-center gap-2"
                >
                  <ArrowRight size={16} /> Abrir Mesa
                </button>
              ) : selectedDetails.status === 'occupied' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectTable(selectedDetails)}
                    className="flex-1 btn btn-md btn-secondary"
                  >
                    Ver Comanda
                  </button>
                  <button
                    onClick={() => onSelectTable(selectedDetails)}
                    className="flex-1 btn btn-md btn-accent shadow-glow"
                  >
                    + Agregar
                  </button>
                </div>
              ) : selectedDetails.status === 'reserved' ? (
                <button
                  onClick={() => onSelectTable(selectedDetails)}
                  className="w-full btn btn-md btn-accent shadow-glow flex items-center justify-center gap-2"
                >
                  <ArrowRight size={16} /> Sentar y Abrir
                </button>
              ) : (
                <button className="w-full btn btn-md btn-secondary">Limpiar Mesa</button>
              )}
            </div>
          </div>
        ) : (
          <div className="enterprise-card h-full flex-center flex-col text-center text-text-tertiary p-8">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex-center mb-4">
              <span className="text-2xl">🍽️</span>
            </div>
            <h3 className="text-lg font-bold text-text-secondary mb-2">Ninguna Mesa Seleccionada</h3>
            <p className="text-sm">Toca una mesa para ver detalles · Doble clic o usa los botones para abrir la comanda.</p>
          </div>
        )}
      </div>
      {/* ─── Add Table Modal ───────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-bg-surface border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold">Nueva Mesa</h3>
                  <p className="text-xs text-text-tertiary mt-1">Configura un nuevo espacio en el salón</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-text-tertiary hover:text-white transition-colors"><X size={24} /></button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Número / ID</label>
                    <input 
                      type="number" 
                      value={newTableForm.id}
                      onChange={e => setNewTableForm(p => ({ ...p, id: e.target.value }))}
                      className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm mono-font outline-none focus:border-accent-primary transition-all"
                      placeholder="Ej: 15"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Capacidad</label>
                    <input 
                      type="number" 
                      value={newTableForm.capacity}
                      onChange={e => setNewTableForm(p => ({ ...p, capacity: e.target.value }))}
                      className="w-full bg-bg-base border border-border-light rounded-xl px-4 py-3 text-sm mono-font outline-none focus:border-accent-primary transition-all"
                      placeholder="4"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">Zona</label>
                  <div className="grid grid-cols-3 gap-2">
                    {zones.filter(z => z.id !== 'all').map(z => (
                      <button
                        key={z.id}
                        onClick={() => setNewTableForm(p => ({ ...p, zone: z.id }))}
                        className={`py-2.5 rounded-xl border text-[11px] font-bold uppercase transition-all ${
                          newTableForm.zone === z.id 
                            ? 'bg-accent-primary border-accent-primary text-white shadow-glow' 
                            : 'bg-white/5 border-white/5 text-text-tertiary hover:bg-white/10'
                        }`}
                      >
                        {z.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  const idNum = parseInt(newTableForm.id);
                  if (!idNum) return;
                  if (tables.find(t => t.id === idNum)) {
                    alert('El número de mesa ya existe.');
                    return;
                  }
                  const newTable = {
                    id: idNum,
                    capacity: parseInt(newTableForm.capacity) || 4,
                    zone: newTableForm.zone,
                    status: 'free'
                  };
                  setTables([...tables, newTable]);
                  setShowAddModal(false);
                  setNewTableForm({ id: '', capacity: 4, zone: 'indoor' });
                }}
                disabled={!newTableForm.id}
                className="btn btn-lg btn-primary w-full mt-8 shadow-glow gap-2"
              >
                <Check size={20} /> Crear Mesa
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TableMap;
