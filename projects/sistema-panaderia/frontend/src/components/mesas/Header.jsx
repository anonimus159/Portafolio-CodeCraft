import { Search, Plus, UsersRound, Croissant } from "lucide-react";

export default function Header({ onNewTable, onJoinTables, searchValue, onSearchChange }) {
  return (
    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-[42px] leading-none font-black text-white tracking-tight">Mesas</h1>
          <Croissant className="w-7 h-7 text-orange-500" />
        </div>
        <p className="text-base text-white/58 mt-4">Gestiona las mesas de tu restaurante</p>
      </div>

      <div className="flex items-center gap-5 flex-wrap">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/55" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-[330px] max-w-[82vw] h-[58px] pl-14 pr-20 rounded-lg bg-[#0b111d]/78 border border-white/20 text-white text-sm placeholder-white/38 shadow-[0_16px_34px_rgba(0,0,0,0.2)] focus:outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 transition-all"
            placeholder="Buscar mesa..."
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold text-white/75">
            Ctrl K
          </span>
        </div>

        <button
          onClick={onJoinTables}
          className="h-[58px] min-w-[180px] flex items-center justify-center gap-3 px-6 rounded-lg bg-[#0b111d]/78 border border-orange-500/70 hover:border-orange-400 text-white text-sm font-extrabold transition-all shadow-[0_16px_34px_rgba(0,0,0,0.18)]"
        >
          <UsersRound size={18} />
          <span className="hidden sm:inline">Unir Mesas</span>
        </button>

        <button
          onClick={onNewTable}
          className="h-[58px] min-w-[200px] flex items-center justify-center gap-3 px-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-400 hover:to-orange-600 text-white text-sm font-extrabold transition-all shadow-[0_18px_38px_rgba(249,115,22,0.35)]"
        >
          <Plus size={22} />
          Nueva Mesa
        </button>
      </div>
    </div>
  );
}
