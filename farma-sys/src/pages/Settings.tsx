import { motion } from 'framer-motion';
import { Save, Building2, Receipt, Palette, ShieldCheck, Bell } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground text-sm mt-1">Administra las preferencias de FarmaSys y los detalles de tu empresa.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary font-medium rounded-xl text-sm transition-colors">
            <Building2 className="w-4 h-4" /> Datos de la Empresa
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:bg-muted font-medium rounded-xl text-sm transition-colors">
            <Receipt className="w-4 h-4" /> Facturación e Impuestos
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:bg-muted font-medium rounded-xl text-sm transition-colors">
            <Palette className="w-4 h-4" /> Apariencia (Tienda)
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:bg-muted font-medium rounded-xl text-sm transition-colors">
            <ShieldCheck className="w-4 h-4" /> Roles y Permisos
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:bg-muted font-medium rounded-xl text-sm transition-colors">
            <Bell className="w-4 h-4" /> Notificaciones
          </button>
        </div>

        {/* Content Area */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-3 bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-foreground mb-6">Datos de la Empresa</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nombre de la Droguería</label>
                <input type="text" defaultValue="FarmaSys Principal" className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">NIT / RUC</label>
                <input type="text" defaultValue="900.123.456-7" className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Dirección Principal</label>
              <input type="text" defaultValue="Av. Siempreviva 742, Sector Comercial" className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Teléfono de Contacto</label>
                <input type="tel" defaultValue="+57 323 231 3781" className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Correo de Soporte</label>
                <input type="email" defaultValue="soporte@farmasys.com" className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>

            <div className="pt-6 border-t border-border flex justify-end">
              <button type="button" className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm">
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
