import { useState } from 'react';
import { Scissors, Scale, Droplets, CheckCircle2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export const CutsAndYield = () => {
  const [canalWeight, setCanalWeight] = useState(120);
  const [cuts] = useState([
    { id: 1, name: 'Lomo Fino', weight: 25, type: 'premium', price: 32000 },
    { id: 2, name: 'Costilla', weight: 35, type: 'standard', price: 18500 },
    { id: 3, name: 'Carne Molida', weight: 30, type: 'standard', price: 16000 },
    { id: 4, name: 'Hueso', weight: 15, type: 'waste_sale', price: 2000 },
    { id: 5, name: 'Grasa/Sebo', weight: 10, type: 'waste', price: 0 },
  ]);

  const totalCutsWeight = cuts.reduce((sum, cut) => sum + cut.weight, 0);
  const merma = +(canalWeight - totalCutsWeight).toFixed(2);
  const mermaPercentage = +((merma / canalWeight) * 100).toFixed(1);

  const totalExpectedRevenue = cuts.reduce((sum, cut) => sum + (cut.weight * cut.price), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Cortes y Rendimiento</h1>
          <p className="text-muted-foreground mt-1">Desposte de Canal, cálculo de merma y rentabilidad esperada.</p>
        </div>
        <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
          <Scissors className="w-4 h-4" /> Nuevo Desposte
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Canal Input */}
        <div className="glass p-6 rounded-2xl border border-border flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Entrada de Canal</h2>
            <div className="bg-muted/30 p-4 rounded-xl border border-border">
              <label className="text-sm font-medium text-muted-foreground block mb-2">Peso Inicial Recibido (KG)</label>
              <div className="relative">
                <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="number" 
                  value={canalWeight}
                  onChange={(e) => setCanalWeight(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 bg-card rounded-xl border border-border p-4 flex flex-col justify-center items-center text-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Costo Estimado Canal</h3>
            <p className="text-3xl font-bold text-foreground mb-4">${(canalWeight * 11000).toLocaleString()}</p>
            
            <div className="w-full h-px bg-border my-2" />
            
            <h3 className="text-sm font-medium text-muted-foreground mb-1 mt-2">Venta Proyectada (Cortes)</h3>
            <p className="text-3xl font-bold text-green-500 mb-4">${totalExpectedRevenue.toLocaleString()}</p>
            
            <div className="w-full h-px bg-border my-2" />

            <h3 className="text-sm font-medium text-muted-foreground mb-1 mt-2">Utilidad Bruta Estimada</h3>
            <p className="text-xl font-bold text-primary">${(totalExpectedRevenue - (canalWeight * 11000)).toLocaleString()}</p>
          </div>
        </div>

        {/* Middle Column: Cortes */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl border border-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-foreground">Registro de Cortes (Desposte)</h2>
            <div className="text-sm font-medium text-muted-foreground">
              Total Procesado: <span className="text-foreground">{totalCutsWeight.toFixed(2)} KG</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {cuts.map((cut, index) => (
              <div key={cut.id} className="bg-background rounded-xl p-3 border border-border flex items-center justify-between group hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{cut.name}</h4>
                    <span className={clsx(
                      "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full",
                      cut.type === 'premium' && "bg-primary/20 text-primary",
                      cut.type === 'standard' && "bg-blue-500/20 text-blue-500",
                      cut.type === 'waste_sale' && "bg-yellow-500/20 text-yellow-500",
                      cut.type === 'waste' && "bg-red-500/20 text-red-500"
                    )}>
                      {cut.type}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Precio/KG</p>
                    <p className="font-medium text-foreground">${cut.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Peso Obtenido</p>
                    <p className="font-bold text-lg text-foreground">{cut.weight.toFixed(2)} KG</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Merma Section */}
          <div className={clsx(
            "p-4 rounded-xl border flex items-center justify-between",
            mermaPercentage > 5 ? "bg-red-500/10 border-red-500/30" : "bg-green-500/10 border-green-500/30"
          )}>
            <div className="flex items-center gap-3">
              <div className={clsx(
                "p-2 rounded-lg",
                mermaPercentage > 5 ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"
              )}>
                {mermaPercentage > 5 ? <AlertCircle className="w-6 h-6" /> : <Droplets className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-foreground">Merma Invisible (Sangre/Deshidratación)</h4>
                <p className="text-sm text-muted-foreground">Diferencia entre peso canal y cortes totales</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className={clsx(
                "text-2xl font-bold",
                mermaPercentage > 5 ? "text-red-500" : "text-green-500"
              )}>
                {merma.toFixed(2)} KG
              </p>
              <p className="text-sm text-muted-foreground">{mermaPercentage}% de la canal</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button className="px-6 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 font-medium rounded-xl transition-all flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Finalizar Desposte y Enviar a Inventario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
