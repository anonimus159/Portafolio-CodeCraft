"use client";

import { Settings as SettingsIcon, Monitor, User, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch for next-themes
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      <header className="h-12 flex items-center px-6 border-b border-border/50 shrink-0">
        <span className="text-foreground font-medium flex items-center gap-2">
          <SettingsIcon className="w-4 h-4" />
          Configuración
        </span>
      </header>

      <div className="flex-1 overflow-y-auto flex">
        {/* Settings Nav */}
        <div className="w-64 border-r border-border/50 p-4 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider px-3">Ajustes</p>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-accent/10 text-accent font-medium text-sm transition-colors">
            <Monitor className="w-4 h-4" /> Apariencia
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-hover hover:text-foreground text-sm transition-colors">
            <User className="w-4 h-4" /> Mi Perfil
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-hover hover:text-foreground text-sm transition-colors">
            <Bell className="w-4 h-4" /> Notificaciones
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-8 max-w-2xl">
          <h1 className="text-2xl font-bold mb-8">Apariencia</h1>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Tema</h3>
              <p className="text-sm text-muted-foreground">Personaliza el aspecto de tu espacio de trabajo.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-xl border ${theme === 'light' ? 'border-accent ring-1 ring-accent bg-accent/5' : 'border-border'} flex flex-col items-center gap-2 hover:bg-hover transition-all`}
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm" />
                  <span className="text-sm font-medium">Claro</span>
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-accent ring-1 ring-accent bg-accent/5' : 'border-border'} flex flex-col items-center gap-2 hover:bg-hover transition-all`}
                >
                  <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 shadow-sm" />
                  <span className="text-sm font-medium">Oscuro</span>
                </button>
                <button 
                  onClick={() => setTheme('system')}
                  className={`p-4 rounded-xl border ${theme === 'system' ? 'border-accent ring-1 ring-accent bg-accent/5' : 'border-border'} flex flex-col items-center gap-2 hover:bg-hover transition-all`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-white to-neutral-900 border border-border shadow-sm" />
                  <span className="text-sm font-medium">Sistema</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
