/** Spinner de carga */
export function Spinner({ label = 'Cargando...', size = 'md' }) {
  const sz = size === 'lg' ? 44 : size === 'sm' ? 20 : 32;
  const bw = size === 'lg' ? 3  : size === 'sm' ? 2  : 2.5;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: 14 }}>
      <div style={{ width: sz, height: sz, borderRadius: '50%', border: `${bw}px solid rgba(245,158,11,0.2)`, borderTopColor: '#f59e0b', animation: 'spin 0.8s linear infinite' }} />
      {label && <p style={{ fontSize: 13, color: '#52525b', margin: 0 }}>{label}</p>}
    </div>
  );
}

/** Skeleton de una línea */
export function SkeletonLine({ width = '100%', height = 16, style = {} }) {
  return (
    <div style={{ width, height, borderRadius: 6, background: 'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.8s linear infinite', ...style }} />
  );
}

/** Grid de cards skeleton */
export function SkeletonCards({ count = 4, minW = 200 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill,minmax(${minW}px,1fr))`, gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ borderRadius: 14, overflow: 'hidden', height: 160, background: 'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.8s linear infinite' }} />
      ))}
    </div>
  );
}

/** Skeleton para la fila de stats */
export function SkeletonStats({ count = 4 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${count},1fr)`, gap: 12, marginBottom: 20 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ height: 80, borderRadius: 14, background: 'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.8s linear infinite' }} />
      ))}
    </div>
  );
}

/** Skeleton de tabla */
export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ height: 42, background: 'rgba(255,255,255,0.018)', borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'flex', gap: 16, padding: '14px 16px', borderBottom: r < rows - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} style={{ flex: 1, height: 14, borderRadius: 6, background: 'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.8s linear infinite' }} />
          ))}
        </div>
      ))}
    </div>
  );
}
