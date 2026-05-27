import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, Users, ShoppingBag } from 'lucide-react';
import clsx from 'clsx';

const salesData = [
  { name: 'Lun', ingresos: 4000, ordenes: 240 },
  { name: 'Mar', ingresos: 3000, ordenes: 139 },
  { name: 'Mié', ingresos: 2000, ordenes: 980 },
  { name: 'Jue', ingresos: 2780, ordenes: 390 },
  { name: 'Vie', ingresos: 1890, ordenes: 480 },
  { name: 'Sáb', ingresos: 2390, ordenes: 380 },
  { name: 'Dom', ingresos: 3490, ordenes: 430 },
];

const categoryData = [
  { name: 'Medicamentos', ventas: 8500 },
  { name: 'Cuidado Personal', ventas: 4200 },
  { name: 'Suplementos', ventas: 3100 },
  { name: 'Equipos Médicos', ventas: 2800 },
];

const KpiCard = ({ title, value, change, isPositive, icon: Icon, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
    
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-primary/10 text-primary rounded-xl">
        <Icon className="w-6 h-6" />
      </div>
      <div className={clsx(
        "flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium",
        isPositive ? "text-emerald-600 bg-emerald-500/10" : "text-red-600 bg-red-500/10"
      )}>
        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        {change}%
      </div>
    </div>
    
    <div>
      <h3 className="text-muted-foreground font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  </motion.div>
);

export const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analíticas</h1>
          <p className="text-muted-foreground mt-1">Rendimiento financiero y operativo de la droguería.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm">
          Descargar Reporte
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard title="Ingresos Totales" value="$45,231.89" change={12.5} isPositive={true} icon={DollarSign} delay={0.1} />
        <KpiCard title="Pacientes Activos" value="+2350" change={5.2} isPositive={true} icon={Users} delay={0.2} />
        <KpiCard title="Órdenes Procesadas" value="12,234" change={2.4} isPositive={false} icon={ShoppingBag} delay={0.3} />
        <KpiCard title="Tasa de Conversión" value="4.3%" change={8.1} isPositive={true} icon={Activity} delay={0.4} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="xl:col-span-2 p-6 rounded-2xl bg-card border border-border shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6">Tendencia de Ingresos (Semanal)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="ingresos" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="p-6 rounded-2xl bg-card border border-border shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-6">Ventas por Categoría</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="ventas" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
