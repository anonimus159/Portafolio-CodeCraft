"use client";

import { useState, use, useEffect } from "react";
import { Bot, Share2, MoreHorizontal, Plus, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const docContent: Record<string, { title: string, content: string }> = {
  "roadmap": {
    title: "Roadmap de Producto Q4",
    content: "En este documento detallaremos los lanzamientos planeados para el último trimestre del año. La prioridad será finalizar la integración de la IA en los workspaces de los clientes."
  },
  "arquitectura": {
    title: "Arquitectura Frontend (React 19)",
    content: "Nuestra migración a React 19 y Next.js App Router está completa en un 80%. Este documento detalla los nuevos hooks experimentales que usaremos para optimizar la carga inicial."
  },
  "seguridad": {
    title: "Revisión de Seguridad",
    content: "Auditoría interna de los endpoints de la API. Se recomienda implementar rate-limiting más estricto en las llamadas al LLM para prevenir abusos."
  },
  "logs": {
    title: "Logs IA Copilot",
    content: "Registro de interacciones del asistente de inteligencia artificial. Las métricas de latencia actuales indican un tiempo de respuesta promedio de 1.2 segundos."
  }
};

export function generateStaticParams() {
  return [
    { id: 'roadmap' },
    { id: 'arquitectura' },
    { id: 'seguridad' },
    { id: 'logs' }
  ];
}
export default function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const data = docContent[id] || { title: "Documento en Blanco", content: "Empieza a escribir aquí..." };

  const [title, setTitle] = useState(data.title);
  const [content, setContent] = useState(data.content);
  const [showAiCopilot, setShowAiCopilot] = useState(false);
  
  useEffect(() => {
    setTitle(data.title);
    setContent(data.content);
  }, [id]);

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
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
          <button className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-hover transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-hover transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

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
              <p className="w-full outline-none" contentEditable suppressContentEditableWarning onBlur={(e) => setContent(e.currentTarget.textContent || "")}>
                {content}
              </p>
            </div>
            
            <div className="flex gap-2 relative group mt-4">
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
                  <Bot className="w-5 h-5 text-accent" /> Copilot
                </h3>
                <button onClick={() => setShowAiCopilot(false)} className="text-xs text-muted-foreground hover:text-foreground">Cerrar</button>
              </div>
              <div className="flex-1 p-4"><p className="text-sm text-muted-foreground">La IA está analizando este documento específico...</p></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
