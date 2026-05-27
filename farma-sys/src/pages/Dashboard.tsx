import { motion } from 'framer-motion';
import { 
  Users, 
  Package, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const salesData = [
  { name: 'Lun', total: 1200 },
  { name: 'Mar', total: 2100 },
  { name: 'Mié', total: 1800 },
  { name: 'Jue', total: 2400 },
  { name: 'Vie', total: 3200 },
  { name: 'Sáb', total: 3800 },
  { name: 'Dom', total: 2900 },
];

const topProducts = [
  { name: 'Paracetamol 500mg', sales: 450, stock: 1200 },
  { name: 'Ibuprofeno 400mg', sales: 380, stock: 850 },
  { name: 'Amoxicilina 500mg', sales: 290, stock: 120 },
  { name: 'Vitamina C + Zinc', sales: 210, stock: 430 },
  { name: 'Loratadina 10mg', sales: 180, stock: 670 },
];

const StatCard = ({ title, value, icon: Icon, trend, isPositive, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon className="w-24 h-24" />
    </div>
    
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
        <Icon className="w-5 h-5" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        {trend}
      </div>
    </div>
    
    <div className="relative z-10">
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-foreground">{value}</h3>
    </div>
  </motion.div>
);

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Resumen general de tu droguería hoy.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium bg-secondary/10 text-secondary px-4 py-2 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          Sistema Operativo
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Ventas Totales (Hoy)" 
          value="$1,245.00" 
          icon={DollarSign} 
          trend="+12.5%" 
          isPositive={true}
          delay={0.1}
        />
        <StatCard 
          title="Pedidos Domicilio" 
          value="48" 
          icon={Package} 
          trend="+5.2%" 
          isPositive={true}
          delay={0.2}
        />
        <StatCard 
          title="Nuevos Pacientes" 
          value="12" 
          icon={Users} 
          trend="-2.1%" 
          isPositive={false}
          delay={0.3}
        />
        <StatCard 
          title="Alertas Vencimiento" 
          value="7" 
          icon={AlertTriangle} 
          trend="+2" 
          isPositive={false}
          delay={0.4}
        />
      </div>

      {/* Bento Grid layout for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Ingresos de la Semana</h3>
              <p className="text-sm text-muted-foreground">Comparativa de ventas de los últimos 7 días.</p>
            </div>
            <select className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20">
              <option>Esta semana</option>
              <option>Mes anterior</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(212 100% 48%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(212 100% 48%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dx={-10} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Más Vendidos</h3>
            <p className="text-sm text-muted-foreground">Top 5 productos de hoy.</p>
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Stock: {product.stock} und.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{product.sales}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Ventas</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
