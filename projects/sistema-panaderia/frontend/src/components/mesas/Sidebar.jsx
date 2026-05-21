import {
  LayoutGrid,
  UtensilsCrossed,
  Wallet,
  Boxes,
  BookOpen,
  FileBarChart2,
  LogOut,
  SunMoon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full
      flex items-center gap-3
      px-3 py-2.5
      rounded-xl
      text-sm
      font-medium
      transition-all
      duration-200
      ${active
        ? "bg-orange-500/10 text-orange-300 shadow-[0_0_0_1px_rgba(251,146,60,0.2)]"
        : "text-gray-400 hover:text-white hover:bg-white/5"}
    `}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

export default function Sidebar({ collapsed, onToggle }) {
  const navItems = [
    { icon: LayoutGrid, label: "Mesas", active: true },
    { icon: UtensilsCrossed, label: "Cocina (KDS)" },
    { icon: Wallet, label: "Caja" },
    { icon: Boxes, label: "Inventario" },
    { icon: BookOpen, label: "Recetas" },
    { icon: FileBarChart2, label: "Reportes" },
  ];

  return (
    <aside
      className={`
        relative
        h-screen
        flex flex-col
        justify-between
        border-r border-white/5
        bg-[#050914]/80
        backdrop-blur-2xl
        transition-all
        duration-300
        ${collapsed ? "w-20" : "w-72"}
      `}
    >
      {/* Botón colapsar */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[#0C1220] border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all z-50"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <div>
        {/* Logo */}
        {!collapsed && (
          <div className="flex items-center gap-3 mb-8 px-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center">
              <span className="text-lg">🍞</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Panadería POS</h1>
              <p className="text-xs text-gray-500">Sistema de Gestión</p>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="flex items-center justify-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center">
              <span className="text-lg">🍞</span>
            </div>
          </div>
        )}

        {/* Navegación */}
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={collapsed ? "" : item.label}
              active={item.active}
            />
          ))}
        </nav>

        {/* Resumen del día */}
        {!collapsed && (
          <div className="mt-8 mx-2">
            <div className="p-4 rounded-2xl bg-[#0C1220]/50 border border-white/5 backdrop-blur-xl">
              <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Resumen del día</p>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Ventas</span>
                  <span className="text-white font-semibold text-sm">$256.80</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Pedidos</span>
                  <span className="text-white font-semibold text-sm">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Ticket prom.</span>
                  <span className="text-white font-semibold text-sm">$11.16</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 space-y-2">
        {!collapsed && (
          <div className="p-3 rounded-xl bg-[#0C1220]/50 border border-white/5 flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Modo oscuro</span>
            <SunMoon size={16} className="text-orange-400" />
          </div>
        )}

        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-all border border-red-500/10 hover:border-red-500/20">
          <LogOut size={16} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
