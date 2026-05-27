import { motion } from 'framer-motion';
import { ThermometerSnowflake, AlertTriangle, CheckCircle2, History, Droplets, Clock } from 'lucide-react';
import clsx from 'clsx';

const mockZones = [
  { id: 1, name: 'Cuarto Frío Principal', type: 'Almacenaje Res/Cerdo', temp: 2.5, targetTemp: 2.0, status: 'ok', humidity: 85, lastDefrost: 'Hace 4 horas' },
  { id: 2, name: 'Cuarto Frío Pescados', type: 'Congelación Rápida', temp: -18.5, targetTemp: -18.0, status: 'ok', humidity: 90, lastDefrost: 'Hace 12 horas' },
  { id: 3, name: 'Exhibidor Carnes 1', type: 'Vitrina', temp: 4.2, targetTemp: 3.5, status: 'warning', humidity: 75, lastDefrost: 'Hace 2 horas' },
  { id: 4, name: 'Exhibidor Pescados 2', type: 'Vitrina Hielo', temp: 6.8, targetTemp: 1.0, status: 'critical', humidity: 80, lastDefrost: 'Hace 8 horas' },
];

const mockLogs = [
  { id: 1, time: 'Hoy, 10:45 AM', zone: 'Exhibidor Pescados 2', event: 'Temperatura excede límite superior crítico (6.8°C)', type: 'error' },
  { id: 2, time: 'Hoy, 09:30 AM', zone: 'Sistema Central', event: 'Ciclo de descongelamiento automático completado', type: 'info' },
  { id: 3, time: 'Hoy, 08:15 AM', zone: 'Exhibidor Carnes 1', event: 'Fluctuación menor de temperatura detectada', type: 'warning' },
  { id: 4, time: 'Hoy, 07:00 AM', zone: 'Cuarto Frío Pescados', event: 'Alerta Inocuidad: Apertura prolongada de puerta', type: 'error' },
];

export const Refrigeration = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Control de Refrigeración</h1>
          <p className="text-muted-foreground mt-1">Monitoreo en tiempo real de temperaturas, cuartos fríos y zonas de pescados.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {mockZones.map((zone) => {
          const isWarning = zone.status === 'warning' || zone.status === 'critical';
          const isCritical = zone.status === 'critical';
          
          return (
            <motion.div 
              key={zone.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={clsx(
                "rounded-2xl border p-6 relative overflow-hidden transition-all",
                isCritical 
                  ? "bg-red-500/10 border-red-500/50 shadow-[0_0_30px_rgba(220,38,38,0.15)]" 
                  : isWarning 
                    ? "bg-yellow-500/10 border-yellow-500/50"
                    : "glass border-border hover:border-primary/50"
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-foreground">{zone.name}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{zone.type}</span>
                </div>
                <div className={clsx(
                  "p-2 rounded-lg shrink-0",
                  isCritical ? "bg-red-500/20 text-red-500 animate-pulse" : 
                  isWarning ? "bg-yellow-500/20 text-yellow-500" : "bg-blue-500/20 text-blue-500"
                )}>
                  {isWarning ? <AlertTriangle className="w-5 h-5" /> : <ThermometerSnowflake className="w-5 h-5" />}
                </div>
              </div>

              <div className="flex items-end gap-2 mb-6">
                <span className={clsx(
                  "text-5xl font-bold tracking-tighter",
                  isCritical ? "text-red-500" : isWarning ? "text-yellow-500" : "text-foreground"
                )}>
                  {zone.temp.toFixed(1)}°
                </span>
                <span className="text-muted-foreground mb-1">/ {zone.targetTemp.toFixed(1)}°C ideal</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estado</span>
                  <span className={clsx(
                    "flex items-center gap-1 font-medium",
                    isCritical ? "text-red-500" : isWarning ? "text-yellow-500" : "text-green-500"
                  )}>
                    {isWarning ? (
                      <><AlertTriangle className="w-4 h-4" /> Alerta Activa</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" /> Óptimo</>
                    )}
                  </span>
                </div>
                
                <div className="w-full h-px bg-border my-2" />
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Droplets className="w-3.5 h-3.5" />
                    {zone.humidity}% HR
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {zone.lastDefrost}
                  </div>
                </div>
              </div>
              
              {isWarning && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <button className={clsx(
                    "w-full py-2 text-white rounded-lg font-medium text-sm transition-colors",
                    isCritical ? "bg-red-500 hover:bg-red-600" : "bg-yellow-600 hover:bg-yellow-700"
                  )}>
                    Solicitar Revisión Técnica
                  </button>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      <div className="glass rounded-2xl border border-border p-6 mt-6">
        <div className="flex items-center gap-2 mb-6">
          <History className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Registro de Alertas e Inocuidad</h2>
        </div>
        
        <div className="space-y-4">
          {mockLogs.map(log => (
            <div key={log.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background">
              <div className={clsx(
                "w-3 h-3 rounded-full shrink-0",
                log.type === 'error' ? "bg-red-500" : log.type === 'warning' ? "bg-yellow-500" : "bg-blue-500"
              )} />
              <div className="flex-1">
                <h4 className="font-bold text-foreground">{log.zone} - {log.event}</h4>
                {log.type === 'error' && log.zone.includes('Pescados') && (
                  <p className="text-sm text-red-500/80 font-medium">⚠️ Riesgo de contaminación cruzada. Aísle el producto inmediatamente.</p>
                )}
              </div>
              <span className="text-sm font-medium text-muted-foreground shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
