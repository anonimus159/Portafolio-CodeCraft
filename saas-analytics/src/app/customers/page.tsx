"use client";

import { motion } from "framer-motion";
import { Search, MoreHorizontal, Filter } from "lucide-react";

const customers = [
  { id: 1, name: "Empresa Alpha", contact: "carlos@alpha.com", plan: "Enterprise", spent: "$12,500", status: "Activo" },
  { id: 2, name: "Beta Corp", contact: "maria@betacorp.com", plan: "Pro", spent: "$3,200", status: "Activo" },
  { id: 3, name: "Gamma Startups", contact: "luis@gamma.io", plan: "Basic", spent: "$450", status: "Inactivo" },
  { id: 4, name: "Delta Global", contact: "ana@delta.com", plan: "Enterprise", spent: "$28,000", status: "Activo" },
  { id: 5, name: "Epsilon Tech", contact: "jorge@epsilon.tech", plan: "Pro", spent: "$4,100", status: "Activo" },
];

export default function CustomersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Directorio de Clientes</h1>
          <p className="text-muted-foreground mt-1 text-sm">Gestiona tus cuentas y planes de suscripción.</p>
        </div>
        <button className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md shadow-sm hover:bg-foreground/90 transition-colors">
          Añadir Cliente
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md w-full max-w-sm">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Buscar clientes..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          <button className="p-2 border border-border rounded-md hover:bg-muted/50 text-muted-foreground">
            <Filter className="w-4 h-4" />
          </button>
        </div>
        
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Cliente</th>
              <th className="px-6 py-4 font-medium">Plan</th>
              <th className="px-6 py-4 font-medium">Gasto Total</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.contact}</div>
                </td>
                <td className="px-6 py-4 font-medium">{c.plan}</td>
                <td className="px-6 py-4">{c.spent}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${c.status === 'Activo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
