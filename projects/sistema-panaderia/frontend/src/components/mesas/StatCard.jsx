import { motion } from "framer-motion";

export default function StatCard({ title, value, icon: Icon, color = "orange", subtitle = "En total" }) {
  const colors = {
    orange: {
      bg: "bg-orange-500/18",
      icon: "text-orange-400",
      value: "text-orange-300",
      border: "border-orange-500/85",
      glow: "shadow-[0_18px_48px_rgba(249,115,22,0.12)]",
    },
    green: {
      bg: "bg-emerald-500/16",
      icon: "text-emerald-400",
      value: "text-emerald-300",
      border: "border-emerald-500/35",
      glow: "shadow-[0_18px_48px_rgba(16,185,129,0.10)]",
    },
    amber: {
      bg: "bg-amber-500/16",
      icon: "text-amber-400",
      value: "text-orange-400",
      border: "border-orange-500/55",
      glow: "shadow-[0_18px_48px_rgba(245,158,11,0.10)]",
    },
    rose: {
      bg: "bg-rose-500/16",
      icon: "text-rose-400",
      value: "text-rose-400",
      border: "border-rose-500/45",
      glow: "shadow-[0_18px_48px_rgba(244,63,94,0.10)]",
    },
  };

  const c = colors[color];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className={`relative rounded-xl p-5 backdrop-blur-2xl bg-gradient-to-br from-white/[0.10] to-white/[0.035] border overflow-hidden transition-all duration-500 ${c.border} ${c.glow}`}
    >
      <div className="absolute inset-0 bg-[#0a1020]/50" />
      <div className="relative flex items-center gap-5">
        <div className={`w-[58px] h-[58px] rounded-full ${c.bg} border ${c.border} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white/63 mb-1.5">{title}</p>
          <p className={`text-3xl leading-none font-black ${c.value}`}>{value}</p>
          <p className="text-xs text-white/45 mt-2">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}
