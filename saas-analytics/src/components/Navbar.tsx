"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, Activity, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Resumen", href: "/" },
    { name: "Analítica", href: "/analytics" },
    { name: "Clientes", href: "/customers" },
    { name: "Configuración", href: "/settings" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-accent text-white flex items-center justify-center rounded shadow-sm">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm tracking-tight">MetricsUI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    pathname === link.href 
                      ? "bg-muted text-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-md text-sm text-muted-foreground w-64 cursor-text hover:bg-muted/80 transition-colors">
              <Search className="w-4 h-4" />
              <span className="flex-1">Buscar...</span>
              <span className="text-xs border border-border bg-background rounded px-1 shadow-sm">/</span>
            </div>
            
            <button className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            </button>
            
            <div className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded-full transition-colors pr-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-100 to-blue-200 border border-blue-300 shadow-sm"></div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
