"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Settings, User, Bot } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

export function CommandPalette() {
  const { isCommandOpen, setCommandOpen } = useStore();
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (e.key === "Escape") {
        setCommandOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setCommandOpen]);

  const handleSelect = (href: string) => {
    setCommandOpen(false);
    router.push(href);
  };

  const results = [
    { icon: FileText, title: "Plan Q3 2026", href: "/" },
    { icon: FileText, title: "Roadmap Producto", href: "/doc/roadmap" },
    { icon: FileText, title: "Arquitectura Frontend", href: "/doc/arquitectura" },
    { icon: FileText, title: "Revisión de Seguridad", href: "/doc/seguridad" },
    { icon: Bot, title: "Logs IA Copilot", href: "/doc/logs" },
    { icon: Settings, title: "Configuración", href: "/settings" },
  ].filter(r => r.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <AnimatePresence>
      {isCommandOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setCommandOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-xl bg-sidebar border border-border shadow-2xl rounded-xl overflow-hidden relative z-10"
          >
            <div className="flex items-center px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <input 
                autoFocus
                type="text" 
                placeholder="Buscar documentos, comandos o perfiles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
              />
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">ESC</span>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
              {results.length > 0 ? (
                results.map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors text-left"
                  >
                    <item.icon className="w-4 h-4 opacity-70" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </button>
                ))
              ) : (
                <p className="p-4 text-center text-sm text-muted-foreground">No se encontraron resultados.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
