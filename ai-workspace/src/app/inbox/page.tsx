"use client";

import { Inbox as InboxIcon, CheckCircle2 } from "lucide-react";

export default function InboxPage() {
  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      <header className="h-12 flex items-center px-6 border-b border-border/50 shrink-0">
        <span className="text-foreground font-medium flex items-center gap-2">
          <InboxIcon className="w-4 h-4" />
          Bandeja de Entrada
        </span>
      </header>

      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Inbox</h1>
          <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
            <CheckCircle2 className="w-4 h-4" />
            Marcar todo como leído
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-border bg-sidebar hover:border-accent/50 transition-colors flex gap-4 cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-accent mt-2" />
            <div>
              <p className="font-medium text-sm">María te ha mencionado en <span className="font-bold">Arquitectura Frontend</span></p>
              <p className="text-sm text-muted-foreground mt-1">"¿Podrías revisar la sección de dependencias de React 19?"</p>
              <p className="text-xs text-muted-foreground mt-2">Hace 2 horas</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border/50 bg-background flex gap-4 opacity-70">
            <div className="w-2 h-2 rounded-full bg-transparent mt-2" />
            <div>
              <p className="font-medium text-sm">El espacio <span className="font-bold">Diseño</span> fue actualizado</p>
              <p className="text-sm text-muted-foreground mt-1">Se agregaron 3 nuevos recursos visuales.</p>
              <p className="text-xs text-muted-foreground mt-2">Ayer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
