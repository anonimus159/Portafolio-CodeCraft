"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Ene", views: 4000, clicks: 2400 },
  { name: "Feb", views: 3000, clicks: 1398 },
  { name: "Mar", views: 2000, clicks: 9800 },
  { name: "Abr", views: 2780, clicks: 3908 },
  { name: "May", views: 1890, clicks: 4800 },
  { name: "Jun", views: 2390, clicks: 3800 },
  { name: "Jul", views: 3490, clicks: 4300 },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Analítica Detallada</h1>
        <p className="text-muted-foreground mt-1 text-sm">Métricas de tráfico y conversión a fondo.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Tráfico Web vs Conversiones</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" fill="url(#colorViews)" />
                <Area type="monotone" dataKey="clicks" stroke="#111827" fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
