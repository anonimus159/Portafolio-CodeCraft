import { BentoCard } from "@/components/ui/BentoCard";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const assets = [
  { name: "Bitcoin", symbol: "BTC", price: 45000, change: 2.5, balance: 1.2, value: 54000 },
  { name: "Ethereum", symbol: "ETH", price: 2800, change: -1.2, balance: 15.5, value: 43400 },
  { name: "Solana", symbol: "SOL", price: 120, change: 5.8, balance: 225.8, value: 27096 },
];

export function AssetList() {
  return (
    <BentoCard className="p-6 col-span-1 flex flex-col h-full" glow>
      <h3 className="font-heading font-semibold mb-4">Tus Activos</h3>
      <div className="space-y-4">
        {assets.map((asset) => (
          <div key={asset.symbol} className="flex items-center justify-between p-3 hover:bg-secondary/30 rounded-xl transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-sm border border-border group-hover:border-accent/50 transition-colors">
                {asset.symbol[0]}
              </div>
              <div>
                <p className="font-medium">{asset.name}</p>
                <p className="text-xs text-muted-foreground">{asset.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">${asset.price.toLocaleString()}</p>
              <div className={`flex items-center justify-end text-xs font-medium ${asset.change >= 0 ? "text-accent" : "text-destructive"}`}>
                {asset.change >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {Math.abs(asset.change)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}
