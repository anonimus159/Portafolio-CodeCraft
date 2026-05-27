import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Star, Crown, History, ShoppingBag, ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';

const mockCustomers = [
  { id: 1, name: 'Restaurante El Fogón', type: 'B2B', loyalty: 'Platinum', totalSpent: 12500000, lastPurchase: 'Hace 2 horas', frequency: 'Alta' },
  { id: 2, name: 'Asadero Los Pinos', type: 'B2B', loyalty: 'Gold', totalSpent: 8400000, lastPurchase: 'Ayer', frequency: 'Alta' },
  { id: 3, name: 'Carlos Mendoza', type: 'B2C', loyalty: 'Silver', totalSpent: 1200000, lastPurchase: 'Hace 3 días', frequency: 'Media' },
  { id: 4, name: 'Hotel Continental', type: 'B2B', loyalty: 'Platinum', totalSpent: 24500000, lastPurchase: 'Hoy', frequency: 'Alta' },
  { id: 5, name: 'María Fernanda Ríos', type: 'B2C', loyalty: 'Bronze', totalSpent: 450000, lastPurchase: 'Hace 1 semana', frequency: 'Baja' },
];

export const Customers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Gestión de Clientes</h1>
          <p className="text-muted-foreground mt-1">Historial de compras y fidelización (B2B/B2C).</p>
        </div>
        <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
          <Users className="w-4 h-4" /> Nuevo Cliente
        </button>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Left Panel: Customer List */}
        <div className="flex-1 glass rounded-2xl border border-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-muted/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Buscar cliente, restaurante o ID..." 
                className="w-full bg-background border border-border rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {mockCustomers.map(customer => (
              <button
                key={customer.id}
                onClick={() => setSelectedCustomer(customer)}
                className={clsx(
                  "w-full text-left p-4 rounded-xl border transition-all hover:border-primary/50 group",
                  selectedCustomer?.id === customer.id ? "bg-primary/10 border-primary" : "bg-card border-border hover:bg-muted/50"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground">{customer.name}</h3>
                    <span className={clsx(
                      "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold",
                      customer.type === 'B2B' ? "bg-blue-500/20 text-blue-500" : "bg-emerald-500/20 text-emerald-500"
                    )}>
                      {customer.type}
                    </span>
                  </div>
                  {customer.loyalty === 'Platinum' && <Crown className="w-4 h-4 text-yellow-500" />}
                  {customer.loyalty === 'Gold' && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Compras</p>
                    <p className="font-medium text-foreground">${customer.totalSpent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Última Venta</p>
                    <p className="font-medium text-foreground">{customer.lastPurchase}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Customer Details */}
        <div className="w-[450px] glass rounded-2xl border border-border flex flex-col overflow-hidden bg-card/30">
          <AnimatePresence mode="wait">
            {selectedCustomer ? (
              <motion.div
                key={selectedCustomer.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <div className="p-6 border-b border-border bg-muted/10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                      <Users className="w-8 h-8" />
                    </div>
                    <div className={clsx(
                      "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1",
                      selectedCustomer.loyalty === 'Platinum' ? "bg-gradient-to-r from-gray-200 to-gray-400 text-gray-900" :
                      selectedCustomer.loyalty === 'Gold' ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {selectedCustomer.loyalty === 'Platinum' && <Crown className="w-3 h-3" />}
                      {selectedCustomer.loyalty} Member
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">{selectedCustomer.name}</h2>
                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <span className={clsx("w-2 h-2 rounded-full", selectedCustomer.type === 'B2B' ? 'bg-blue-500' : 'bg-emerald-500')} />
                    Cliente {selectedCustomer.type}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background rounded-xl p-4 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Frecuencia de Compra</p>
                      <p className="text-lg font-bold text-foreground">{selectedCustomer.frequency}</p>
                    </div>
                    <div className="bg-background rounded-xl p-4 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Volumen Promedio</p>
                      <p className="text-lg font-bold text-primary">125 KG / mes</p>
                    </div>
                  </div>

                  {/* Purchase History */}
                  <div>
                    <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
                      <History className="w-4 h-4 text-primary" /> Historial de Compras Recientes
                    </h3>
                    <div className="space-y-3">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border hover:border-primary/30 transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-foreground">Ticket #00{894 - i}</p>
                              <p className="text-xs text-muted-foreground">Hace {i + 1} días • 4 items</p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <p className="font-bold text-sm">${(850000 - (i * 120000)).toLocaleString()}</p>
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tactical Promotions */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                    <h3 className="font-bold text-primary mb-2 text-sm">Precios Dinámicos Activos</h3>
                    <p className="text-xs text-muted-foreground mb-3">Este cliente tiene asignada una tabla de precios preferencial.</p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded text-[10px] font-bold uppercase tracking-wider">
                        -10% en Cortes Res
                      </span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-[10px] font-bold uppercase tracking-wider">
                        -5% Pescados
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center"
              >
                <Users className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-medium">Seleccione un cliente para ver sus detalles, historial de compras y nivel de lealtad.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
