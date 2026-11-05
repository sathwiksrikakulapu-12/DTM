import { CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipProps } from 'recharts'

/** Shared chart styling: one axis, recessive grid, text in ink tokens, categorical series in fixed order. */
export const SERIES = { a: 'var(--color-orange)', b: 'var(--color-cool)' }
export const axis = { tick: { fill: '#A6ADB7', fontSize: '0.8rem' }, axisLine: { stroke: 'rgba(255,255,255,.18)' }, tickLine: false as const }

export const Grid = () => <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
export { ResponsiveContainer, XAxis, YAxis, Legend, Tooltip }

export function ChartTip({ active, payload, label, unit = '', prefix = '' }: TooltipProps<number, string> & { unit?: string; prefix?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-line bg-[#0d1224]/95 px-3 py-2 text-[0.82rem] shadow-xl">
      {label !== undefined && <div className="mb-1 text-mute">{label}</div>}
      {payload.map((p) => (
        <div key={String(p.dataKey)} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-mute">{p.name}</span>
          <span className="num ml-auto pl-3 font-semibold text-ink">{prefix}{p.value}{unit}</span>
        </div>
      ))}
    </div>
  )
}

export const legendStyle = { fontSize: '0.84rem', color: '#A6ADB7' }
