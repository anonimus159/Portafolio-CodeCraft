"use client";

import { motion } from "framer-motion";
import { CryptoChart } from "@/components/dashboard/CryptoChart";
import { AssetList } from "@/components/dashboard/AssetList";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Resumen</h1>
          <p className="text-muted-foreground mt-1">Bienvenido de nuevo, aquí tienes el estado de tu portafolio.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-secondary/80 text-foreground font-medium text-sm hover:bg-secondary transition-colors border border-border">
            Exportar CSV
          </button>
          <button className="px-4 py-2 rounded-lg bg-accent text-background font-bold text-sm hover:bg-accent/90 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            Depositar Fondos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-secondary/30 border border-border backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Balance Total</p>
          <h2 className="text-3xl font-heading font-bold text-foreground">
            <AnimatedCounter value={124500} prefix="$" decimals={2} />
          </h2>
          <div className="mt-4 text-sm">
            <span className="text-accent font-medium">+5.2%</span>
            <span className="text-muted-foreground ml-2">desde el mes pasado</span>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-secondary/30 border border-border backdrop-blur-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16"><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Volumen 24h</p>
          <h2 className="text-3xl font-heading font-bold text-foreground">
            <AnimatedCounter value={4320} prefix="$" decimals={2} />
          </h2>
          <div className="mt-4 text-sm">
            <span className="text-accent font-medium">+12.4%</span>
            <span className="text-muted-foreground ml-2">desde ayer</span>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-secondary/30 border border-border backdrop-blur-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Staking Activo</p>
          <h2 className="text-3xl font-heading font-bold text-foreground">
            <AnimatedCounter value={85400} prefix="$" decimals={2} />
          </h2>
          <div className="mt-4 text-sm">
            <span className="text-muted-foreground">Ganando 4.5% APY prom.</span>
          </div>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={item} className="col-span-1 lg:col-span-2">
          <CryptoChart />
        </motion.div>
        
        <motion.div variants={item} className="col-span-1">
          <AssetList />
        </motion.div>

        <motion.div variants={item} className="col-span-1 lg:col-span-3">
          <RecentActivity />
        </motion.div>
      </motion.div>
    </div>
  );
}
