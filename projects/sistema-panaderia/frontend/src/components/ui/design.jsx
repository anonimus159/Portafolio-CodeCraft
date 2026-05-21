import { motion } from 'framer-motion';

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export function Page({ title, subtitle, actions, children, eyebrow }) {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 rounded-2xl bg-[#1E1E1E] p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-orange-400">{eyebrow}</p>}
          <h1 className="text-3xl font-black tracking-tight text-white lg:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-base text-white/55">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </header>
      {children}
    </div>
  );
}

export function Section({ title, subtitle, actions, children, className }) {
  return (
    <section className={cn('space-y-4', className)}>
      {(title || actions) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {title && <h2 className="text-xl font-black text-white">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-white/45">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Card({ children, className, interactive = false }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-[#1E1E1E] p-5 shadow-[0_14px_36px_rgba(0,0,0,0.18)]',
        interactive && 'transition-colors hover:bg-[#2A2A2A]',
        className
      )}
    >
      {children}
    </div>
  );
}

export function Button({ children, variant = 'primary', size = 'md', className, ...props }) {
  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-400',
    secondary: 'bg-[#2A2A2A] text-white hover:bg-[#333333]',
    ghost: 'bg-transparent text-white/70 hover:bg-[#2A2A2A] hover:text-white',
    danger: 'bg-red-500 text-white hover:bg-red-400',
    success: 'bg-emerald-500 text-white hover:bg-emerald-400',
  };
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-14 px-6 text-base',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function StatusBadge({ children, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-[#2A2A2A] text-white/70',
    primary: 'bg-orange-500/15 text-orange-300',
    success: 'bg-emerald-500/15 text-emerald-300',
    warning: 'bg-amber-500/15 text-amber-300',
    error: 'bg-red-500/15 text-red-300',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide', tones[tone])}>
      {children}
    </span>
  );
}

export function StatWidget({ label, value, icon: Icon, tone = 'primary', hint }) {
  const tones = {
    primary: 'text-orange-400 bg-orange-500/12',
    success: 'text-emerald-400 bg-emerald-500/12',
    warning: 'text-amber-400 bg-amber-500/12',
    error: 'text-red-400 bg-red-500/12',
    neutral: 'text-white/70 bg-[#2A2A2A]',
  };
  return (
    <Card className="min-h-[132px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-white/48">{label}</p>
          <p className="mt-3 text-4xl font-black leading-none text-white">{value}</p>
          {hint && <p className="mt-3 text-sm text-white/40">{hint}</p>}
        </div>
        {Icon && (
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', tones[tone])}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </Card>
  );
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cn('h-11 w-full rounded-xl bg-[#2A2A2A] px-4 text-sm text-white placeholder-white/35 outline-none transition-shadow focus:ring-2 focus:ring-orange-500/45', className)}
      {...props}
    />
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <Card className="flex min-h-[280px] flex-col items-center justify-center text-center">
      {Icon && <Icon className="mb-4 h-12 w-12 text-white/20" />}
      <h3 className="text-lg font-black text-white">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-white/45">{description}</p>}
    </Card>
  );
}

export function FadeIn({ children, className }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }} className={className}>
      {children}
    </motion.div>
  );
}
