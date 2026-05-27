
import { motion } from 'framer-motion';
import { ThermometerSnowflake, AlertTriangle, CheckCircle2, History } from 'lucide-react';
import clsx from 'clsx';

const refrigerators = [
  { id: 1, name: 'Cuarto Frío Principal (Canales)', currentTemp: 2.1, targetTemp: 2.0, status: 'ok', lastMaintenance: '10 May 2026' },
  { id: 2, name: 'Nevera Exhibidora 1 (Premium)', currentTemp: 3.5, targetTemp: 3.0, status: 'ok', lastMaintenance: '15 May 2026' },
  { id: 3, name: 'Nevera Exhibidora 2 (Cerdo/Aves)', currentTemp: 6.8, targetTemp: 4.0, status: 'warning', lastMaintenance: '02 Ene 2026' },
  { id: 4, name: 'Congelador (Huesos/Mermas)', currentTemp: -18.5, targetTemp: -18.0, status: 'ok', lastMaintenance: '20 Abr 2026' },
];

export const Refrigeration = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Control de Refrigeración</h1>
          <p className="text-muted-foreground mt-1">Monitoreo en tiempo real de temperaturas y estado de cuartos fríos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {refrigerators.map((fridge) => {
          const isWarning = fridge.status === 'warning';
          
          return (
            <motion.div 
              key={fridge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={clsx(
                "rounded-2xl border p-6 relative overflow-hidden transition-all",
                isWarning 
                  ? "bg-red-500/10 border-red-500/50 shadow-[0_0_30px_rgba(220,38,38,0.15)]" 
                  : "glass border-border hover:border-primary/50"
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-foreground pr-8">{fridge.name}</h3>
                <div className={clsx(
                  "p-2 rounded-lg",
                  isWarning ? "bg-red-500/20 text-red-500 animate-pulse" : "bg-blue-500/20 text-blue-500"
                )}>
                  {isWarning ? <AlertTriangle className="w-5 h-5" /> : <ThermometerSnowflake className="w-5 h-5" />}
                </div>
              </div>

              <div className="flex items-end gap-2 mb-6">
                <span className={clsx(
                  "text-5xl font-bold tracking-tighter",
                  isWarning ? "text-red-500" : "text-foreground"
                )}>
                  {fridge.currentTemp.toFixed(1)}°
                </span>
                <span className="text-muted-foreground mb-1">/ {fridge.targetTemp.toFixed(1)}°C ideal</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estado</span>
                  <span className={clsx(
                    "flex items-center gap-1 font-medium",
                    isWarning ? "text-red-500" : "text-green-500"
                  )}>
                    {isWarning ? (
                      <><AlertTriangle className="w-4 h-4" /> Alerta de Temperatura</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4" /> Óptimo</>
                    )}
                  </span>
                </div>
                
                <div className="w-full h-px bg-border my-2" />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Último Mantenimiento</span>
                  <span className="text-foreground">{fridge.lastMaintenance}</span>
                </div>
              </div>
              
              {isWarning && (
                <div className="mt-4 pt-4 border-t border-red-500/20">
                  <button className="w-full py-2 bg-red-500 text-white rounded-lg font-medium text-sm hover:bg-red-600 transition-colors">
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
          <h2 className="text-lg font-bold text-foreground">Registro de Alertas Recientes</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="flex-1">
              <h4 className="font-bold text-foreground">Nevera Exhibidora 2 - Temperatura Alta (6.8°C)</h4>
              <p className="text-sm text-muted-foreground">Detectado hace 45 minutos. Posible falla de compresor o puerta abierta.</p>
            </div>
            <span className="text-sm font-medium text-muted-foreground">Hoy, 23:05</span>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="flex-1">
              <h4 className="font-bold text-foreground">Cuarto Frío Principal - Descongelamiento Programado</h4>
              <p className="text-sm text-muted-foreground">Ciclo automático finalizado exitosamente.</p>
            </div>
            <span className="text-sm font-medium text-muted-foreground">Ayer, 02:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};
