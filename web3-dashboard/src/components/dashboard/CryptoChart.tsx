"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BentoCard } from "@/components/ui/BentoCard";

const data = [
  { time: "00:00", price: 42000 },
  { time: "04:00", price: 42500 },
  { time: "08:00", price: 41800 },
  { time: "12:00", price: 43200 },
  { time: "16:00", price: 44500 },
  { time: "20:00", price: 44100 },
  { time: "24:00", price: 45000 },
];

export function CryptoChart() {
  return (
    <BentoCard className="p-6 col-span-1 lg:col-span-2 flex flex-col h-[400px]" glow>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-muted-foreground text-sm font-medium">Rendimiento del Portafolio</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-heading font-bold">$124,500.00</span>
            <span className="text-sm font-medium text-accent">+5.2%</span>
          </div>
        </div>
        <div className="flex bg-secondary/50 rounded-lg p-1">
          {["1H", "1D", "1S", "1M"].map((tf) => (
            <button
              key={tf}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                tf === "1D" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, left: -20, right: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#334155" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#334155" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px" }}
              itemStyle={{ color: "#22C55E" }}
            />
            <Area type="monotone" dataKey="price" stroke="#22C55E" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </BentoCard>
  );
}
