"use client";

import { LayoutDashboard, ArrowRightLeft, Wallet, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { icon: LayoutDashboard, label: "Panel Principal", href: "/" },
  { icon: ArrowRightLeft, label: "Transacciones", href: "/transactions" },
  { icon: Wallet, label: "Billeteras", href: "/wallets" },
  { icon: Settings, label: "Configuración", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 hidden lg:flex flex-col h-screen border-r border-border bg-background p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
          <span className="font-heading font-bold text-background">W3</span>
        </div>
        <span className="font-heading font-semibold text-lg tracking-wider">NEXUSDASH</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 relative group",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-secondary/50 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn("w-5 h-5", isActive ? "text-accent" : "group-hover:text-accent/70")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 rounded-xl bg-secondary/30 border border-border/50 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <p className="text-xs text-muted-foreground mb-2">Estado de Red</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-medium">Sistemas Operativos</span>
        </div>
      </div>
    </aside>
  );
}
