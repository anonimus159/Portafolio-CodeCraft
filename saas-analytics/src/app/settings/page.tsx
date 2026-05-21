"use client";

import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-1 text-sm">Administra los ajustes de tu cuenta y facturación.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold text-lg">Perfil de la Empresa</h3>
            <p className="text-sm text-muted-foreground">Información pública y contacto comercial.</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre de la Empresa</label>
                <input type="text" defaultValue="MetricsUI Inc." className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Comercial</label>
                <input type="email" defaultValue="contacto@metricsui.com" className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-muted/30 border-t border-border flex justify-end">
            <button className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md shadow-sm hover:bg-foreground/90 transition-colors">
              Guardar Cambios
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border text-rose-600">
            <h3 className="font-semibold text-lg">Zona Peligrosa</h3>
            <p className="text-sm text-rose-600/70">Acciones destructivas para tu cuenta.</p>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-foreground">Eliminar Cuenta</p>
              <p className="text-sm text-muted-foreground">Esta acción borrará todos tus datos permanentemente.</p>
            </div>
            <button className="px-4 py-2 border border-rose-200 text-rose-600 bg-rose-50 text-sm font-medium rounded-md hover:bg-rose-100 transition-colors">
              Eliminar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
