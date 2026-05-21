"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, CreditCard, Activity } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";

const data = [
  { name: "Ene", total: 1200 },
  { name: "Feb", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Abr", total: 2400 },
  { name: "May", total: 2800 },
  { name: "Jun", total: 3200 },
  { name: "Jul", total: 4100 },
];

const barData = [
  { name: "Lun", users: 120 },
  { name: "Mar", users: 180 },
  { name: "Mié", users: 240 },
  { name: "Jue", users: 150 },
  { name: "Vie", users: 290 },
  { name: "Sáb", users: 310 },
  { name: "Dom", users: 200 },
];

const transactions = [
  { id: "TX1029", user: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", status: "Completado", date: "Hoy" },
  { id: "TX1028", user: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", status: "Procesando", date: "Hoy" },
  { id: "TX1027", user: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", status: "Completado", date: "Ayer" },
  { id: "TX1026", user: "William Kim", email: "will@email.com", amount: "+$99.00", status: "Fallido", date: "Ayer" },
  { id: "TX1025", user: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", status: "Completado", date: "18 May" },
];

const containerVariants: import("framer-motion").Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resumen</h1>
          <p className="text-muted-foreground mt-1 text-sm">Rendimiento de tu negocio de un vistazo.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-card border border-border text-sm font-medium rounded-md shadow-sm hover:bg-muted/50 transition-colors">
            Descargar Reporte
          </button>
          <button className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-md shadow-sm hover:bg-accent/90 transition-colors">
            Crear Campaña
          </button>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <DollarSign className="w-24 h-24" />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-medium text-muted-foreground">Ingresos Totales</h3>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-2xl font-bold">$45,231.89</span>
              <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +20.1%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 relative z-10">vs mes anterior</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users className="w-24 h-24" />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-medium text-muted-foreground">Suscripciones</h3>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-2xl font-bold">+2,350</span>
              <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +180.1%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 relative z-10">vs mes anterior</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <CreditCard className="w-24 h-24" />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-medium text-muted-foreground">Ventas</h3>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-2xl font-bold">+12,234</span>
              <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +19%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 relative z-10">vs mes anterior</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity className="w-24 h-24" />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-medium text-muted-foreground">Usuarios Activos</h3>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-2xl font-bold">+573</span>
              <span className="text-xs font-medium text-rose-600 flex items-center bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-100">
                <ArrowDownRight className="w-3 h-3 mr-0.5" /> -201
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 relative z-10">vs última hora</p>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-4 bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="font-semibold text-lg">Evolución de Ingresos</h3>
              <p className="text-sm text-muted-foreground">Crecimiento mensual de ingresos en los últimos 7 meses.</p>
            </div>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `$${value}`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ stroke: '#d1d5db', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="total" stroke="#000000" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="lg:col-span-3 bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="font-semibold text-lg">Adquisición de Usuarios</h3>
              <p className="text-sm text-muted-foreground">Nuevos usuarios uniéndose a la plataforma por día.</p>
            </div>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="users" fill="#111827" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Transactions Table */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between bg-card/50">
            <div>
              <h3 className="font-semibold text-lg">Ventas Recientes</h3>
              <p className="text-sm text-muted-foreground">Has realizado 265 ventas este mes.</p>
            </div>
            <button className="text-sm font-medium text-foreground border border-border px-3 py-1.5 rounded-md hover:bg-muted/50 transition-colors shadow-sm">
              Ver Todo
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Cliente</th>
                  <th scope="col" className="px-6 py-3 font-medium">Fecha</th>
                  <th scope="col" className="px-6 py-3 font-medium">Estado</th>
                  <th scope="col" className="px-6 py-3 font-medium text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={i} className="bg-card border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">
                          {tx.user.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{tx.user}</div>
                          <div className="text-xs text-muted-foreground">{tx.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{tx.date}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1.5 text-xs font-medium rounded-full border",
                        tx.status === "Completado" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        tx.status === "Procesando" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-rose-50 text-rose-700 border-rose-200"
                      )}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{tx.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
      </motion.div>
    </div>
  );
}
