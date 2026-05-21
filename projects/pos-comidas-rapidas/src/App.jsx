import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Map, TerminalSquare, ChefHat, CreditCard, Banknote, Wallet,
  Box, BarChart, Users, Settings, Search, Bell, Command, Coffee,
  Pin, PinOff, ShoppingBag, Utensils, Cloud, CloudOff, RefreshCw, LogOut, Tag, Truck
} from 'lucide-react';
import { supabase } from './lib/supabase';

import { TABLES, INITIAL_ORDERS, PRODUCTS as MOCK_PRODUCTS, CATEGORIES as MOCK_CATEGORIES, INITIAL_INVENTORY, INITIAL_STAFF } from './data/mockData';
import DashboardModule  from './components/DashboardModule';
import TableMap         from './components/TableMap';
import POSModule        from './components/POSModule';
import KitchenDisplay   from './components/KitchenDisplay';
import CashierModule    from './components/CashierModule';
import LandingPage      from './components/LandingPage';
import InventoryModule  from './components/InventoryModule';
import ReportsModule    from './components/ReportsModule';
import UsersModule      from './components/UsersModule';
import SettingsModule   from './components/SettingsModule';
import MenuModule       from './components/MenuModule';
import PairingPage      from './components/PairingPage';
import LoginScreen      from './components/LoginScreen';
import CashControlModule from './components/CashControlModule';
import ExpensesModule    from './components/ExpensesModule';
import ConfirmModal      from './components/ConfirmModal';
import HistoryModule     from './components/HistoryModule';
import AuditModule       from './components/AuditModule';
import CustomersModule   from './components/CustomersModule';
import PromotionsModule  from './components/PromotionsModule';
import SuppliersModule   from './components/SuppliersModule';

// Utilities
import { formatCurrency } from './utils/format';
import { registerAuditLog } from './utils/audit';
import { deductOrderStock, restoreItemStock } from './utils/stock';

/* ── Default Settings (single source of truth) ──────── */
const SETTINGS_KEY = 'fastpos_settings';
export const DEFAULT_SETTINGS = {
  restaurantName:   'Le Restaurant',
  nit:              '240052142878',
  taxRate:          '8.0',
  currency:         'COP - Peso Colombiano ($)',
  receiptAddress:   'Calle Principal #123 - Ciudad',
  receiptPhone:     '+57 300 000 0000',
  receiptMessage:   '¡Gracias por comer con nosotros! Vuelve pronto para disfrutar de la mejor gastronomía.',
  logoUrl:          '',
  showLogoOnReceipt: true,
  kitchenPrinter:   true,
  cashPayment:      true,
  cardPayment:      true,
  transferPayment:  false,
  soundNewOrder:    true,
  soundReady:       true,
  alertStock:       true,
  pinRefunds:       true,
  pinVoids:         false,
  masterPin:        '1234',
};

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
  } catch { return { ...DEFAULT_SETTINGS }; }
};

/* ── Nav groups ──────────────────────────────────────── */
const NAV_GROUPS = [
  {
    label: 'Operaciones',
    items: [
      { id: 'dashboard', label: 'Resumen',    icon: LayoutDashboard },
      { id: 'tables',    label: 'Mesas',      icon: Map },
      { id: 'pos',       label: 'Para Llevar', icon: ShoppingBag },
      { id: 'kitchen',   label: 'Cocina KDS', icon: ChefHat },
      { id: 'cashier',   label: 'Caja',       icon: CreditCard },
      { id: 'shifts',    label: 'Turnos y Caja', icon: Banknote },
    ],
  },
  {
    label: 'Gestión',
    items: [
      { id: 'inventory', label: 'Inventario', icon: Box },
      { id: 'expenses',  label: 'Gastos / Egresos', icon: Wallet },
      { id: 'menu',      label: 'Menú / Carta', icon: Utensils },
      { id: 'history',   label: 'Historial',    icon: ShoppingBag },
      { id: 'reports',   label: 'Reportes',   icon: BarChart },
      { id: 'audit',     label: 'Seguridad',    icon: Cloud },
      { id: 'customers', label: 'Clientes',     icon: Users },
      { id: 'promotions', label: 'Promociones',  icon: Tag },
      { id: 'suppliers',  label: 'Proveedores',   icon: Truck },
      { id: 'users',     label: 'Personal',   icon: Users },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { id: 'settings', label: 'Ajustes', icon: Settings },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap(g => g.items);

/* ── App ─────────────────────────────────────────────── */
function App() {
  const [showLanding,   setShowLanding]   = useState(true);
  const [activeTab,     setActiveTab]     = useState('tables');
  
  // ── Modal State ──────────────
  const [modal, setModal] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    type: 'warning', 
    onConfirm: () => {},
    requirePin: false 
  });

  const [tables,        setTables]        = useState(() => {
    try {
      const saved = localStorage.getItem('fastpos_tables');
      const loadedTables = saved ? JSON.parse(saved) : TABLES;
      // Force all tables to free for this request
      return loadedTables.map(t => ({ ...t, status: 'free' }));
    } catch { return TABLES.map(t => ({ ...t, status: 'free' })); }
  });
  const [orders,        setOrders]        = useState(() => {
    return []; // Clear all orders for a clean slate
  });

  // ── Global Settings State ─────────────────────────────
  // Single source of truth for all settings across the app.
  // SettingsModule reads AND writes through here, so every
  // module that receives `settings` as a prop re-renders instantly.
  const [settings, setSettings] = useState(loadSettings);
  const [cashierOrderId, setCashierOrderId] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [syncStatus, setSyncStatus] = useState('connecting'); // 'connecting', 'synced', 'error'
  const [clientId] = useState(() => Math.random().toString(36).substring(7));
  const [currentUser, setCurrentUser] = useState(null); // Force login on start

  // FORCE RESET TABLES ON START (as requested)
  useEffect(() => {
    setTables(prev => prev.map(t => ({ ...t, status: 'free' })));
    setOrders([]);
  }, []);

  const handleOpenModal = (data) => {
    setModal({ ...data, isOpen: true });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  // ── Shift / Cash Control State ──────────────
  const [shifts, setShifts] = useState(() => {
    try {
      const saved = localStorage.getItem('fastpos_shifts');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [activeShiftId, setActiveShiftId] = useState(() => {
    return localStorage.getItem('fastpos_active_shift_id') || null;
  });

  const activeShift = useMemo(() => shifts.find(s => s.id === activeShiftId), [shifts, activeShiftId]);

  // ── Expenses State ──────────────────────────
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('fastpos_expenses');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // ── Keyboard Shortcuts ───────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') setShowSearch(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commandItems = useMemo(() => {
    const items = [];
    NAV_GROUPS.forEach(group => {
      group.items.forEach(item => {
        items.push({ ...item, type: 'nav' });
      });
    });
    return items.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  // ── Menu State ─────────────────────────────
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('fastpos_products');
      return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
    } catch { return MOCK_PRODUCTS; }
  });
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('fastpos_categories');
      return saved ? JSON.parse(saved) : MOCK_CATEGORIES;
    } catch { return MOCK_CATEGORIES; }
  });
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('fastpos_inventory');
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch { return INITIAL_INVENTORY; }
  });

  const [staff, setStaff] = useState(() => {
    try {
      const saved = localStorage.getItem('fastpos_staff');
      const parsed = saved ? JSON.parse(saved) : INITIAL_STAFF;
      if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0].username) return INITIAL_STAFF;
      return parsed;
    } catch { return INITIAL_STAFF; }
  });
  const [customers,     setCustomers]     = useState(() => {
    try {
      const saved = localStorage.getItem('fastpos_customers');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [promotions,    setPromotions]    = useState(() => {
    try {
      const saved = localStorage.getItem('fastpos_promos');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('fastpos_products', JSON.stringify(products));
    localStorage.setItem('fastpos_categories', JSON.stringify(categories));
    localStorage.setItem('fastpos_tables', JSON.stringify(tables));
    localStorage.setItem('fastpos_orders', JSON.stringify(orders));
    localStorage.setItem('fastpos_inventory', JSON.stringify(inventory));
    localStorage.setItem('fastpos_staff', JSON.stringify(staff));
    localStorage.setItem('fastpos_shifts', JSON.stringify(shifts));
    localStorage.setItem('fastpos_expenses', JSON.stringify(expenses));
    localStorage.setItem('fastpos_customers', JSON.stringify(customers));
    localStorage.setItem('fastpos_promos', JSON.stringify(promotions));
    if (activeShiftId) localStorage.setItem('fastpos_active_shift_id', activeShiftId);
    else localStorage.removeItem('fastpos_active_shift_id');
  }, [products, categories, tables, orders, inventory, staff, shifts, activeShiftId, expenses, promotions]);

  // ── Real-time Cloud Sync ────────────────────
  useEffect(() => {
    const channel = supabase.channel('fastpos-sync', {
      config: { broadcast: { self: false } }
    });

    channel
      .on('broadcast', { event: 'STATE_UPDATE' }, (payload) => {
        const { type, data, senderId } = payload.payload;
        if (senderId === clientId) return;

        if (type === 'orders') setOrders(data);
        if (type === 'inventory') setInventory(data);
        if (type === 'tables') setTables(data);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setSyncStatus('synced');
        else setSyncStatus('error');
      });

    return () => { channel.unsubscribe(); };
  }, [clientId]);

  // Helper to broadcast changes
  const broadcast = (type, data) => {
    supabase.channel('fastpos-sync').send({
      type: 'broadcast',
      event: 'STATE_UPDATE',
      payload: { type, data, senderId: clientId },
    });
  };

  // Broadcast local changes (except on mount)
  const isFirstMount = React.useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    broadcast('orders', orders);
  }, [orders]);

  useEffect(() => {
    if (isFirstMount.current) return;
    broadcast('inventory', inventory);
  }, [inventory]);

  useEffect(() => {
    if (isFirstMount.current) return;
    broadcast('tables', tables);
  }, [tables]);

  const handleSettingsSaved = (newSettings) => {
    setSettings(newSettings);
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings)); } catch {}
  };

  // selectedTable: null = takeout/terminal, object = specific table
  const [selectedTable, setSelectedTable] = useState(null);

  // Independent cart per context: 'takeout' | tableId (number)
  const [allCarts, setAllCarts] = useState(() => {
    try {
      const saved = sessionStorage.getItem('fastpos_carts');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const [pinned,  setPinned]  = useState(false);
  const [hovered, setHovered] = useState(false);
  const isExpanded = pinned || hovered;

  /* ── Cart helpers ───────────────────────────────── */
  const cartKey = selectedTable ? selectedTable.id : 'takeout';
  const currentCart = allCarts[cartKey] || [];

  // Persist carts to sessionStorage so F5 doesn't lose open tickets
  useEffect(() => {
    try { sessionStorage.setItem('fastpos_carts', JSON.stringify(allCarts)); } catch {}
  }, [allCarts]);

  const setCurrentCart = (updater) => {
    setAllCarts(prev => {
      const current = prev[cartKey] || [];
      const next    = typeof updater === 'function' ? updater(current) : updater;
      return { ...prev, [cartKey]: next };
    });
  };

  const tableCartCount = (tableId) =>
    (allCarts[tableId] || []).reduce((s, i) => s + i.quantity, 0);

  // Derive table statuses reactively from cart state
  const effectiveTables = useMemo(() =>
    tables.map(t => ({
      ...t,
      status: (allCarts[t.id]?.length > 0) ? 'occupied' : t.status,
    })),
    [tables, allCarts]
  );

  /* ── Handlers ───────────────────────────────────── */
  const handleNavClick = (id) => {
    const PROTECTED_TABS = ['settings', 'reports', 'users', 'inventory', 'menu', 'dashboard'];
    const hasPermission = currentUser?.permissions?.includes(id);
    const isAdmin = currentUser?.role === 'Gerente' || currentUser?.role === 'Administrador';
    
    if (PROTECTED_TABS.includes(id) && !isAuthenticated && !isAdmin && !hasPermission) {
      setModal({
        isOpen: true,
        title: 'Acceso Restringido',
        message: `Esta área requiere autorización de administrador. Por favor ingrese el PIN Maestro.`,
        type: 'warning',
        requirePin: true,
        onConfirm: () => {
          setIsAuthenticated(true);
          setModal(p => ({ ...p, isOpen: false }));
          if (id === 'pos') setSelectedTable(null);
          setActiveTab(id);
          registerAuditLog('ACCESO_PROTEGIDO', `Acceso concedido a la pestaña: ${id}`, currentUser);
        }
      });
      return;
    }

    if (id === 'pos') setSelectedTable(null);
    setActiveTab(id);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveTab('tables');
  };

  const handleTableOpen = (table) => {
    setTables(prev => prev.map(t =>
      t.id === table.id ? { ...t, status: 'occupied' } : t
    ));
    setSelectedTable(table);
    setActiveTab('pos');
  };

  const handleOrderComplete = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
    setInventory(prev => deductOrderStock(prev, newOrder));
    setAllCarts(prev => ({ ...prev, [cartKey]: [] }));
    if (selectedTable) {
      setTables(prev => prev.map(t =>
        t.id === selectedTable.id ? { ...t, status: 'occupied' } : t
      ));
    }
    const isTakeoutOrder = !selectedTable;
    setSelectedTable(null);
    if (!isTakeoutOrder) setActiveTab('tables');
    registerAuditLog('ORDEN_CREADA', `ID: ${newOrder.id} - Total: ${formatCurrency(newOrder.total)}`, currentUser);
  };

  const handleCharge = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
    setInventory(prev => deductOrderStock(prev, newOrder));
    setAllCarts(prev => ({ ...prev, [cartKey]: [] }));
    if (selectedTable) {
      setTables(prev => prev.map(t =>
        t.id === selectedTable.id ? { ...t, status: 'pending' } : t
      ));
    }
    setSelectedTable(null);
    setCashierOrderId(newOrder.id);
    setActiveTab('cashier');

    // award loyalty points
    if (newOrder.customer) {
      const pointsEarned = Math.floor(newOrder.total / 1000);
      setCustomers(prev => prev.map(c => {
        if (c.id !== newOrder.customer.id) return c;
        return { 
          ...c, 
          totalSpent: (c.totalSpent || 0) + newOrder.total,
          orderCount: (c.orderCount || 0) + 1,
          points: (c.points || 0) + pointsEarned,
          lastVisit: new Date().toISOString()
        };
      }));
    }

    registerAuditLog('PAGO_INICIADO', `ID: ${newOrder.id} - Total: ${formatCurrency(newOrder.total)}`, currentUser);
  };

  const handleCancelItem = (orderId, item, reason = 'Cancelación manual') => {
    setModal({
      isOpen: true,
      title: '¿Confirmar Cancelación?',
      message: `¿Estás seguro de cancelar ${item.quantity}x ${item.name} de la orden ${orderId}? El stock se restaurará automáticamente.`,
      type: 'danger',
      requirePin: settings.pinRefunds,
      onConfirm: () => {
        setOrders(prev => prev.map(o => {
          if (o.id !== orderId) return o;
          const newItems = o.items.filter(i => (i.cartId || i.id) !== (item.cartId || item.id));
          const newTotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0) * (1 + (!isNaN(parseFloat(settings.taxRate)) ? parseFloat(settings.taxRate) : 8) / 100);
          return { ...o, items: newItems, total: newTotal };
        }));
        setInventory(prev => restoreItemStock(prev, item));
        setModal(p => ({ ...p, isOpen: false }));
        registerAuditLog('ITEM_CANCELADO', `${item.quantity}x ${item.name} de ${orderId}. Motivo: ${reason}`, currentUser);
      }
    });
  };

  const handleMoveTable = (targetTable) => {
    const sourceId = selectedTable?.id ?? 'takeout';
    setAllCarts(prev => {
      const sourceCart = prev[sourceId] || [];
      const targetCart = prev[targetTable.id] || [];
      const merged = [...targetCart];
      sourceCart.forEach(srcItem => {
        const existing = merged.find(i => i.id === srcItem.id);
        if (existing) existing.quantity += srcItem.quantity;
        else merged.push({ ...srcItem });
      });
      return { ...prev, [targetTable.id]: merged, [sourceId]: [] };
    });
    setTables(prev => prev.map(t => {
      if (t.id === sourceId)       return { ...t, status: 'free' };
      if (t.id === targetTable.id) return { ...t, status: 'occupied' };
      return t;
    }));
    setSelectedTable(targetTable);
  };

  const handleClearCart = (onConfirm) => {
    setModal({
      isOpen: true,
      title: '¿Vaciar Carrito?',
      message: '¿Estás seguro de que deseas eliminar todos los productos del pedido actual?',
      type: 'warning',
      requirePin: settings.pinVoids,
      onConfirm: () => {
        onConfirm();
        setModal(p => ({ ...p, isOpen: false }));
        registerAuditLog('CARRITO_VACIADO', `Mesa: ${selectedTable?.id || 'LLEVAR'}`, currentUser);
      }
    });
  };

  if (window.location.pathname === '/pair') return <PairingPage />;
  if (showLanding) return <LandingPage onEnter={() => setShowLanding(false)} settings={settings} />;

  const currentLabel = activeTab === 'pos'
    ? (selectedTable ? `Mesa ${selectedTable.name || selectedTable.id}` : 'Para Llevar')
    : ALL_ITEMS.find(m => m.id === activeTab)?.label;

  let itemIdx = 0;

  if (!currentUser) {
    return (
      <LoginScreen 
        staff={staff} 
        settings={settings}
        onLogin={(user, isAuth) => {
          setCurrentUser(user);
          setIsAuthenticated(isAuth);
        }} 
      />
    );
  }

  return (
    <div className="app-container">
      <div className="app-bg" />

      {/* ─── Sidebar ─────────────────────────────────── */}
      <motion.aside
        className="sidebar-new"
        animate={{ width: isExpanded ? 224 : 64 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo-new" style={{ overflow: 'hidden' }}>
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
            ) : (
              <Coffee size={18} strokeWidth={2.2} />
            )}
          </div>
          <motion.span
            className="sidebar-brand"
            animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
            transition={{ duration: isExpanded ? 0.22 : 0.12, delay: isExpanded ? 0.05 : 0 }}
            style={{ pointerEvents: 'none', overflow: 'hidden', whiteSpace: 'nowrap' }}
          >
            FastPOS
          </motion.span>
          <motion.button
            className="sidebar-toggle"
            onClick={() => setPinned(v => !v)}
            animate={{ opacity: isExpanded ? 1 : 0, scale: isExpanded ? 1 : 0.8 }}
            transition={{ duration: 0.18 }}
            title={pinned ? 'Desanclar' : 'Anclar abierto'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={pinned ? 'pinned' : 'unpinned'}
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 30, opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex' }}
              >
                {pinned ? <PinOff size={15} strokeWidth={2} /> : <Pin size={15} strokeWidth={2} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_GROUPS.map((group) => {
            // Filter items based on permissions
            const visibleItems = group.items.filter(item => 
              currentUser?.permissions?.includes(item.id) || 
              currentUser?.role === 'Gerente' || 
              currentUser?.role === 'Administrador'
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label} className="sidebar-group">
                <motion.span
                  className="sidebar-section"
                  animate={{ opacity: isExpanded ? 0.5 : 0 }}
                  transition={{ duration: isExpanded ? 0.18 : 0.1, delay: isExpanded ? 0.04 : 0 }}
                  style={{ pointerEvents: 'none', overflow: 'hidden', whiteSpace: 'nowrap' }}
                >
                  {group.label}
                </motion.span>

                {visibleItems.map((item) => {
                  const idx      = itemIdx++;
                  const Icon     = item.icon;
                  const isActive = activeTab === item.id && (item.id !== 'pos' || !selectedTable);
                  const delay    = isExpanded ? 0.06 + idx * 0.035 : 0;
                  const takeoutCount = item.id === 'pos'
                    ? (allCarts['takeout'] || []).reduce((s, i) => s + i.quantity, 0)
                    : 0;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`sidebar-nav-item${isActive ? ' active' : ''}`}
                      title={!isExpanded ? item.label : undefined}
                    >
                      <span className="sidebar-nav-icon" style={{ position: 'relative' }}>
                        <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                        {takeoutCount > 0 && (
                          <span style={{
                            position: 'absolute', top: -5, right: -5,
                            width: 14, height: 14, borderRadius: '50%',
                            background: 'var(--accent-primary)', color: '#fff',
                            fontSize: 9, fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {takeoutCount}
                          </span>
                        )}
                      </span>
                      <motion.span
                        className="sidebar-nav-label"
                        animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -8 }}
                        transition={{ duration: isExpanded ? 0.24 : 0.12, delay, ease: [0.16, 1, 0.3, 1] }}
                        style={{ pointerEvents: 'none', overflow: 'hidden', whiteSpace: 'nowrap' }}
                      >
                        {item.label}
                        {takeoutCount > 0 && isExpanded && (
                          <span style={{
                            marginLeft: 6, padding: '1px 6px', borderRadius: 9,
                            background: 'var(--accent-primary)', color: '#fff',
                            fontSize: 10, fontWeight: 700,
                          }}>
                            {takeoutCount}
                          </span>
                        )}
                      </motion.span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User */}
        <div className="sidebar-user">
          <div className="sidebar-user-avatar" style={{ position: 'relative' }}>
            <img 
              src={currentUser.img || "https://api.dicebear.com/7.x/avataaars/svg?seed=Chef"} 
              alt={currentUser.name} 
            />
            <div 
              onClick={() => setIsAuthenticated(v => !v)}
              style={{
                position: 'absolute', bottom: -2, right: -2,
                width: 16, height: 16, borderRadius: '50%',
                background: (isAuthenticated || currentUser?.role === 'Gerente' || currentUser?.role === 'Administrador') ? 'var(--success)' : 'var(--danger)',
                border: '2px solid var(--bg-surface)',
                cursor: 'pointer'
              }}
              title={isAuthenticated ? 'Sesión Administrativa Activa' : 'Sesión Bloqueada'}
            />
          </div>
          <motion.div
            className="sidebar-user-info"
            animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -8 }}
            transition={{ duration: isExpanded ? 0.22 : 0.1, delay: isExpanded ? 0.08 : 0 }}
            style={{ overflow: 'hidden' }}
          >
            <span className="sidebar-user-name">{currentUser?.name || 'Usuario'}</span>
            <div className="flex items-center gap-2">
              <span className="sidebar-user-role">{currentUser?.role || 'Personal'}</span>
              <button onClick={handleLogout} className="opacity-40 hover:opacity-100 transition-opacity" title="Cerrar Sesión">
                <LogOut size={12} className="text-danger" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.aside>

      {/* ─── Main ───────────────────────────────────────── */}
      <main className="main-layout">
        <header className="top-header">
          <div className="flex items-center gap-2">
            {/* Restaurant logo in header */}
            {settings.logoUrl && (
              <img src={settings.logoUrl} alt="Logo" style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }} />
            )}
            <span className="text-sm font-medium text-text-secondary serif-accent italic">
              {settings.restaurantName}
            </span>
            <span className="text-text-tertiary">/</span>
            <span className="text-sm font-medium text-text-primary">{currentLabel}</span>
          </div>

          <div className="command-bar" onClick={() => setShowSearch(true)}>
            <Search size={15} className="text-text-tertiary" />
            <span className="text-sm text-text-tertiary flex-1">Buscar funciones o platos...</span>
            <div className="flex items-center gap-1">
              <span className="shortcut-key"><Command size={10} className="inline" /></span>
              <span className="shortcut-key">K</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full flex-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative">
              <Bell size={17} className="text-text-secondary" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-accent-primary rounded-full" />
            </button>
          </div>
        </header>

        <div className="page-content scroll-hide">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeTab === 'pos' ? `pos-${cartKey}` : activeTab}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{    opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              {activeTab === 'dashboard' && <DashboardModule orders={orders} settings={settings} />}
              {activeTab === 'tables'    && (
                <TableMap
                  tables={effectiveTables}
                  setTables={setTables}
                  allCarts={allCarts}
                  tableCartCount={tableCartCount}
                  onSelectTable={handleTableOpen}
                  settings={settings}
                  onOpenModal={handleOpenModal}
                  onCloseModal={closeModal}
                />
              )}
              {activeTab === 'pos'       && (
                <POSModule
                  mode={selectedTable ? 'table' : 'takeout'}
                  selectedTable={selectedTable}
                  tables={effectiveTables}
                  cart={currentCart}
                  products={products}
                  categories={categories}
                  onCartChange={setCurrentCart}
                  onOrderComplete={handleOrderComplete}
                  onCharge={handleCharge}
                  onMoveTable={handleMoveTable}
                  onClearCart={handleClearCart}
                  settings={settings}
                  customers={customers}
                  promotions={promotions}
                />
              )}
              {activeTab === 'kitchen'   && <KitchenDisplay orders={orders} setOrders={setOrders} onCancelItem={handleCancelItem} settings={settings} />}
              {activeTab === 'cashier'   && <CashierModule  orders={orders} setOrders={setOrders} settings={settings} initialOrderId={cashierOrderId} onCancelItem={handleCancelItem} />}
              {activeTab === 'inventory' && <InventoryModule settings={settings} inventory={inventory} setInventory={setInventory} />}
              {activeTab === 'menu'      && (
                <MenuModule 
                  products={products} 
                  setProducts={setProducts} 
                  categories={categories} 
                  setCategories={setCategories} 
                  tables={tables}
                  setTables={setTables}
                  onOpenModal={handleOpenModal}
                  onCloseModal={closeModal}
                  inventory={inventory}
                />
              )}
              {activeTab === 'shifts'    && (
                <CashControlModule 
                  shifts={shifts} 
                  setShifts={setShifts} 
                  activeShiftId={activeShiftId} 
                  setActiveShiftId={setActiveShiftId} 
                  orders={orders} 
                  expenses={expenses}
                  currentUser={currentUser}
                />
              )}
              {activeTab === 'expenses'  && <ExpensesModule expenses={expenses} setExpenses={setExpenses} currentUser={currentUser} activeShiftId={activeShiftId} />}
              { activeTab === 'reports'   && <ReportsModule   orders={orders} setOrders={setOrders} settings={settings} products={products} />}
              { activeTab === 'history'   && <HistoryModule   orders={orders} settings={settings} />}
              { activeTab === 'audit'     && <AuditModule />}
              { activeTab === 'customers' && <CustomersModule customers={customers} setCustomers={setCustomers} />}
              { activeTab === 'promotions'&& <PromotionsModule promotions={promotions} setPromotions={setPromotions} />}
              { activeTab === 'suppliers' && <SuppliersModule inventory={inventory} setInventory={setInventory} />}
              { activeTab === 'users'     && <UsersModule staff={staff} setStaff={setStaff} currentUser={currentUser} setCurrentUser={setCurrentUser} />}
              {activeTab === 'settings'  && (
                <SettingsModule
                  settings={settings}
                  onSettingsSaved={handleSettingsSaved}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center pt-[15vh] px-6"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="w-full max-w-xl bg-bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden h-fit"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <Search size={20} className="text-accent-primary" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Escribe para buscar..."
                  className="bg-transparent border-none outline-none text-lg text-white w-full"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2 scroll-hide">
                {commandItems.map(item => (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowSearch(false);
                      setSearchQuery('');
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex-center text-text-tertiary">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.label}</p>
                      <p className="text-[10px] text-text-tertiary uppercase tracking-widest font-semibold">Módulo</p>
                    </div>
                  </button>
                ))}
                {commandItems.length === 0 && (
                  <div className="p-8 text-center text-text-tertiary">
                    No se encontraron resultados para "{searchQuery}"
                  </div>
                )}
              </div>
              <div className="p-3 bg-bg-base/50 border-t border-white/5 flex-between text-[10px] text-text-tertiary font-bold uppercase tracking-widest px-6">
                <span>Navegar con ↑ ↓</span>
                <span>Enter para seleccionar</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Confirm Modal */}
      <ConfirmModal 
        isOpen={modal.isOpen}
        onClose={() => setModal(p => ({ ...p, isOpen: false }))}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        requirePin={modal.requirePin}
        pinValue={settings.masterPin}
      />
    </div>
  );
}

export default App;
