"use client";

import { useState } from "react";
import { Bot, Share2, MoreHorizontal, Plus, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DocumentEditor() {
  const [title, setTitle] = useState("Plan Q3 2026");
  const [showAiCopilot, setShowAiCopilot] = useState(false);
  
  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      {/* Top Bar */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer transition-colors">Nexus Team</span>
          <span>/</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">Ingeniería</span>
          <span>/</span>
          <span className="text-foreground font-medium flex items-center gap-2">
            <span className="w-4 h-4 text-accent">📄</span>
            {title}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAiCopilot(!showAiCopilot)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
          >
            <Bot className="w-4 h-4" />
            <span>Copilot IA</span>
          </button>
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full border border-background bg-blue-500 z-10" />
            <div className="w-6 h-6 rounded-full border border-background bg-orange-500 z-0" />
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">Editado hace 2m</span>
          <button className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-hover transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-hover transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Editor Canvas */}
      <div className="flex-1 overflow-y-auto flex">
        <div className="flex-1 max-w-4xl mx-auto px-8 lg:px-24 py-16">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-4xl md:text-5xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted w-full mb-8"
            placeholder="Título del documento..."
          />
          
          <div className="space-y-4 text-foreground/90 leading-relaxed">
            
            <div className="flex gap-2 relative group">
              <div className="absolute -left-10 md:-left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <button className="p-1 rounded text-muted-foreground hover:bg-hover">
                  <Plus className="w-4 h-4" />
                </button>
                <button className="p-1 rounded text-muted-foreground hover:bg-hover cursor-grab">
                  <GripVertical className="w-4 h-4" />
                </button>
              </div>
              <p className="w-full outline-none" contentEditable suppressContentEditableWarning>
                Este es el documento principal de planificación para el tercer trimestre. Nuestro enfoque será integrar la Inteligencia Artificial de manera fluida en los flujos de trabajo diarios.
              </p>
            </div>

            <div className="flex gap-2 relative mt-4 group">
               <div className="absolute -left-10 md:-left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <button className="p-1 rounded text-muted-foreground hover:bg-hover">
                  <Plus className="w-4 h-4" />
                </button>
                <button className="p-1 rounded text-muted-foreground hover:bg-hover cursor-grab">
                  <GripVertical className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 rounded-lg bg-sidebar border border-border w-full">
                <div className="flex items-center gap-2 mb-2 font-medium text-accent">
                  <Bot className="w-4 h-4" /> Sugerencia de la IA
                </div>
                <p className="text-sm text-muted-foreground">
                  Podríamos agregar una sección sobre "Métricas de Éxito" para definir cómo mediremos la adopción de la IA. Presiona Tab para aceptar.
                </p>
              </div>
            </div>

            <div className="flex gap-2 relative group">
               <div className="absolute -left-10 md:-left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <button className="p-1 rounded text-muted-foreground hover:bg-hover">
                  <Plus className="w-4 h-4" />
                </button>
                <button className="p-1 rounded text-muted-foreground hover:bg-hover cursor-grab">
                  <GripVertical className="w-4 h-4" />
                </button>
              </div>
              <p className="w-full text-muted-foreground italic outline-none" contentEditable suppressContentEditableWarning>
                Presiona '/' para comandos, o espacio para IA...
              </p>
            </div>

          </div>
        </div>

        {/* Floating AI Copilot Widget */}
        <AnimatePresence>
          {showAiCopilot && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-80 border-l border-border bg-sidebar flex flex-col shadow-2xl absolute right-0 top-12 bottom-0 z-20"
            >
              <div className="p-4 border-b border-border/50 flex justify-between items-center">
                <h3 className="font-semibold flex items-center gap-2">
                  <Bot className="w-5 h-5 text-accent" />
                  Copilot
                </h3>
                <button onClick={() => setShowAiCopilot(false)} className="text-xs text-muted-foreground hover:text-foreground">Cerrar</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-background border border-border p-3 rounded-xl rounded-tl-sm text-sm">
                  ¡Hola Alex! Soy tu asistente. Puedo resumir este documento, generar tareas, o buscar en todo tu workspace.
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="text-xs bg-accent/10 text-accent border border-accent/20 px-2 py-1 rounded-full hover:bg-accent/20 transition-colors">
                    Generar resumen
                  </button>
                  <button className="text-xs bg-accent/10 text-accent border border-accent/20 px-2 py-1 rounded-full hover:bg-accent/20 transition-colors">
                    Crear tareas
                  </button>
                </div>
              </div>
              <div className="p-4 border-t border-border/50">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Pregúntale algo a la IA..." 
                    className="w-full bg-background border border-border rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-accent rounded flex items-center justify-center text-white">
                    ↑
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
