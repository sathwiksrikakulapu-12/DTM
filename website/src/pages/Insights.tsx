import { ArrowRight, Lightbulb, Minus, Plus, Target } from 'lucide-react'
import { Bar, BarChart, Line, LineChart } from 'recharts'
import { MeshBackground, TopNav } from '../engine/Chrome'
import { at, goSlide } from '../engine/store'
import { Tag } from '../ui/kit'
import { axis, ChartTip, Grid, Legend, legendStyle, ResponsiveContainer, SERIES, Tooltip, XAxis, YAxis } from '../ui/charts'

const Jump = ({ s, k }: { s: number; k: number }) => (
  <button type="button" onClick={() => goSlide(at(s, k))} className="flex items-center gap-1 text-[0.8rem] whitespace-nowrap text-amber hover:underline">Open slide {at(s, k)}<ArrowRight className="h-3 w-3" /></button>
)
const Card = ({ title, jump, children, className = '' }: { title: string; jump: React.ReactNode; children: React.ReactNode; className?: string }) => (
  <section className={'glass rounded-2xl p-4 ' + className}>
    <div className="flex items-center justify-between gap-3"><h2 className="font-display text-[1.14rem] font-semibold">{title}</h2>{jump}</div>
    <div className="mt-2.5">{children}</div>
  </section>
)

const normal = [42, 44, 43, 45, 44, 46, 45, 47]; const obs = [41, 45, 44, 46, 52, 67, 82, 91]
const econ = [{ s: 'Pilot', 'Recurring revenue': 25, 'Service cost': 40 }, { s: 'Launch', 'Recurring revenue': 55, 'Service cost': 48 }, { s: 'Scale', 'Recurring revenue': 110, 'Service cost': 68 }, { s: 'Mature', 'Recurring revenue': 170, 'Service cost': 90 }]

export default function Insights() {
  return (
    <div className="theme-home relative flex h-dvh flex-col bg-bg">
      <MeshBackground />
      <TopNav />
      <main className="bg-grid relative min-h-0 flex-1 overflow-y-auto px-4 py-5 lg:px-8">
        <div className="kicker">Insights</div>
        <h1 className="mt-1 font-display text-[2.3rem] font-bold">What the source decks conclude</h1>
        <p className="mt-1 max-w-[52rem] text-[1rem] text-mute">Every item is drawn from the source presentations. Charts use values read from the decks' chart images and keep the decks' own “illustrative” labels.</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <Card title="What we learned from users" jump={<Jump s={2} k={13} />} className="lg:col-span-2">
            <ul className="grid gap-2 sm:grid-cols-2">
              {['Trust grows from explainable evidence—not prediction scores alone.', 'Technicians already verify; good design shortens and strengthens that loop.', 'Urgency is contextual: asset risk must be connected to production impact.', 'Every resolved alert is a learning opportunity for both people and models.'].map((s) => <li key={s} className="flex gap-2 rounded-xl border border-hair p-3 text-[0.98rem] leading-snug"><Lightbulb className="h-4 w-4 shrink-0 text-amber" />{s}</li>)}
            </ul>
          </Card>
          <Card title="Case-study lessons" jump={<Jump s={1} k={20} />}>
            <ul className="space-y-1.5 text-[0.98rem] leading-snug">{['early trending beats reactive response', 'sensor fusion improves confidence', 'documented baselines are essential for accurate anomaly detection'].map((s) => <li key={s} className="flex gap-2"><Target className="mt-0.5 h-4 w-4 shrink-0 text-amber" /><span className="first-letter:uppercase">{s}</span></li>)}</ul>
          </Card>
          <Card title="AI finds the pattern break" jump={<Jump s={3} k={12} />}>
            <div className="h-[13.5rem]"><ResponsiveContainer><LineChart data={normal.map((n, i) => ({ t: i + 1, Normal: n, Observed: obs[i] }))} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}><Grid /><XAxis dataKey="t" {...axis} /><YAxis domain={[0, 100]} ticks={[0, 50, 100]} {...axis} width={30} /><Tooltip content={<ChartTip />} /><Legend wrapperStyle={legendStyle} verticalAlign="top" height={22} /><Line dataKey="Normal" stroke={SERIES.b} strokeWidth={2} dot={false} /><Line dataKey="Observed" stroke={SERIES.a} strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div>
          </Card>
          <Card title="Recurring economics" jump={<Jump s={5} k={17} />}>
            <div className="mb-1"><Tag kind="illustrative" /></div>
            <div className="h-[12rem]"><ResponsiveContainer><BarChart data={econ} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}><Grid /><XAxis dataKey="s" {...axis} /><YAxis tickFormatter={(v) => `$${v}k`} {...axis} width={44} ticks={[0, 100, 200]} domain={[0, 200]} /><Tooltip content={<ChartTip prefix="$" unit="k" />} cursor={{ fill: 'rgba(255,255,255,.04)' }} /><Legend wrapperStyle={legendStyle} verticalAlign="top" height={22} /><Bar dataKey="Recurring revenue" fill={SERIES.a} radius={[3, 3, 0, 0]} /><Bar dataKey="Service cost" fill={SERIES.b} radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div>
          </Card>
          <Card title="Should you proceed?" jump={<Jump s={4} k={20} />}>
            <p className="text-[0.98rem] leading-snug">Proceed when the segment is reachable, failure frequency is measurable, impact is material, and the service can capture value after integration cost.</p>
            <p className="mt-2 rounded-xl border border-line bg-orange/10 p-2.5 text-[0.95rem] leading-snug">If the evidence is weak: narrow the asset, improve the denominator, or stop.</p>
          </Card>
          <Card title="Evaluation boosters and setbacks" jump={<Jump s={4} k={13} />} className="lg:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <ul className="space-y-1 text-[0.95rem]">{['High cost per event', 'Frequent repeatable failure modes', 'Existing sensor / historian data', 'Clear maintenance owner', 'Short payback expectation', 'Multi-site replication potential'].map((s) => <li key={s} className="flex items-center gap-2"><Plus className="h-4 w-4 shrink-0 text-good" />{s}</li>)}</ul>
              <ul className="space-y-1 text-[0.95rem]">{['Rare or random fault patterns', 'Low downtime economics', 'Missing or inaccessible data', 'Long integration cycle', 'No trusted action workflow', 'Buyer cannot capture savings'].map((s) => <li key={s} className="flex items-center gap-2"><Minus className="h-4 w-4 shrink-0 text-[#ff8b7c]" />{s}</li>)}</ul>
            </div>
          </Card>
          <Card title="KPIs to track" jump={<Jump s={3} k={19} />}>
            <p className="text-[0.95rem] leading-snug text-mute">Engineering Students deck: Uptime · MTBF · Cost · Precision</p>
            <p className="mt-1.5 text-[0.95rem] leading-snug text-mute">Journey Mapping deck: Downtime reduction %, cost savings, alert accuracy, technician utilization</p>
          </Card>
        </div>
      </main>
    </div>
  )
}
