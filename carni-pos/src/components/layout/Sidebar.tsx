import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  MonitorSpeaker, 
  Package, 
  Scissors, 
  ThermometerSnowflake, 
  Beef,
  LogOut,
  Users,
  X,
  Wallet,
  ChefHat,
  Truck
} from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard Proactivo', path: '/dashboard' },
  { icon: MonitorSpeaker, label: 'Punto de Venta (POS)', path: '/pos' },
  { icon: Wallet, label: 'Caja y Transacciones', path: '/cash-register' },
  { icon: Scissors, label: 'Cortes y Rendimiento', path: '/cuts' },
  { icon: ChefHat, label: 'Producción y Derivados', path: '/production' },
  { icon: Package, label: 'Inventario y Trazabilidad', path: '/inventory' },
  { icon: Truck, label: 'Proveedores y Compras', path: '/suppliers' },
  { icon: ThermometerSnowflake, label: 'Refrigeración', path: '/refrigeration' },
  { icon: Users, label: 'Gestión de Clientes', path: '/customers' },
];

export const Sidebar = ({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) => {
  const location = useLocation();

  const sidebarContent = (
    <aside className="w-64 h-full flex-shrink-0 border-r border-border bg-card/95 backdrop-blur-md lg:bg-card/50 glass flex flex-col justify-between">
      <div>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border/50">
          <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2 text-primary font-bold text-xl">
            <Beef className="w-7 h-7" />
            <span>CarniPOS</span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={onClose}
                className={clsx(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group font-medium",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                )}
              >
                <Icon className={clsx("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border/50">
        <Link 
          to="/login"
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group font-medium border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-5 h-5 group-hover:text-red-500" />
          Cerrar Sesión
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        {sidebarContent}
      </div>
    </>
  );
};
