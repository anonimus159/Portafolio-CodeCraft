"use client";

import { BentoCard } from "@/components/ui/BentoCard";
import { Wallet as WalletIcon, Plus, Copy, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const wallets = [
  { id: "w1", name: "Bóveda Principal", network: "Ethereum", address: "0x4a9b...3c21", balance: 84500, color: "from-blue-500/20 to-purple-500/20", borderColor: "border-blue-500/30" },
  { id: "w2", name: "Billetera Activa", network: "Solana", address: "8f3a...2b19", balance: 27000, color: "from-green-500/20 to-emerald-500/20", borderColor: "border-green-500/30" },
  { id: "w3", name: "Almacenamiento en Frío", network: "Bitcoin", address: "bc1q...x7y2", balance: 13000, color: "from-orange-500/20 to-yellow-500/20", borderColor: "border-orange-500/30" },
];

export default function WalletsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Billeteras</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus billeteras conectadas y mira sus balances específicos.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-background font-bold text-sm hover:bg-accent/90 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <Plus className="w-4 h-4" /> Conectar Billetera
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet, i) => (
          <motion.div key={wallet.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}>
            <BentoCard className={`p-6 border ${wallet.borderColor} bg-gradient-to-br ${wallet.color}`} glow>
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-background/50 rounded-xl border border-border/50">
                  <WalletIcon className="w-6 h-6 text-foreground" />
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-background/50 border border-border/50">
                  {wallet.network}
                </span>
              </div>
              
              <div className="space-y-1 mb-6">
                <h3 className="font-heading font-semibold text-lg">{wallet.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground text-sm group">
                  <span>{wallet.address}</span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground">
                    <Copy className="w-3 h-3" />
                  </button>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground">
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-border/30">
                <p className="text-sm text-muted-foreground mb-1">Valor Total</p>
                <p className="text-2xl font-heading font-bold text-foreground">
                  $<AnimatedCounter value={wallet.balance} decimals={2} />
                </p>
              </div>
            </BentoCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
