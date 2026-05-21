import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BentoCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function BentoCard({ children, className, glow = false, ...props }: BentoCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-secondary/50 backdrop-blur-xl border border-border/50",
        "transition-all duration-300 ease-in-out hover:border-border",
        glow && "hover:shadow-[0_0_15px_rgba(34,197,94,0.15)]",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none" />
      {children}
    </div>
  );
}
