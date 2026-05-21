import { Users, Clock, CheckCircle, MoreHorizontal, Armchair, Croissant, CupSoda } from "lucide-react";
import { motion } from "framer-motion";

export default function TableCard({
  tableNumber,
  capacity,
  status,
  total,
  orders,
  time,
  onOpen,
  onClick,
  selected,
}) {
  const isOccupied = status === "occupied";
  const isPending = status === "pending";

  const stateConfig = {
    occupied: {
      border: "border-orange-500/85",
      glow: "shadow-[0_18px_42px_rgba(0,0,0,0.28)]",
      badgeBg: "bg-orange-500/18",
      badgeText: "text-orange-300",
      badgeBorder: "border-orange-500/45",
      text: "text-orange-400",
      iconBg: "bg-orange-500/10",
      label: "OCUPADA",
      Art: Croissant,
    },
    pending: {
      border: "border-rose-500/75",
      glow: "shadow-[0_18px_42px_rgba(0,0,0,0.28)]",
      badgeBg: "bg-rose-500/18",
      badgeText: "text-rose-300",
      badgeBorder: "border-rose-500/45",
      text: "text-rose-400",
      iconBg: "bg-rose-500/10",
      label: "POR PAGAR",
      Art: CupSoda,
    },
    free: {
      border: "border-emerald-500/60",
      glow: "shadow-[0_18px_42px_rgba(0,0,0,0.25)]",
      badgeBg: "bg-emerald-500/18",
      badgeText: "text-emerald-300",
      badgeBorder: "border-emerald-500/45",
      text: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      label: "LIBRE",
      Art: Armchair,
    },
  };

  const state = stateConfig[isOccupied ? "occupied" : isPending ? "pending" : "free"];
  const Art = state.Art;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, scale: 1.008 }}
      onClick={onClick}
      className={`group relative cursor-pointer min-h-[218px] rounded-lg p-5 backdrop-blur-2xl bg-gradient-to-br from-[#171824]/86 via-[#0c1320]/88 to-[#070d17]/90 border overflow-hidden transition-all duration-500 ${state.border} ${state.glow} ${selected ? "ring-2 ring-white/20" : ""}`}
    >
      <Art className="absolute right-1 bottom-10 w-24 h-24 text-white/[0.045] stroke-[1.4]" />
      <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${state.iconBg}`} />

      <div className="absolute top-5 right-5 z-10">
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-black uppercase backdrop-blur-md ${state.badgeBg} ${state.badgeText} ${state.badgeBorder} border`}>
          {state.label}
        </span>
      </div>

      <div className="relative z-10">
        <h2 className="text-[34px] leading-none font-black text-white tracking-tight">#{tableNumber}</h2>
        <div className="mt-3 flex items-center gap-2 text-sm text-white/80">
          <Users size={15} />
          <span>{capacity} personas</span>
        </div>
      </div>

      <div className="relative z-10 mt-5 mb-4 border-t border-dashed border-white/18 w-[64%]" />

      {isOccupied || isPending ? (
        <div className="z-10">
          <div className="grid grid-cols-[68px_1fr] gap-y-1.5 text-sm">
            <span className="text-white/72">Total</span>
            <span className="text-white font-black">${total}</span>
            <span className="text-white/72">Pedidos</span>
            <span className="font-black text-orange-400">{orders || 0} pedido{Number(orders) === 1 ? "" : "s"}</span>
          </div>
          {time && (
            <div className="absolute left-0 right-0 bottom-0 h-[48px] border-t border-white/12 bg-white/[0.035] flex items-center justify-between px-5">
              <div className="flex items-center gap-2 text-xs font-black text-orange-400">
                <Clock size={15} />
                <span>Tiempo: {time}</span>
              </div>
              <MoreHorizontal className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      ) : (
        <div className="relative z-10">
          <div className="flex items-center gap-3 mt-1">
            <div className="w-5 h-5 rounded-full bg-emerald-500/12 border border-emerald-500/50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-white text-sm font-black">Disponible</p>
              <p className="text-white/62 text-xs mt-0.5">Lista para usar</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen?.();
            }}
            className="mt-7 w-full py-2.5 rounded-md text-xs font-black transition-all bg-emerald-500/6 text-emerald-300 hover:bg-emerald-500/12 border border-emerald-500/40"
          >
            Abrir Mesa
          </button>
          <MoreHorizontal className="absolute right-0 bottom-1 w-5 h-5 text-white" />
        </div>
      )}
    </motion.div>
  );
}
