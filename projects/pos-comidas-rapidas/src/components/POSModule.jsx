import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Minus, Trash2, ShoppingCart,
  CreditCard, Send, MoreVertical, ShoppingBag, Utensils, ArrowRightLeft, X, Check, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import ProductCustomizer from './ProductCustomizer';
import ComboBuilder from './ComboBuilder';
import { formatCurrency } from '../utils/format';

// Stable order ID counter
const genOrderId = () => `ORD-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 900) + 100}`;

/**
 * POSModule
 * Props:
 *  mode           'takeout' | 'table'
 *  selectedTable  table object | null
 *  cart           array — controlled from parent (per-table persistence)
 *  onCartChange   (updater) => void
 *  onOrderComplete (order) => void
 */
const POSModule = ({ mode, selectedTable, tables = [], cart, products = [], categories = [], onCartChange, onOrderComplete, onCharge, onMoveTable, settings = {}, customers = [], promotions = [] }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearch,    setCustomerSearch]    = useState('');
  const [showCustomerList,  setShowCustomerList]  = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [orderSent,      setOrderSent]      = useState(false);
  const [showMoveModal,  setShowMoveModal]  = useState(false);
  const [moveTarget,     setMoveTarget]     = useState(null);
  const [customizingProduct, setCustomizingProduct] = useState(null);
  const [buildingCombo, setBuildingCombo] = useState(null);

  const isTakeout = mode === 'takeout';

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat    = activeCategory === 'all' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  /* ── Cart helpers (all update parent state) ─────── */
  const addToCart = (product) => {
    if (product.isCombo) {
      setBuildingCombo(product);
      return;
    }

    if ((product.variants && product.variants.length > 0) || (product.modifiers && product.modifiers.length > 0)) {
      setCustomizingProduct(product);
      return;
    }

    onCartChange(prev => {
      const existing = prev.find(i => i.id === product.id && !i.selectedVariant && (!i.selectedModifiers || i.selectedModifiers.length === 0));
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1, note: '', displayName: product.name }];
    });
  };

  const handleConfirmCombo = (comboItem) => {
    onCartChange(prev => [...prev, comboItem]);
    setBuildingCombo(null);
  };

  const handleConfirmCustomization = (customizedItem) => {
    onCartChange(prev => {
      // For customized items, we always add them as new rows unless they are identical (keeping it simple for now)
      const cartId = `${customizedItem.id}-${customizedItem.selectedVariant?.id || 'none'}-${customizedItem.selectedModifiers?.map(m=>m.id).join('-') || 'none'}`;
      const existing = prev.find(i => i.cartId === cartId);
      
      if (existing) {
        return prev.map(i => i.cartId === cartId ? { ...i, quantity: i.quantity + customizedItem.quantity } : i);
      }
      
      return [...prev, { ...customizedItem, cartId }];
    });
    setCustomizingProduct(null);
  };

  const updateQty = (id, delta) => {
    onCartChange(prev => prev.map(i => {
      if (i.id !== id) return i;
      const q = Math.max(0, i.quantity + delta);
      return q === 0 ? null : { ...i, quantity: q };
    }).filter(Boolean));
  };

  const updateNote = (id, note) => {
    onCartChange(prev => prev.map(i => i.id === id ? { ...i, note } : i));
  };

  const handleClearCart = () => {
    if (onClearCart) {
      onClearCart(() => onCartChange([]));
    } else {
      onCartChange([]);
    }
  };

  /* ── Totals ─────────────────────────────────────── */
  // Read tax rate from settings prop (live from parent — no localStorage read needed)
  const taxRate  = (!isNaN(parseFloat(settings.taxRate)) ? parseFloat(settings.taxRate) : 8) / 100;
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  
  // Calculate best active promotion
  const activePromo = useMemo(() => {
    const today = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'][new Date().getDay()];
    return promotions
      .filter(p => p.active && p.days.includes(today) && subtotal >= (parseInt(p.minPurchase) || 0))
      .sort((a, b) => {
        const valA = a.type === 'fixed' ? parseInt(a.value) : (subtotal * parseInt(a.value) / 100);
        const valB = b.type === 'fixed' ? parseInt(b.value) : (subtotal * parseInt(b.value) / 100);
        return valB - valA; // highest discount first
      })[0];
  }, [promotions, subtotal]);

  const discountValue = useMemo(() => {
    if (!activePromo) return 0;
    if (activePromo.type === 'percentage') return (subtotal * parseInt(activePromo.value)) / 100;
    if (activePromo.type === 'fixed') return parseInt(activePromo.value);
    if (activePromo.type === '2x1') {
      // Simple 2x1: find pairs of same items and discount the cheaper one (simplified to half of price for even quantities)
      // For now, let's just do percentage/fixed for simplicity in this version
      return 0;
    }
    return 0;
  }, [activePromo, subtotal]);

  const tax      = (subtotal - discountValue) * taxRate;
  const total    = (subtotal - discountValue) + tax;
  const taxPct   = Math.round(taxRate * 100);

  /* ── Actions ────────────────────────────────────── */
  const buildOrder = () => ({
    id:        genOrderId(),
    tableId:   isTakeout ? 'LLEVAR' : selectedTable?.id,
    mode,
    items:     cart,
    total,
    status:    'pending',
    timestamp: new Date().toISOString(),
    customer:  selectedCustomer,
  });

  const handleSendToKitchen = () => {
    if (!cart.length) return;
    onOrderComplete(buildOrder());
    setOrderSent(true);
    setTimeout(() => setOrderSent(false), 2000);
  };

  const handleCharge = () => {
    if (!cart.length) return;
    if (onCharge) onCharge(buildOrder());
    else onOrderComplete(buildOrder());
  };

  const handleConfirmMove = () => {
    if (!moveTarget || !onMoveTable) return;
    onMoveTable(moveTarget);
    setShowMoveModal(false);
    setMoveTarget(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-full pt-6 pb-6">

      {/* ─── Product Area ─────────────────────────── */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden min-h-[500px] lg:min-h-0">

        {/* Mode Banner */}
        <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm font-semibold ${
          isTakeout
            ? 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary'
            : 'bg-accent-secondary/10 border-accent-secondary/30 text-accent-secondary'
        }`}>
          <span className="flex items-center gap-2">
            {isTakeout
              ? <><ShoppingBag size={16} /> Pedido Para Llevar — Terminal de Autoservicio</>
              : <><Utensils size={16} /> Mesa {selectedTable?.name || selectedTable?.id} — Comanda de Mesa</>
            }
          </span>
          {!isTakeout && (
            <button
              onClick={() => setShowMoveModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-secondary/20 hover:bg-accent-secondary/40 text-accent-secondary text-xs font-bold transition-colors"
              title="Mover a otra mesa"
            >
              <ArrowRightLeft size={13} /> Mover Mesa
            </button>
          )}
        </div>

        {/* Search */}
        <div className="command-bar m-0" style={{ maxWidth: 320 }}>
          <Search size={14} className="text-text-tertiary" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <span className="shortcut-key">/</span>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scroll-hide pb-2 border-b border-border-subtle">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeCategory === 'all' ? 'border-text-primary text-text-primary' : 'border-transparent text-text-tertiary hover:text-text-secondary'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeCategory === cat.id ? 'border-text-primary text-text-primary' : 'border-transparent text-text-tertiary hover:text-text-secondary'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto pr-2 scroll-hide pb-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredProducts.map(product => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => addToCart(product)}
                  className="group relative flex flex-col bg-bg-surface border border-border-light rounded-xl overflow-hidden cursor-pointer hover:border-border-focus transition-all duration-200 hover:shadow-glow"
                >
                  <div className="h-32 w-full bg-white/5 relative overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute top-2 right-2 w-6 h-6 rounded bg-black/50 backdrop-blur-md flex-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus size={14} className="text-white" />
                    </div>
                  </div>
                  <div className="p-3 flex flex-col flex-1 justify-between">
                    <div>
                      <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold mb-1">{product.category}</p>
                      <h4 className="text-sm font-medium leading-tight text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2">{product.name}</h4>
                    </div>
                    <div className="mt-3 flex-between">
                      <span className="text-sm font-bold">{formatCurrency(product.price)}</span>
                      {cart.find(i => i.id === product.id) && (
                        <span className="text-xs bg-accent-primary/20 text-accent-primary font-bold px-2 py-0.5 rounded-full">
                          {cart.find(i => i.id === product.id).quantity}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── Cart ─────────────────────────────────── */}
      <div className="w-full lg:w-[380px] enterprise-card flex flex-col p-0 overflow-hidden flex-shrink-0 h-[400px] lg:h-auto">

        {/* Header */}
        <div className="p-5 border-b border-border-subtle bg-bg-surface/30 flex-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              {isTakeout ? <ShoppingBag size={18} className="text-accent-primary" /> : <Utensils size={18} className="text-accent-secondary" />}
              {isTakeout ? 'Pedido Para Llevar' : `Comanda — ${selectedTable?.name?.includes('Mesa') ? selectedTable.name : ('Mesa ' + (selectedTable?.name || selectedTable?.id))}`}
            </h3>
            <p className="text-xs text-text-tertiary mt-1">
              {cart.length === 0 ? 'Vacío' : `${cart.reduce((s,i)=>s+i.quantity,0)} item(s)`}
            </p>
          </div>
          <button onClick={handleClearCart} className="w-8 h-8 flex-center rounded-md hover:bg-white/5 text-text-secondary" title="Limpiar todo">
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-2 scroll-hide">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div
                layout key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 group border border-transparent hover:border-white/5 transition-all"
              >
                <div className="w-12 h-12 rounded-md overflow-hidden bg-white/5 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium truncate">{item.displayName || item.name}</h5>
                  <div className="flex flex-col gap-1">
                    {item.optionsSummary && (
                      <p className="text-[10px] text-accent-primary font-medium leading-tight">
                        {item.optionsSummary}
                      </p>
                    )}
                    <p className="text-xs text-text-tertiary">{formatCurrency(item.price)}</p>
                    <input 
                      type="text" 
                      placeholder="Nota..." 
                      value={item.note || ''} 
                      onChange={(e) => updateNote(item.cartId || item.id, e.target.value)}
                      className="text-[10px] bg-white/5 border-none p-1 rounded focus:ring-1 focus:ring-accent-primary outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-bg-base rounded-md border border-border-light p-0.5">
                  <button onClick={() => updateQty(item.cartId || item.id, -1)} className="w-7 h-7 flex-center rounded hover:bg-white/10 text-text-secondary"><Minus size={14}/></button>
                  <span className="w-6 text-center text-xs font-bold mono-font">{item.quantity}</span>
                  <button onClick={() => updateQty(item.cartId || item.id, +1)} className="w-7 h-7 flex-center rounded hover:bg-white/10 text-text-secondary"><Plus size={14}/></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {cart.length === 0 && (
            <div className="h-full flex-center flex-col text-center opacity-40 py-10">
              <ShoppingCart size={40} className="mb-4 text-text-tertiary" />
              <p className="text-sm font-medium text-text-secondary">Ticket vacío</p>
              <p className="text-xs text-text-tertiary mt-1">Selecciona productos del menú.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-bg-surface/80 border-t border-border-subtle p-5 backdrop-blur-xl">
          
          {/* Customer Selection Bar */}
          <div className="mb-6 relative">
            <div className="flex-between mb-2">
              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Cliente / Domicilio</label>
              {selectedCustomer && (
                <button onClick={() => setSelectedCustomer(null)} className="text-[10px] text-danger font-bold uppercase hover:underline">Quitar</button>
              )}
            </div>
            
            {!selectedCustomer ? (
              <div className="relative">
                <div className="command-bar m-0 w-full h-10 bg-white/5 border-white/10 group focus-within:border-accent-primary transition-all">
                  <Users size={14} className="text-text-tertiary" />
                  <input 
                    type="text" 
                    placeholder="Buscar cliente por nombre o tel..." 
                    className="text-xs"
                    value={customerSearch}
                    onChange={e => {
                      setCustomerSearch(e.target.value);
                      setShowCustomerList(true);
                    }}
                    onFocus={() => setShowCustomerList(true)}
                  />
                </div>
                
                <AnimatePresence>
                  {showCustomerList && customerSearch.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-0 right-0 mb-2 bg-bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[60] max-h-48 overflow-y-auto"
                    >
                      {customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch)).length > 0 ? (
                        customers
                          .filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch))
                          .map(c => (
                            <button
                              key={c.id}
                              onClick={() => {
                                setSelectedCustomer(c);
                                setCustomerSearch('');
                                setShowCustomerList(false);
                              }}
                              className="w-full p-3 text-left hover:bg-white/5 flex items-center gap-3 border-b border-white/5 last:border-0"
                            >
                              <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex-center text-accent-primary text-[10px] font-bold">{c.name.charAt(0)}</div>
                              <div>
                                <p className="text-xs font-bold text-white">{c.name}</p>
                                <p className="text-[10px] text-text-tertiary">{c.phone}</p>
                              </div>
                            </button>
                          ))
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-xs text-text-tertiary italic">No se encontró el cliente.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="p-3 bg-accent-primary/5 border border-accent-primary/20 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-primary/20 flex-center text-accent-primary font-black">{selectedCustomer.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{selectedCustomer.name}</p>
                  <p className="text-[10px] text-text-tertiary truncate">{selectedCustomer.address || 'Sin dirección registrada'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-accent-primary mono-font">{selectedCustomer.phone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex-between text-sm">
              <span className="text-text-tertiary">Subtotal</span>
              <span className="font-medium mono-font">${subtotal.toLocaleString('es-CO')}</span>
            </div>
            {discountValue > 0 && (
              <div className="flex-between text-sm text-success">
                <div className="flex items-center gap-1">
                  <Tag size={12} />
                  <span>Promo: {activePromo.name}</span>
                </div>
                <span className="font-bold mono-font">-${discountValue.toLocaleString('es-CO')}</span>
              </div>
            )}
            <div className="flex-between text-sm">
              <span className="text-text-tertiary">Impuesto ({taxPct}%)</span>
              <span className="font-medium mono-font">${tax.toLocaleString('es-CO')}</span>
            </div>
            <div className="h-px w-full bg-border-light my-2"></div>
            <div className="flex-between">
              <span className="text-base font-bold">Total</span>
              <span className="text-2xl font-bold text-accent-primary mono-font">${total.toLocaleString('es-CO')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              className="btn btn-secondary h-12 rounded-xl text-danger hover:text-danger hover:border-danger/30 hover:bg-danger/10"
              onClick={handleClearCart}
              disabled={cart.length === 0}
            >
              <Trash2 size={16} /> Limpiar
            </button>
            <button
              className={`btn h-12 rounded-xl transition-all ${
                orderSent ? 'bg-success/20 border-success text-success' : 'btn-secondary'
              }`}
              onClick={handleSendToKitchen}
              disabled={cart.length === 0}
            >
              <Send size={16} /> {orderSent ? '¡Enviado!' : 'A Cocina'}
            </button>
          </div>
          <button
            className="btn btn-accent w-full h-14 rounded-xl text-lg font-bold flex-center gap-2 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            disabled={cart.length === 0}
            onClick={handleCharge}
          >
            <CreditCard size={20} /> Cobrar {formatCurrency(total)}
          </button>
        </div>
      </div>

      {/* ─── Move Table Modal ──────────────────────── */}
      <AnimatePresence>
        {showMoveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex-center p-6"
            onClick={() => { setShowMoveModal(false); setMoveTarget(null); }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="enterprise-card w-full max-w-lg p-0 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex-between p-6 border-b border-border-subtle bg-bg-surface">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <ArrowRightLeft size={18} className="text-accent-secondary" />
                    Mover Mesa
                  </h3>
                  <p className="text-xs text-text-tertiary mt-1">
                    Transfiere la comanda de <span className="font-bold text-white">Mesa {selectedTable?.id}</span> a otra mesa.
                    Los items se combinarán si la mesa destino ya tiene pedido.
                  </p>
                </div>
                <button onClick={() => { setShowMoveModal(false); setMoveTarget(null); }} className="text-text-tertiary hover:text-white p-1">
                  <X size={20} />
                </button>
              </div>

              {/* Table Grid */}
              <div className="p-6">
                <p className="text-xs text-text-tertiary uppercase font-semibold tracking-wider mb-4">Selecciona la mesa destino</p>
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {tables
                    .filter(t => t.id !== selectedTable?.id)
                    .map(table => {
                      const isSelected = moveTarget?.id === table.id;
                      const statusColor =
                        table.status === 'occupied' ? 'border-accent-secondary/50 bg-accent-secondary/10 text-accent-secondary' :
                        table.status === 'reserved' ? 'border-accent-primary/50 bg-accent-primary/10 text-accent-primary' :
                        'border-border-light bg-white/5 text-text-secondary hover:border-white/30 hover:text-white';
                      return (
                        <button
                          key={table.id}
                          onClick={() => setMoveTarget(table)}
                          className={`relative flex-center flex-col gap-1 rounded-xl border-2 p-4 transition-all ${
                            isSelected
                              ? 'border-success bg-success/10 text-success scale-105 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                              : statusColor
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-success flex-center">
                              <Check size={11} className="text-white" />
                            </div>
                          )}
                          <Utensils size={16} />
                          <span className="text-sm font-bold mono-font">{table.id}</span>
                          <span className={`text-[9px] font-semibold uppercase tracking-wider ${
                            table.status === 'occupied' ? 'text-accent-secondary' :
                            table.status === 'reserved' ? 'text-accent-primary' :
                            'text-text-tertiary'
                          }`}>
                            {table.status === 'occupied' ? 'Ocupada' : table.status === 'reserved' ? 'Reservada' : 'Libre'}
                          </span>
                        </button>
                      );
                  })}
                </div>

                {/* Warning if occupied */}
                {moveTarget?.status === 'occupied' && (
                  <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-lg text-xs text-warning flex items-start gap-2">
                    <ArrowRightLeft size={13} className="flex-shrink-0 mt-0.5" />
                    La mesa {moveTarget.id} ya tiene pedido. Los items se <strong>combinarán</strong> en una sola comanda.
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowMoveModal(false); setMoveTarget(null); }}
                    className="btn btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmMove}
                    disabled={!moveTarget}
                    className="btn btn-accent flex-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
                  >
                    <ArrowRightLeft size={16} />
                    {moveTarget ? `Mover a Mesa ${moveTarget.id}` : 'Selecciona una mesa'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {buildingCombo && (
          <ComboBuilder
            combo={buildingCombo}
            products={products}
            onConfirm={handleConfirmCombo}
            onClose={() => setBuildingCombo(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {customizingProduct && (
          <ProductCustomizer 
            product={customizingProduct}
            onConfirm={handleConfirmCustomization}
            onClose={() => setCustomizingProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default POSModule;
