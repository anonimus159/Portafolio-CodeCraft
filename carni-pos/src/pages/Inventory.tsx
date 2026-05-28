import { Package, Search, Filter, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';
import { useStore } from '../store/useStore';

export const Inventory = () => {
  const inventoryData = useStore(state => state.inventory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Inventario de Bodega</h1>
          <p className="text-muted-foreground mt-1">Control de stock en tiempo real por peso (KG).</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast.info("Abriendo formulario para escanear código de barras de canal/lote...")} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            <Package className="w-4 h-4" /> Registrar Ingreso
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border/50 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar producto, corte o lote..." 
              className="w-full bg-background border border-border rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button onClick={() => toast.info("Abriendo panel avanzado de filtros y búsqueda por categoría...")} className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-sm font-medium rounded-xl border border-border flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filtros
          </button>
        </div>

        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="p-4 font-medium text-muted-foreground text-sm">Producto</th>
                <th className="p-4 font-medium text-muted-foreground text-sm">Categoría</th>
                <th className="p-4 font-medium text-muted-foreground text-sm">Lote / Trazabilidad</th>
                <th className="p-4 font-medium text-muted-foreground text-sm text-right">Stock Actual</th>
                <th className="p-4 font-medium text-muted-foreground text-sm text-center">Frescura</th>
                <th className="p-4 font-medium text-muted-foreground text-sm text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {inventoryData.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded">LOTE-{item.id}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xl font-bold text-foreground">{item.stock.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">Und/KG</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-xs font-bold px-2 py-1 rounded-md text-foreground bg-muted">
                        {item.freshness}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className={clsx(
                        "inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold",
                        item.status === 'good' && "bg-green-500/10 text-green-500",
                        item.status === 'warning' && "bg-yellow-500/10 text-yellow-500",
                        item.status === 'critical' && "bg-red-500/10 text-red-500 border border-red-500/20"
                      )}>
                        {item.status === 'critical' && <AlertCircle className="w-3 h-3" />}
                        {item.status === 'good' ? 'Normal' : item.status === 'warning' ? 'Bajo' : 'Crítico'}
                      </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
