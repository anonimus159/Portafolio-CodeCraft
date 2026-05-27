import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Mail, Phone, MapPin, MoreVertical, Star } from 'lucide-react';
import clsx from 'clsx';

const mockCustomers = [
  { id: 'CUS-001', name: 'Ana García', email: 'ana.g@example.com', phone: '+57 300 123 4567', points: 1250, status: 'active', lastPurchase: 'Hace 2 días' },
  { id: 'CUS-002', name: 'Carlos Mendoza', email: 'carlos.m@example.com', phone: '+57 301 987 6543', points: 450, status: 'active', lastPurchase: 'Hace 1 semana' },
  { id: 'CUS-003', name: 'Laura Restrepo', email: 'laura.r@example.com', phone: '+57 320 555 1234', points: 3200, status: 'vip', lastPurchase: 'Hoy' },
  { id: 'CUS-004', name: 'Miguel Ángel Ruiz', email: 'miguel.r@example.com', phone: '+57 315 444 9876', points: 120, status: 'inactive', lastPurchase: 'Hace 3 meses' },
];

export const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockCustomers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pacientes & Clientes</h1>
          <p className="text-muted-foreground text-sm mt-1">Directorio, fidelización y contacto directo.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <UserPlus className="w-4 h-4" />
          Añadir Cliente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl"><UserPlus className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
            <h3 className="text-2xl font-bold">1,248</h3>
          </div>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-xl"><Star className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Clientes VIP</p>
            <h3 className="text-2xl font-bold">156</h3>
          </div>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><MapPin className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Con Domicilio</p>
            <h3 className="text-2xl font-bold">892</h3>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar paciente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4 font-medium text-sm text-muted-foreground">Cliente</th>
                <th className="p-4 font-medium text-sm text-muted-foreground">Contacto</th>
                <th className="p-4 font-medium text-sm text-muted-foreground">Puntos (Fidelidad)</th>
                <th className="p-4 font-medium text-sm text-muted-foreground">Última Compra</th>
                <th className="p-4 font-medium text-sm text-muted-foreground">Estado</th>
                <th className="p-4 font-medium text-sm text-muted-foreground text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((customer, index) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  key={customer.id} 
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-3.5 h-3.5" /> {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-3.5 h-3.5" /> {customer.phone}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                      <Star className="w-4 h-4 fill-current" /> {customer.points} pts
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{customer.lastPurchase}</td>
                  <td className="p-4">
                    <span className={clsx(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      customer.status === 'vip' && "bg-yellow-500/10 text-yellow-600",
                      customer.status === 'active' && "bg-emerald-500/10 text-emerald-500",
                      customer.status === 'inactive' && "bg-muted text-muted-foreground"
                    )}>
                      {customer.status === 'vip' ? 'VIP' : customer.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
