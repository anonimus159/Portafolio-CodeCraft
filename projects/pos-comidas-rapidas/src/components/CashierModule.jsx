import React, { useState } from 'react';
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Split, 
  Receipt, 
  CheckCircle2, 
  Clock,
  Search,
  Printer,
  Loader2,
  Users,
  QrCode,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/format';

const CashierModule = ({ orders, setOrders, settings = {}, initialOrderId = null, onCancelItem }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrderId);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [search, setSearch] = useState('');
  
  // Cash State
  const [amountTendered, setAmountTendered] = useState('0');
  
  // Card State
  const [cardStatus, setCardStatus] = useState('idle'); // 'idle', 'waiting', 'processing', 'approved'
  
  // Split State
  const [splitMethod, setSplitMethod] = useState('equal'); // 'equal', 'items'
  const [splitCount, setSplitCount] = useState(2);
  const [splitAssignments, setSplitAssignments] = useState({}); // { itemIndex: personIndex }
  const [paidParts, setPaidParts] = useState([]); // Array of person indices
  const [tipType, setTipType] = useState('none');
  const [customTip, setCustomTip] = useState('');

  const pendingOrders = orders.filter(o =>
    (o.status === 'pending' || o.status === 'ready') &&
    (search === '' || o.id.toLowerCase().includes(search.toLowerCase()) || String(o.tableId).toLowerCase().includes(search.toLowerCase()))
  );
  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  // Tip calculations
  const taxRate = (!isNaN(parseFloat(settings.taxRate)) ? parseFloat(settings.taxRate) : 8) / 100;
  const currentSubtotal = selectedOrder ? selectedOrder.total / (1 + taxRate) : 0;
  
  let calculatedTip = 0;
  if (tipType === '10%') calculatedTip = currentSubtotal * 0.10;
  if (tipType === '15%') calculatedTip = currentSubtotal * 0.15;
  if (tipType === 'custom') calculatedTip = parseFloat(customTip) || 0;

  const finalTotal = selectedOrder ? selectedOrder.total + calculatedTip : 0;

  const processPayment = () => {
    if (!selectedOrder) return;
    setOrders(prev => prev.map(o => o.id === selectedOrderId ? { 
      ...o, 
      status: 'completed', 
      paymentMethod: paymentMethod === 'digital' ? 'Transferencia' : paymentMethod === 'card' ? 'Tarjeta' : 'Efectivo',
      amountTendered: Number(amountTendered),
      tipAmount: calculatedTip,
      total: finalTotal,
      completedAt: new Date().toISOString()
    } : o));
    setSelectedOrderId(null);
    setAmountTendered('0');
    setCardStatus('idle');
    setSplitCount(2);
    setSplitAssignments({});
    setPaidParts([]);
    setTipType('none');
    setCustomTip('');
  };

  const handleCardPayment = () => {
    setCardStatus('waiting');
    // Simulate user tapping card after 2s
    setTimeout(() => {
      setCardStatus('processing');
      // Simulate bank approval after 1.5s
      setTimeout(() => {
        setCardStatus('approved');
        // Auto complete after 1s
        setTimeout(() => {
          processPayment();
        }, 1000);
      }, 1500);
    }, 2000);
  };

  const handleNumpad = (val) => {
    if (val === 'C') setAmountTendered('0');
    else if (val === 'DEL') setAmountTendered(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    else setAmountTendered(prev => prev === '0' ? val : prev + val);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full pt-6">
      
      {/* Left Panel: Inbox style pending orders */}
      <div className="w-full lg:w-[380px] flex flex-col gap-4 print:hidden">
        <div className="command-bar w-full">
          <Search size={16} className="text-text-tertiary" />
          <input
            type="text"
            placeholder="Buscar ticket o mesa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-between px-2">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Esperando Pago</h3>
          <span className="badge badge-warning">{pendingOrders.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto scroll-hide space-y-3 pr-1">
          <AnimatePresence>
            {pendingOrders.map(order => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={order.id}
                onClick={() => {
                  if (cardStatus !== 'idle') return; // prevent changing order while processing
                  setSelectedOrderId(order.id);
                  setPaymentMethod('card');
                  setAmountTendered('0');
                  setTipType('none');
                  setCustomTip('');
                }}
                className={`enterprise-card p-4 cursor-pointer transition-all ${
                  selectedOrderId === order.id ? 'ring-2 ring-accent-primary bg-accent-primary/5 border-accent-primary/30' : 'hover:border-white/10'
                } ${cardStatus !== 'idle' && selectedOrderId !== order.id ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="flex-between mb-2">
                  <h4 className="text-lg font-bold mono-font">{order.id}</h4>
                  <span className="text-sm font-bold text-accent-primary mono-font">{formatCurrency(order.total)}</span>
                </div>
                <div className="flex-between text-xs text-text-tertiary">
                  <span className="flex items-center gap-1"><Receipt size={12} /> {order.items.length} items</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {pendingOrders.length === 0 && (
            <div className="h-40 flex-center flex-col text-text-tertiary">
              <CheckCircle2 size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">Todos los tickets cobrados</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Checkout Terminal */}
      <div className="flex-1 enterprise-card flex flex-col p-0 overflow-hidden relative print:hidden">
        {selectedOrder ? (
          <div className="flex h-full relative">
            
            {/* OVERLAY FOR CARD PROCESSING */}
            {cardStatus !== 'idle' && (
              <div className="absolute inset-0 bg-bg-surface/90 backdrop-blur-md z-50 flex-center flex-col animate-in fade-in duration-300">
                {cardStatus === 'waiting' && (
                  <>
                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex-center mb-6 animate-pulse">
                      <CreditCard size={40} className="text-text-secondary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Esperando Tarjeta...</h2>
                    <p className="text-text-tertiary">Inserta, desliza o acerca la tarjeta al lector</p>
                    <p className="text-3xl font-bold font-mono text-accent-primary mt-6">{formatCurrency(selectedOrder.total)}</p>
                    <button onClick={() => setCardStatus('idle')} className="btn btn-secondary mt-12">Cancelar Operación</button>
                  </>
                )}
                {cardStatus === 'processing' && (
                  <>
                    <div className="w-24 h-24 rounded-full bg-accent-primary/10 flex-center mb-6 relative">
                      <Loader2 size={40} className="text-accent-primary animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Procesando Pago...</h2>
                    <p className="text-text-tertiary">No retires la tarjeta</p>
                  </>
                )}
                {cardStatus === 'approved' && (
                  <>
                    <div className="w-24 h-24 rounded-full bg-success/20 flex-center mb-6 scale-in-center">
                      <ShieldCheck size={48} className="text-success" />
                    </div>
                    <h2 className="text-2xl font-bold text-success mb-2">¡Pago Aprobado!</h2>
                    <p className="text-text-secondary">Generando recibo...</p>
                  </>
                )}
              </div>
            )}

            {/* Ticket Details */}
            <div className="w-1/2 border-r border-border-subtle flex flex-col bg-bg-surface/30">
              <div className="p-6 border-b border-border-subtle">
                <div className="flex-between mb-3">
                  <div className="flex items-center gap-3">
                    {settings.logoUrl && (
                      <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                    )}
                    <div>
                      <h2 className="text-lg font-bold">{settings.restaurantName || 'FastPOS'}</h2>
                      {settings.nit && <p className="text-[10px] text-text-tertiary mono-font">NIT: {settings.nit}</p>}
                      {settings.receiptAddress && <p className="text-[10px] text-text-tertiary">{settings.receiptAddress}</p>}
                      {settings.receiptPhone && <p className="text-[10px] text-text-tertiary">{settings.receiptPhone}</p>}
                    </div>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => window.print()}
                  >
                    <Printer size={14} /> Imprimir
                  </button>
                </div>
                <div className="flex-between">
                  <div>
                    <h3 className="text-2xl font-bold mono-font">{selectedOrder.id}</h3>
                    <p className="text-sm text-text-tertiary mt-1">
                      {selectedOrder.tableId === 'LLEVAR' ? '🛍️ Para Llevar' : `Mesa ${selectedOrder.tableId}`}
                    </p>
                  </div>
                  <span className="text-xs text-text-tertiary mono-font">
                    {new Date(selectedOrder.timestamp).toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 scroll-hide space-y-4 bg-bg-base">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex-between group">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold mono-font text-text-tertiary w-6">{item.quantity}x</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{item.name}</span>
                        {item.optionsSummary && <span className="text-[10px] text-accent-primary">{item.optionsSummary}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm mono-font">{formatCurrency(item.price * item.quantity)}</span>
                      {onCancelItem && (
                        <button 
                          onClick={() => onCancelItem(selectedOrder.id, item)}
                          className="p-1.5 text-text-tertiary hover:text-danger hover:bg-danger/10 rounded transition-all opacity-0 group-hover:opacity-100"
                          title="Eliminar item"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-border-subtle bg-bg-surface/80 backdrop-blur-md">
                <div className="flex-between text-sm text-text-tertiary mb-2">
                  <span>Subtotal</span>
                  <span className="mono-font">{formatCurrency(currentSubtotal)}</span>
                </div>
                <div className="flex-between text-sm text-text-tertiary mb-4">
                  <span>Impuesto ({Math.round(taxRate * 100)}%)</span>
                  <span className="mono-font">{formatCurrency(selectedOrder.total - currentSubtotal)}</span>
                </div>

                {/* TIP SELECTOR */}
                <div className="mb-4 pt-4 border-t border-white/5">
                  <p className="text-xs font-bold text-text-secondary uppercase mb-2">Propina Voluntaria</p>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <button onClick={() => setTipType('none')} className={`py-1.5 rounded-lg text-xs font-bold transition-all ${tipType === 'none' ? 'bg-accent-primary text-white' : 'bg-white/5 text-text-tertiary hover:bg-white/10'}`}>0%</button>
                    <button onClick={() => setTipType('10%')} className={`py-1.5 rounded-lg text-xs font-bold transition-all ${tipType === '10%' ? 'bg-accent-primary text-white' : 'bg-white/5 text-text-tertiary hover:bg-white/10'}`}>10%</button>
                    <button onClick={() => setTipType('15%')} className={`py-1.5 rounded-lg text-xs font-bold transition-all ${tipType === '15%' ? 'bg-accent-primary text-white' : 'bg-white/5 text-text-tertiary hover:bg-white/10'}`}>15%</button>
                    <button onClick={() => setTipType('custom')} className={`py-1.5 rounded-lg text-xs font-bold transition-all ${tipType === 'custom' ? 'bg-accent-primary text-white' : 'bg-white/5 text-text-tertiary hover:bg-white/10'}`}>Otro</button>
                  </div>
                  {tipType === 'custom' && (
                    <div className="relative mt-2 animate-in slide-in-from-top-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary font-bold">$</span>
                      <input 
                        type="number" 
                        value={customTip} 
                        onChange={e => setCustomTip(e.target.value)}
                        placeholder="Monto de propina..."
                        className="w-full bg-bg-base border border-border-light rounded-lg pl-7 pr-3 py-2 text-sm text-white outline-none focus:border-accent-primary"
                      />
                    </div>
                  )}
                </div>

                <div className="flex-between text-sm text-success mb-4 font-bold">
                  <span>Propina</span>
                  <span className="mono-font">{formatCurrency(calculatedTip)}</span>
                </div>

                <div className="flex-between text-2xl font-bold">
                  <span>Total a Pagar</span>
                  <span className="text-accent-primary mono-font">{formatCurrency(finalTotal)}</span>
                </div>
              </div>
            </div>

            {/* Payment Flow */}
            <div className="w-1/2 flex flex-col p-6 bg-bg-surface">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Método de Pago</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { id: 'card',    icon: <CreditCard size={20} />, label: 'Tarjeta',       enabled: settings.cardPayment !== false },
                  { id: 'cash',    icon: <Banknote size={20} />,   label: 'Efectivo',      enabled: settings.cashPayment !== false },
                  { id: 'digital', icon: <Smartphone size={20} />, label: 'Transferencia', enabled: settings.transferPayment === true },
                  { id: 'split',   icon: <Split size={20} />,      label: 'Dividir',       enabled: true },
                ].filter(m => m.enabled).map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`h-16 rounded-xl flex items-center gap-3 px-4 transition-all border ${
                      paymentMethod === method.id 
                        ? 'bg-accent-primary border-accent-primary shadow-glow text-white' 
                        : 'bg-bg-base border-border-light text-text-secondary hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {method.icon}
                    <span className="font-bold">{method.label}</span>
                  </button>
                ))}
              </div>

              {/* CASH FLOW */}
              {paymentMethod === 'cash' && (
                <div className="mb-8 animate-in fade-in">
                  <div className="bg-bg-base border border-border-light rounded-xl p-4 mb-4 flex-between">
                    <span className="text-text-secondary">Recibido</span>
                    <span className="text-2xl font-bold mono-font">{formatCurrency(Number(amountTendered))}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {['1','2','3','4','5','6','7','8','9','C','0','DEL'].map(btn => (
                      <button 
                        key={btn}
                        onClick={() => handleNumpad(btn)}
                        className={`h-14 rounded-lg text-lg font-bold transition-colors ${
                          btn === 'C' ? 'bg-danger/10 text-danger hover:bg-danger/20' :
                          btn === 'DEL' ? 'bg-white/5 text-text-secondary hover:bg-white/10' :
                          'bg-white/5 hover:bg-white/10 text-white'
                        }`}
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                  
                  <div className={`mt-4 flex-between p-4 border rounded-xl transition-colors ${Number(amountTendered) >= finalTotal ? 'bg-success/10 border-success/30 text-success' : 'bg-white/5 border-white/10 text-text-tertiary'}`}>
                    <span className="font-bold">Cambio a Entregar</span>
                    <span className="text-xl font-bold mono-font">{formatCurrency(Math.max(0, Number(amountTendered) - finalTotal))}</span>
                  </div>
                </div>
              )}

              {/* CARD FLOW */}
              {paymentMethod === 'card' && (
                <div className="mb-8 flex-1 flex-center flex-col text-center animate-in fade-in">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex-center mb-6">
                    <CreditCard size={32} className="text-text-tertiary" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Pago con Tarjeta</h4>
                  <p className="text-sm text-text-tertiary mb-6 px-8">El monto será enviado automáticamente a la terminal de pago (Datáfono).</p>
                  
                  <div className="w-full bg-bg-base border border-border-light rounded-xl p-4 flex-between">
                    <span className="text-text-secondary text-sm">Terminal</span>
                    <span className="text-success text-sm flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> Conectado</span>
                  </div>
                </div>
              )}

              {/* DIGITAL TRANSFER FLOW */}
              {paymentMethod === 'digital' && (
                <div className="mb-8 flex-1 flex flex-col items-center animate-in fade-in">
                  <div className="p-4 bg-white rounded-xl mb-6">
                    <QrCode size={120} className="text-black" />
                  </div>
                  <h4 className="text-lg font-bold mb-1">Nequi / Daviplata</h4>
                  <p className="text-sm text-text-tertiary text-center px-4 mb-4">Pide al cliente que escanee el código para transferir <span className="font-bold text-white">{formatCurrency(finalTotal)}</span></p>
                  
                  <div className="w-full bg-warning/10 border border-warning/20 p-3 rounded-lg text-center mt-auto">
                    <p className="text-xs text-warning">Asegúrate de confirmar la recepción en tu dispositivo antes de continuar.</p>
                  </div>
                </div>
              )}

              {/* SPLIT BILL FLOW */}
              {paymentMethod === 'split' && (
                <div className="mb-8 flex-1 flex flex-col animate-in fade-in overflow-hidden">
                  <div className="flex-between mb-4">
                    <h4 className="text-lg font-bold flex items-center gap-2"><Users size={18} /> Dividir Cuenta</h4>
                    <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
                      <button 
                        onClick={() => setSplitMethod('equal')}
                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${splitMethod === 'equal' ? 'bg-accent-primary text-white' : 'text-text-tertiary'}`}
                      >
                        Equitativo
                      </button>
                      <button 
                        onClick={() => setSplitMethod('items')}
                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${splitMethod === 'items' ? 'bg-accent-primary text-white' : 'text-text-tertiary'}`}
                      >
                        Por Items
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-bg-base border border-border-light rounded-xl p-3 flex-between mb-4">
                    <span className="text-[10px] text-text-tertiary font-bold uppercase">Personas</span>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setSplitCount(Math.max(2, splitCount - 1))} className="w-8 h-8 rounded-full bg-white/10 flex-center hover:bg-white/20">-</button>
                      <span className="text-xl font-bold mono-font">{splitCount}</span>
                      <button onClick={() => setSplitCount(splitCount + 1)} className="w-8 h-8 rounded-full bg-white/10 flex-center hover:bg-white/20">+</button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto scroll-hide space-y-4">
                    {splitMethod === 'equal' ? (
                      [...Array(splitCount)].map((_, idx) => {
                        const isPaid = paidParts.includes(idx);
                        return (
                          <div key={idx} className={`p-4 border border-white/10 rounded-xl flex-between transition-all ${isPaid ? 'bg-success/20 border-success/30 opacity-50' : 'bg-white/5'}`}>
                            <div>
                              <span className="font-medium text-text-secondary">Persona {idx + 1}</span>
                              {isPaid && <p className="text-[10px] text-success font-bold uppercase mt-1">Pagado</p>}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-lg mono-font">{formatCurrency(finalTotal / splitCount)}</span>
                              {!isPaid && (
                                <button onClick={() => setPaidParts([...paidParts, idx])} className="btn btn-accent btn-xs">Pagar</button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          {[...Array(splitCount)].map((_, pIdx) => (
                            <div key={pIdx} className={`p-3 rounded-xl border ${paidParts.includes(pIdx) ? 'bg-success/10 border-success/30 opacity-60' : 'bg-white/5 border-white/10'}`}>
                              <p className="text-[10px] font-black uppercase text-text-tertiary mb-2">Persona {pIdx + 1}</p>
                              <div className="space-y-1 mb-2">
                                {selectedOrder.items.map((item, iIdx) => splitAssignments[iIdx] === pIdx && (
                                  <p key={iIdx} className="text-[10px] truncate text-white">{item.quantity}x {item.name}</p>
                                ))}
                              </div>
                              <div className="flex-between border-t border-white/5 pt-2">
                                <span className="text-xs font-bold mono-font">
                                  {formatCurrency(
                                    selectedOrder.items.reduce((acc, item, idx) => splitAssignments[idx] === pIdx ? acc + (item.price * item.quantity) : acc, 0)
                                    + (calculatedTip / splitCount)
                                  )}
                                </span>
                                {!paidParts.includes(pIdx) && (
                                  <button onClick={() => setPaidParts([...paidParts, pIdx])} className="text-[10px] text-accent-primary font-bold hover:underline">Pagar</button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="p-4 bg-bg-base border border-border-light rounded-xl">
                          <p className="text-[10px] text-text-tertiary font-bold uppercase mb-3">Asignar Items Sin Pagar</p>
                          <div className="space-y-2">
                            {selectedOrder.items.map((item, idx) => (
                              <div key={idx} className="flex-between text-xs">
                                <span className="truncate flex-1 pr-2">{item.name}</span>
                                <select 
                                  value={splitAssignments[idx] ?? ''} 
                                  onChange={e => setSplitAssignments({...splitAssignments, [idx]: parseInt(e.target.value)})}
                                  className="bg-white/5 border-none rounded text-[10px] p-1 outline-none focus:ring-1 focus:ring-accent-primary"
                                >
                                  <option value="">Elegir...</option>
                                  {[...Array(splitCount)].map((_, i) => <option key={i} value={i}>Persona {i+1}</option>)}
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {paidParts.length === splitCount && (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 p-4 bg-success/20 border border-success/30 rounded-xl text-center">
                      <p className="text-sm font-bold text-success">¡Cuenta Totalmente Pagada!</p>
                      <button onClick={processPayment} className="btn btn-success btn-sm w-full mt-2">Cerrar Ticket</button>
                    </motion.div>
                  )}
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-border-subtle">
                <button 
                  onClick={paymentMethod === 'card' ? handleCardPayment : processPayment}
                  disabled={paymentMethod === 'cash' && Number(amountTendered) < finalTotal}
                  className="w-full h-16 rounded-xl bg-text-primary text-bg-base text-lg font-bold flex-center gap-2 hover:bg-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <CheckCircle2 size={24} /> 
                  {paymentMethod === 'cash' ? 'Completar Transacción' : 
                   paymentMethod === 'card' ? `Cobrar ${formatCurrency(finalTotal)}` :
                   paymentMethod === 'digital' ? 'Confirmar Recepción' :
                   'Proceder a Cobrar Partes'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex-center flex-col text-text-tertiary">
            <Receipt size={64} className="mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-text-secondary">Ningún Ticket Seleccionado</h3>
            <p className="text-sm mt-2">Selecciona un ticket de la lista para procesar el pago.</p>
          </div>
        )}

        {/* --- PRINTABLE RECEIPT (Hidden on screen, visible on print) --- */}
        {selectedOrder && (
          <div id="printable-receipt" className="print-receipt-container">
            <div className="print-receipt-inner" style={{ fontFamily: 'monospace', width: '80mm', padding: '10px' }}>
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                {settings.showLogoOnReceipt && settings.logoUrl && (
                  <img src={settings.logoUrl} alt="Logo" style={{ width: '40mm', height: 'auto', marginBottom: '10px', filter: 'grayscale(1)' }} />
                )}
                <h2 style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>{settings.restaurantName || 'FastPOS'}</h2>
                <p style={{ margin: '2px 0', fontSize: '12px' }}>NIT: {settings.nit}</p>
                {settings.receiptAddress && <p style={{ margin: '2px 0', fontSize: '11px' }}>{settings.receiptAddress}</p>}
                {settings.receiptPhone && <p style={{ margin: '2px 0', fontSize: '11px' }}>Tel: {settings.receiptPhone}</p>}
                <p style={{ margin: '2px 0', fontSize: '10px', opacity: 0.8 }}>{new Date().toLocaleString('es-CO')}</p>
              </div>
              
              <div style={{ borderBottom: '1px dashed black', paddingBottom: '10px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>ORDEN: {selectedOrder.id}</span>
                  <span>{selectedOrder.tableId === 'LLEVAR' ? 'PARA LLEVAR' : `MESA: ${selectedOrder.tableId}`}</span>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                    <span>{item.quantity}x {item.name}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px dashed black', paddingTop: '10px' }}>
                {(() => {
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span>Subtotal:</span>
                        <span>{formatCurrency(currentSubtotal)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                        <span>IVA ({Math.round(taxRate*100)}%):</span>
                        <span>{formatCurrency(selectedOrder.total - currentSubtotal)}</span>
                      </div>
                      {calculatedTip > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                          <span>Propina Voluntaria:</span>
                          <span>{formatCurrency(calculatedTip)}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px' }}>
                        <span>TOTAL:</span>
                        <span>{formatCurrency(finalTotal)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '10px' }}>
                <p>{settings.receiptMessage}</p>
                <p style={{ marginTop: '10px' }}>*** Gracias por su compra ***</p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default CashierModule;
