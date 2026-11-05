import { cx } from '../ui/kit'

export type Level = 'ok' | 'warn' | 'crit'
export const levelColor: Record<Level, string> = { ok: '#34e39a', warn: '#ffc83d', crit: '#ff5a5f' }

/** Small semicircular gauge. */
export function MiniGauge({ value, label, unit, min, max, level, digits = 1, compact }: { value: number; label: string; unit: string; min: number; max: number; level: Level; digits?: number; compact?: boolean }) {
  const r = 40; const c = Math.PI * r
  const f = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return (
    <div data-testid={`gauge-${label}`} className={cx('glass rounded-xl px-2 py-1.5 text-center', level === 'crit' && '!border-bad/70', level === 'warn' && '!border-[#ffc83d]/60')}>
      <div className="text-[0.74rem] leading-tight font-medium text-mute">{label}</div>
      <svg viewBox="0 0 100 58" className={cx('mx-auto w-full', compact ? 'max-w-[5.6rem]' : 'max-w-[7rem]')} role="img" aria-label={`${label} ${value.toFixed(digits)} ${unit}, simulated`}>
        <path d="M10 52a40 40 0 0 1 80 0" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="7" strokeLinecap="round" />
        <path d="M10 52a40 40 0 0 1 80 0" fill="none" stroke={levelColor[level]} strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - f)} style={{ transition: 'stroke-dashoffset .35s, stroke .35s' }} />
        <text x="50" y="44" textAnchor="middle" fill="#F6F7FB" fontFamily="Space Grotesk Variable" fontWeight="700" fontSize="18">{value.toFixed(digits)}</text>
        <text x="50" y="56" textAnchor="middle" fill="#aab3c5" fontSize="9">{unit}</text>
      </svg>
    </div>
  )
}

const lim = (v: number, warn: number, crit: number): Level => (v >= crit ? 'crit' : v >= warn ? 'warn' : 'ok')
/** Demonstration thresholds only. */
export const levels = {
  vibration: (v: number) => lim(v, 3.2, 5),
  temperature: (v: number) => lim(v, 68, 80),
  current: (v: number) => lim(v, 25.6, 28),
  rpm: (v: number) => lim(1500 - v, 3, 7),
  pressure: (v: number) => lim(Math.abs(v - 3.2), 0.07, 0.12),
  acoustic: (v: number) => lim(v, 60, 70),
  health: (v: number) => lim(100 - v, 25, 60),
  rul: (v: number) => lim(180 - v, 70, 140),
}
