"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  Search, Plus, Inbox, Settings, ChevronRight, 
  ChevronDown, FileText, Bot, Briefcase, Hash,
  Sun, Moon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";

const TreeItem = ({ icon: Icon, label, active = false, children, initiallyOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const hasChildren = Boolean(children);

  return (
    <div>
      <div 
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer text-sm group transition-colors ${
          active ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground hover:bg-hover hover:text-foreground"
        }`}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        <div className="w-4 h-4 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
          {hasChildren ? (
            isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <Icon className="w-3.5 h-3.5" />
          )}
        </div>
        <span className="flex-1 truncate">{label}</span>
      </div>
      
      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-6 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { setCommandOpen } = useStore();

  return (
    <aside className="w-[260px] h-screen bg-sidebar border-r border-border flex flex-col flex-shrink-0">
      <div className="h-12 flex items-center px-4 hover:bg-hover cursor-pointer transition-colors border-b border-border/50">
        <div className="w-5 h-5 rounded bg-accent flex items-center justify-center text-accent-foreground font-bold text-[10px] mr-2">
          N
        </div>
        <span className="font-semibold text-sm truncate flex-1">Nexus Team</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="flex-1 overflow-y-auto py-3 custom-scrollbar">
        <div className="px-2 space-y-0.5 mb-6">
          <div 
            onClick={() => setCommandOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer text-sm text-muted-foreground hover:bg-hover hover:text-foreground transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="flex-1">Buscar</span>
            <span className="text-xs border border-border rounded px-1.5 opacity-50">Cmd K</span>
          </div>
          <Link href="/inbox" className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${pathname === '/inbox' ? 'bg-accent/10 text-accent font-medium' : 'text-muted-foreground hover:bg-hover hover:text-foreground'}`}>
            <Inbox className="w-4 h-4" />
            <span>Bandeja de Entrada</span>
          </Link>
          <Link href="/settings" className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${pathname === '/settings' ? 'bg-accent/10 text-accent font-medium' : 'text-muted-foreground hover:bg-hover hover:text-foreground'}`}>
            <Settings className="w-4 h-4" />
            <span>Configuración</span>
          </Link>
        </div>

        <div className="px-2 mb-6">
          <p className="px-3 text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Favoritos</p>
          <Link href="/">
            <TreeItem icon={FileText} label="Plan Q3 2026" active={pathname === '/'} />
          </Link>
          <Link href="/doc/roadmap">
            <TreeItem icon={Briefcase} label="Roadmap Producto" active={pathname === '/doc/roadmap'} />
          </Link>
        </div>

        <div className="px-2">
          <p className="px-3 text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider flex items-center justify-between group">
            Espacios
            <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 cursor-pointer" />
          </p>
          
          <TreeItem icon={Hash} label="Ingeniería" initiallyOpen>
            <Link href="/doc/arquitectura">
              <TreeItem icon={FileText} label="Arquitectura Frontend" active={pathname === '/doc/arquitectura'} />
            </Link>
            <Link href="/doc/seguridad">
              <TreeItem icon={FileText} label="Revisión de Seguridad" active={pathname === '/doc/seguridad'} />
            </Link>
            <Link href="/doc/logs">
              <TreeItem icon={Bot} label="Logs IA Copilot" active={pathname === '/doc/logs'} />
            </Link>
          </TreeItem>
          
          <TreeItem icon={Hash} label="Diseño" />
          <TreeItem icon={Hash} label="Marketing" />
        </div>
      </div>

      <div className="p-3 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-hover transition-colors flex-1 overflow-hidden">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm flex-shrink-0">
            AV
          </div>
          <span className="text-sm font-medium truncate">Alex V.</span>
        </div>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-hover transition-colors"
          title="Cambiar tema"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
