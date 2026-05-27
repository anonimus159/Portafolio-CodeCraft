import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Droplets, 
  DollarSign, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import clsx from 'clsx';

const salesData = [
  { name: 'Lun', kilos: 400, ventas: 12000, mermaPorcentaje: 4.5 },
  { name: 'Mar', kilos: 300, ventas: 9000, mermaPorcentaje: 4.8 },
  { name: 'Mié', kilos: 550, ventas: 16500, mermaPorcentaje: 5.2 },
  { name: 'Jue', kilos: 450, ventas: 13500, mermaPorcentaje: 4.1 },
  { name: 'Vie', kilos: 700, ventas: 21000, mermaPorcentaje: 3.8 },
  { name: 'Sáb', kilos: 900, ventas: 27000, mermaPorcentaje: 3.5 },
  { name: 'Dom', kilos: 850, ventas: 25500, mermaPorcentaje: 3.9 },
];

const mermaData = [
  { name: 'Sangre', kilos: 15 },
  { name: 'Grasa/Sebo', kilos: 45 },
  { name: 'Hueso', kilos: 80 },
  { name: 'Deshidratación', kilos: 5 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, isNegativeGood = false }: any) => {
  const isPositive = trend === 'up';
  const isGood = isNegativeGood ? !isPositive : isPositive;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-2xl border border-border relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-16 h-16 text-primary" />
      </div>
      <div className="relative z-10">
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-foreground mb-4">{value}</h3>
        <div className="flex items-center gap-2">
          <div className={clsx(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            isGood ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trendValue}</span>
          </div>
          <span className="text-xs text-muted-foreground">vs semana anterior</span>
        </div>
      </div>
    </motion.div>
  );
};

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Panel de Control</h1>
          <p className="text-muted-foreground mt-1">Resumen de operaciones del frigorífico hoy.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-sm font-medium rounded-lg border border-border transition-colors">
            Exportar Reporte
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ventas Totales Hoy" 
          value="$ 8.450.000" 
          icon={DollarSign} 
          trend="up" 
          trendValue="+12.5%" 
        />
        <StatCard 
          title="Volumen Movido" 
          value="1,254 KG" 
          icon={Scale} 
          trend="up" 
          trendValue="+8.2%" 
        />
        <StatCard 
          title="Merma Registrada" 
          value="45.2 KG" 
          icon={Droplets} 
          trend="down" 
          trendValue="-2.4%" 
          isNegativeGood={true}
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-2xl border border-red-500/30 bg-red-500/5 relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-red-400 mb-1">Alertas Activas</p>
              <h3 className="text-3xl font-bold text-red-500">2</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-red-400/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Nevera 2 temp. alta (6°C)
            </div>
            <div className="text-xs text-red-400/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Bajo stock: Lomo Fino
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass rounded-2xl border border-border p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Volumen de Ventas (KG)</h3>
            <p className="text-sm text-muted-foreground">Últimos 7 días</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKilos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kg`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.75rem', color: 'var(--foreground)' }}
                  itemStyle={{ color: 'var(--primary)' }}
                />
                <Area type="monotone" dataKey="kilos" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorKilos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Merma Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl border border-border p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Distribución de Merma</h3>
            <p className="text-sm text-muted-foreground">Desglose de hoy (KG)</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mermaData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.75rem' }}
                />
                <Bar dataKey="kilos" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Proactive Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Margin Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl border border-border p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Análisis de Merma vs Volumen</h3>
            <p className="text-sm text-muted-foreground">Relación porcentual</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMerma" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.75rem' }}
                />
                <Area type="monotone" dataKey="mermaPorcentaje" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorMerma)" name="% Merma" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Predictive Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl border border-primary/30 p-6 bg-primary/5 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Sugerencias Proactivas</h3>
              <p className="text-sm text-muted-foreground">Basado en frescura y rotación</p>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="bg-background rounded-xl p-4 border border-border">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm text-foreground">Promo Sugerida: Salmón Fresco</span>
                <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded">Urgent</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Lote P-9921 alcanza su 6to día. Sugerimos aplicar <strong>-10% descuento</strong> táctico hoy para rotar los 35.5 KG restantes.</p>
              <button className="text-xs font-bold text-primary hover:underline">Aplicar en POS →</button>
            </div>

            <div className="bg-background rounded-xl p-4 border border-border">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm text-foreground">Alerta de Cadena de Frío</span>
                <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">Warning</span>
              </div>
              <p className="text-xs text-muted-foreground">Revisar separación de Lomo Fino (Res) y Tilapia en Exhibidor 2 para evitar contaminación cruzada.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
