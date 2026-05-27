
import { Bell, Search, User } from 'lucide-react';

export const Topbar = () => {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 glass z-10 sticky top-0">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar por lote, código o proveedor (Ctrl+K)..." 
            className="w-full bg-muted/50 border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/70"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-card"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground">Carlos Admin</p>
            <p className="text-xs text-muted-foreground">Gerente Bodega</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};
