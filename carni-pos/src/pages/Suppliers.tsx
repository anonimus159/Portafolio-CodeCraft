import { useState } from 'react';
import { 
  Truck, 
  Search, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const initialSuppliers = [
  { id: 'PRV-001', name: 'Ganadería La Ponderosa', type: 'Canal Bovino', lastDelivery: 'Hace 2 días', status: 'active', rating: 4.8 },
  { id: 'PRV-002', name: 'Distribuidora Porcina del Valle', type: 'Canal Porcino', lastDelivery: 'Hoy', status: 'active', rating: 4.5 },
  { id: 'PRV-003', name: 'Insumos y Empaques S.A.', type: 'Insumos', lastDelivery: 'Hace 1 semana', status: 'pending', rating: 4.0 },
];

export const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleNewOrder = () => {
    toast.info('Abriendo formulario de Orden de Compra...', {
      description: 'Esta función permite registrar la entrada de ganado pesado en pie o canal.'
    });
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)] min-h-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Proveedores y Compras</h1>
          <p className="text-muted-foreground mt-1">Gestión de abastecimiento, canales y órdenes de compra.</p>
        </div>
        <button 
          onClick={handleNewOrder}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition-all"
        >
          <Truck className="w-4 h-4" /> Registrar Ingreso / Pesaje
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        <div className="w-full glass rounded-3xl border border-border flex flex-col overflow-hidden">
          
          {/* Header & Search */}
          <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 justify-between items-center bg-muted/10">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Buscar proveedor por nombre o NIT..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-sm font-medium rounded-xl border border-border flex items-center gap-2 transition-colors w-full md:w-auto justify-center">
              <Plus className="w-4 h-4" /> Nuevo Proveedor
            </button>
          </div>

          {/* Suppliers Table/List */}
          <div className="flex-1 overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-muted/30 border-b border-border/50">
                  <th className="p-4 font-medium text-muted-foreground text-sm">Proveedor</th>
                  <th className="p-4 font-medium text-muted-foreground text-sm">Categoría</th>
                  <th className="p-4 font-medium text-muted-foreground text-sm">Última Entrega</th>
                  <th className="p-4 font-medium text-muted-foreground text-sm">Calificación</th>
                  <th className="p-4 font-medium text-muted-foreground text-sm">Estado</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {initialSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{supplier.name}</span>
                        <span className="text-xs text-muted-foreground">{supplier.id}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50">
                        {supplier.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {supplier.lastDelivery}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{supplier.rating}</span>
                        <span className="text-yellow-500 text-xs">★</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {supplier.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                          <AlertCircle className="w-3.5 h-3.5" /> En Revisión
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};
