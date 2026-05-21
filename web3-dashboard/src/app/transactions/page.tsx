"use client";

import { BentoCard } from "@/components/ui/BentoCard";
import { ArrowDownLeft, ArrowUpRight, RefreshCw, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

const transactions = [
  { id: "TX-1", type: "recibir", asset: "BTC", amount: "+0.5 BTC", value: "$22,500.00", from: "Externa (0x4a...9b)", date: "Hoy, 14:30", status: "Completado" },
  { id: "TX-2", type: "enviar", asset: "USDC", amount: "-1000 USDC", value: "$1,000.00", from: "Para 0x8f...3a2b", date: "Hoy, 09:15", status: "Completado" },
  { id: "TX-3", type: "intercambio", asset: "ETH", amount: "5 ETH → SOL", value: "$14,000.00", from: "Agregador Jupiter", date: "Ayer, 18:45", status: "Completado" },
  { id: "TX-4", type: "recibir", asset: "SOL", amount: "+150 SOL", value: "$18,000.00", from: "Recompensas Staking", date: "Ayer, 12:00", status: "Completado" },
  { id: "TX-5", type: "enviar", asset: "ETH", amount: "-2.5 ETH", value: "$7,000.00", from: "Para 0x11...c3d", date: "May 19, 16:20", status: "Pendiente" },
  { id: "TX-6", type: "intercambio", asset: "USDT", amount: "5000 USDT → USDC", value: "$5,000.00", from: "Curve Finance", date: "May 18, 11:10", status: "Completado" },
];

export default function TransactionsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Transacciones</h1>
          <p className="text-muted-foreground mt-1">Revisa y gestiona tu actividad reciente en todas las redes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-secondary/80 text-foreground font-medium text-sm hover:bg-secondary transition-colors border border-border">
            Exportar CSV
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <BentoCard className="p-0">
          <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-secondary/20">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por ID, Dirección o Activo..."
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary/50 transition-colors w-full sm:w-auto justify-center">
              <Filter className="w-4 h-4" /> Filtrar
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/30 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Tipo</th>
                  <th className="px-6 py-4 font-medium">Monto</th>
                  <th className="px-6 py-4 font-medium">Detalles</th>
                  <th className="px-6 py-4 font-medium">Fecha</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-secondary/30 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${tx.type === 'recibir' ? 'bg-accent/20 text-accent' : tx.type === 'enviar' ? 'bg-destructive/20 text-destructive' : 'bg-blue-500/20 text-blue-500'}`}>
                          {tx.type === 'recibir' ? <ArrowDownLeft className="w-4 h-4" /> : tx.type === 'enviar' ? <ArrowUpRight className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                        </div>
                        <span className="font-medium capitalize">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{tx.amount}</p>
                      <p className="text-xs text-muted-foreground">{tx.value}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-muted-foreground">{tx.from}</p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{tx.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${tx.status === 'Completado' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border/50 flex justify-center bg-secondary/10">
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cargar Más</button>
          </div>
        </BentoCard>
      </motion.div>
    </div>
  );
}
