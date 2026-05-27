import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, ShoppingCart, Users, Settings, Activity, FileText, Truck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // You might need a global state or a context to open it from anywhere, 
          // but for simplicity we assume it's controlled by Layout.
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const navigationItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
    { name: 'Inventario', icon: <ShoppingCart className="w-5 h-5" />, path: '/inventory' },
    { name: 'Punto de Venta (POS)', icon: <ShoppingCart className="w-5 h-5" />, path: '/pos' },
    { name: 'Analíticas', icon: <Activity className="w-5 h-5" />, path: '/analytics' },
    { name: 'Recetas Médicas', icon: <FileText className="w-5 h-5" />, path: '/prescriptions' },
    { name: 'Proveedores', icon: <Truck className="w-5 h-5" />, path: '/suppliers' },
    { name: 'Pacientes', icon: <Users className="w-5 h-5" />, path: '/customers' },
    { name: 'Configuración', icon: <Settings className="w-5 h-5" />, path: '/settings' },
  ];

  const filteredItems = navigationItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center px-4 py-4 border-b border-border/50">
                <Search className="w-6 h-6 text-muted-foreground mr-3" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Buscar medicamentos, pacientes, o ir a..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground"
                />
                <button 
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-2 overflow-y-auto">
                {filteredItems.length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Sugerencias de Navegación
                    </div>
                    {filteredItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelect(item.path)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/10 hover:text-primary text-foreground transition-colors text-left group"
                      >
                        <div className="text-muted-foreground group-hover:text-primary transition-colors">
                          {item.icon}
                        </div>
                        <span className="font-medium text-sm">{item.name}</span>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-md">Ir</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto opacity-20 mb-4" />
                    <p>No se encontraron resultados para "{query}"</p>
                  </div>
                )}
              </div>
              
              <div className="bg-muted/30 px-4 py-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><kbd className="bg-muted px-1.5 py-0.5 rounded border border-border">↑</kbd> <kbd className="bg-muted px-1.5 py-0.5 rounded border border-border">↓</kbd> Navegar</span>
                  <span className="flex items-center gap-1"><kbd className="bg-muted px-1.5 py-0.5 rounded border border-border">Enter</kbd> Seleccionar</span>
                </div>
                <span><kbd className="bg-muted px-1.5 py-0.5 rounded border border-border">Esc</kbd> Cerrar</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
