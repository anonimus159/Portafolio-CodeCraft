"use client";

import { BentoCard } from "@/components/ui/BentoCard";
import { User, Shield, Bell, Key, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-1">Gestiona las preferencias de tu cuenta y parámetros de seguridad.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Nav */}
        <div className="w-full md:w-64 space-y-2">
          {[
            { icon: User, label: "Perfil", active: true },
            { icon: Shield, label: "Seguridad", active: false },
            { icon: Bell, label: "Notificaciones", active: false },
            { icon: Key, label: "Claves API", active: false },
            { icon: CreditCard, label: "Facturación", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                item.active 
                  ? "bg-accent/10 text-accent border border-accent/20" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.4 }}
          className="flex-1 space-y-6"
        >
          <BentoCard className="p-6">
            <h3 className="font-heading font-semibold text-lg mb-4">Información del Perfil</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-accent/20 to-accent/80 border border-accent/20 flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  AV
                </div>
                <div>
                  <button className="px-3 py-1.5 bg-secondary/80 hover:bg-secondary border border-border rounded-lg text-sm font-medium transition-colors">
                    Cambiar Avatar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                  <input type="text" defaultValue="Alex" className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Apellido</label>
                  <input type="text" defaultValue="V." className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Correo Electrónico</label>
                  <input type="email" defaultValue="alex@ejemplo.com" className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="px-4 py-2 bg-accent text-background font-bold text-sm rounded-lg hover:bg-accent/90 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </BentoCard>

          <BentoCard className="p-6 border-destructive/20">
            <h3 className="font-heading font-semibold text-lg text-destructive mb-2">Zona de Peligro</h3>
            <p className="text-sm text-muted-foreground mb-4">Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate.</p>
            <button className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 font-bold text-sm rounded-lg hover:bg-destructive/20 transition-colors">
              Eliminar Cuenta
            </button>
          </BentoCard>
        </motion.div>
      </div>
    </div>
  );
}
