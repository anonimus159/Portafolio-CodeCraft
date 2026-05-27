import { motion } from 'framer-motion';
import { Truck, Package, Phone, Mail, ExternalLink, Plus, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const mockSuppliers = [
  { id: 'SUP-001', name: 'Laboratorios Genfar', category: 'Genéricos', status: 'active', orders: 145, lastOrder: '2023-10-20', contact: 'ventas@genfar.com', phone: '+57 300 123 4567' },
  { id: 'SUP-002', name: 'Pfizer Inc.', category: 'Patentes', status: 'active', orders: 89, lastOrder: '2023-10-15', contact: 'distribucion@pfizer.com', phone: '+57 310 987 6543' },
  { id: 'SUP-003', name: 'Bayer AG', category: 'Consumo', status: 'inactive', orders: 34, lastOrder: '2023-08-11', contact: 'pedidos@bayer.com', phone: '+57 315 555 5555' },
];

export const Suppliers = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Proveedores B2B</h1>
          <p className="text-muted-foreground mt-1">Gestión de laboratorios y distribuidores farmacéuticos.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-sm active:scale-95">
          <Plus className="w-4 h-4" />
          Nuevo Proveedor
        </button>
      </div>

      {/* Alerta de Stock Crítico Automática */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4"
      >
        <div className="p-2 bg-red-500/20 text-red-600 rounded-xl mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-red-600">Alerta de Stock Crítico (Automatizada)</h3>
          <p className="text-sm text-red-600/80 mt-1">El inventario de "Losartán 50mg" y "Amoxicilina 500mg" está por debajo del 10%. Se sugiere emitir una Orden de Compra a Laboratorios Genfar.</p>
          <div className="mt-3 flex gap-3">
            <button className="text-xs font-bold text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors">
              Generar Orden Automática
            </button>
            <button className="text-xs font-bold text-red-600 hover:underline px-2 py-1.5">
              Ignorar
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockSuppliers.map((supplier, idx) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="p-6 bg-card border border-border rounded-2xl shadow-sm group hover:border-primary/30 transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-muted rounded-xl text-foreground">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg leading-tight">{supplier.name}</h3>
                  <p className="text-xs text-muted-foreground">{supplier.category}</p>
                </div>
              </div>
              <span className={clsx(
                "px-2 py-1 text-xs font-medium rounded-md border",
                supplier.status === 'active' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"
              )}>
                {supplier.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="space-y-2 mt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4" />
                <span>Órdenes completadas: <strong className="text-foreground">{supplier.orders}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{supplier.contact}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{supplier.phone}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Último pedido: {supplier.lastOrder}</span>
              <button className="text-primary hover:text-primary/80 transition-colors p-1">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
