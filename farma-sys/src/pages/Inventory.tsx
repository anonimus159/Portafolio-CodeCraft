import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, Edit, Trash2 } from 'lucide-react';
import clsx from 'clsx';

const mockInventory = [
  { id: 'MED-001', name: 'Paracetamol 500mg', category: 'Analgésico', stock: 1200, price: 1.50, expiry: '2027-12-01', status: 'good' },
  { id: 'MED-002', name: 'Amoxicilina 500mg', category: 'Antibiótico', stock: 150, price: 5.20, expiry: '2026-08-15', status: 'warning' },
  { id: 'MED-003', name: 'Ibuprofeno 400mg', category: 'AINEs', stock: 850, price: 2.10, expiry: '2028-01-20', status: 'good' },
  { id: 'MED-004', name: 'Vitamina C + Zinc', category: 'Suplemento', stock: 45, price: 8.50, expiry: '2026-06-10', status: 'warning' },
  { id: 'MED-005', name: 'Loratadina 10mg', category: 'Antihistamínico', stock: 5, price: 3.40, expiry: '2026-05-28', status: 'critical' },
  { id: 'MED-006', name: 'Omeprazol 20mg', category: 'Antiácido', stock: 540, price: 4.80, expiry: '2027-03-11', status: 'good' },
  { id: 'MED-007', name: 'Salbutamol Inhalador', category: 'Broncodilatador', stock: 12, price: 12.00, expiry: '2026-05-20', status: 'critical' },
];

export const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = mockInventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventario</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestión de medicamentos, stock y alertas de vencimiento.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Nuevo Medicamento
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card border border-border rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden"
      >
        {/* Table Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar por código o nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" />
            Filtros Avanzados
          </button>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4 font-medium text-sm text-muted-foreground">Código</th>
                <th className="p-4 font-medium text-sm text-muted-foreground">Nombre</th>
                <th className="p-4 font-medium text-sm text-muted-foreground">Categoría</th>
                <th className="p-4 font-medium text-sm text-muted-foreground">Stock</th>
                <th className="p-4 font-medium text-sm text-muted-foreground">Precio Unit.</th>
                <th className="p-4 font-medium text-sm text-muted-foreground">Vencimiento</th>
                <th className="p-4 font-medium text-sm text-muted-foreground">Estado</th>
                <th className="p-4 font-medium text-sm text-muted-foreground text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInventory.map((item, index) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  key={item.id} 
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="p-4 text-sm font-medium text-muted-foreground">{item.id}</td>
                  <td className="p-4 text-sm font-bold text-foreground">{item.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-foreground">{item.stock} und.</td>
                  <td className="p-4 text-sm text-foreground">${item.price.toFixed(2)}</td>
                  <td className="p-4 text-sm text-muted-foreground">{item.expiry}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={clsx(
                        "w-2.5 h-2.5 rounded-full animate-pulse",
                        item.status === 'good' && "bg-emerald-500",
                        item.status === 'warning' && "bg-yellow-500",
                        item.status === 'critical' && "bg-red-500"
                      )}></span>
                      <span className={clsx(
                        "text-xs font-medium",
                        item.status === 'good' && "text-emerald-500",
                        item.status === 'warning' && "text-yellow-600",
                        item.status === 'critical' && "text-red-500"
                      )}>
                        {item.status === 'good' ? 'Óptimo' : item.status === 'warning' ? 'Precaución' : 'Crítico'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredInventory.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              No se encontraron medicamentos.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
