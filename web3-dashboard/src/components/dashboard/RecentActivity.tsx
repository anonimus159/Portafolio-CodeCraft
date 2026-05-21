import { BentoCard } from "@/components/ui/BentoCard";
import { ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react";

const activities = [
  { id: 1, type: "recibir", amount: "+0.5 BTC", from: "Billetera Externa", time: "Hace 2 horas", status: "completado" },
  { id: 2, type: "intercambio", amount: "ETH a SOL", from: "Agregador Jupiter", time: "Hace 5 horas", status: "completado" },
  { id: 3, type: "enviar", amount: "-1000 USDC", from: "Para 0x8f...3a2b", time: "Hace 1 día", status: "completado" },
];

export function RecentActivity() {
  return (
    <BentoCard className="p-6 col-span-1 lg:col-span-3">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading font-semibold">Actividad Reciente</h3>
        <button className="text-xs text-accent hover:underline">Ver Todo</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activities.map((act) => (
          <div key={act.id} className="p-4 rounded-xl border border-border/50 bg-background/50 hover:border-accent/30 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-lg ${act.type === 'recibir' ? 'bg-accent/20 text-accent' : act.type === 'enviar' ? 'bg-destructive/20 text-destructive' : 'bg-blue-500/20 text-blue-500'}`}>
                {act.type === 'recibir' ? <ArrowDownLeft className="w-4 h-4" /> : act.type === 'enviar' ? <ArrowUpRight className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{act.time}</span>
            </div>
            <p className="font-medium text-sm">{act.amount}</p>
            <p className="text-xs text-muted-foreground mt-1 truncate">{act.from}</p>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}
