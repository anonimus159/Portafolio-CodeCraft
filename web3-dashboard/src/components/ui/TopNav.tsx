"use client";

import { Search, Bell, Menu } from "lucide-react";

export function TopNav() {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 lg:hidden">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-heading font-semibold text-lg">NEXUS</span>
      </div>

      <div className="hidden lg:flex flex-1 max-w-md">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Buscar transacciones, billeteras o comandos... (Cmd+K)"
            className="w-full bg-secondary/50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-all placeholder:text-muted-foreground/70"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">Alex V.</p>
            <p className="text-xs text-muted-foreground">Plan Pro</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent/20 to-accent/80 border border-accent/20 flex items-center justify-center text-sm font-bold shadow-[0_0_10px_rgba(34,197,94,0.2)]">
            AV
          </div>
        </div>
      </div>
    </header>
  );
}
