import { motion } from 'framer-motion'
import { useState, type ComponentType } from 'react'
import { Check, X } from 'lucide-react'
import { Bar, BarChart, Cell } from 'recharts'
import { AnimatedNumber, money, NumField, Panel, Rise, Slide, Tag, cx } from '../ui/kit'
import { DeepDive, Quiz, SectionSummary } from '../ui/lab'
import { axis, ChartTip, Grid, Legend, legendStyle, ResponsiveContainer, Tooltip, XAxis, YAxis } from '../ui/charts'

const fmtMoney = (n: number) => (n < 0 ? '−' : '') + money(Math.abs(n))
const fmtPct = (n: number) => `${n.toFixed(2)}%`
const Big = ({ label, children, sub }: { label: string; children: React.ReactNode; sub?: string }) => (
  <div className="rounded-2xl border border-orange/60 bg-gradient-to-br from-orange/20 to-transparent p-3.5"><div className="kicker text-[0.72rem]">{label}</div><div className="mt-1 font-display text-[2.1rem] leading-none font-bold">{children}</div>{sub && <div className="mt-1 text-[0.82rem] text-mute">{sub}</div>}</div>
)

/* ---------- Stakeholders ---------- */
const PEOPLE = [
  { k: 'Operator', x: 22, y: 82, d: 'Feels disruption', note: 'Low budget influence, but experiences the problem daily. Interview to understand it.' },
  { k: 'Maintenance', x: 45, y: 92, d: 'Diagnoses + repairs', note: 'Daily user whose trust decides whether alerts are acted on.' },
  { k: 'Plant manager', x: 72, y: 76, d: 'Owns throughput', note: 'Cares about output and can sponsor a pilot.' },
  { k: 'Finance / owner', x: 90, y: 44, d: 'Approves spend', note: 'The economic buyer. Needs verified savings.' },
]
function Stakeholders() {
  const [a, setA] = useState(3); const p = PEOPLE[a]
  return (
    <Slide kicker="Stakeholder analysis" title="Stakeholder Analysis: Influence and Interest" sub="Roles and concerns come from the source slide. Their positions on the grid are illustrative and meant for discussion." tag={<Tag kind="illustrative" label="Positions are illustrative" />}>
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <Rise className="glass relative h-[23rem] rounded-2xl p-3">
          <div className="absolute inset-x-10 top-3 bottom-8 grid grid-cols-2 grid-rows-2 gap-px bg-white/10">{['Keep informed', 'Manage closely', 'Monitor', 'Keep satisfied'].map((q, i) => <div key={q} className={cx('bg-[#0b1020] p-1.5 text-[0.76rem] text-dim', i % 2 === 1 && 'text-right', i > 1 && 'flex items-end', i === 3 && 'justify-end', i === 1 && 'bg-orange/10')}>{q}</div>)}</div>
          <div className="absolute inset-x-10 top-3 bottom-8">
            {PEOPLE.map((q, i) => <button key={q.k} type="button" aria-pressed={i === a} onClick={() => setA(i)} style={{ left: `${q.x}%`, bottom: `${q.y}%`, transform: 'translate(-50%,50%)' }} className={cx('absolute rounded-full border px-2.5 py-1 text-[0.84rem] font-semibold whitespace-nowrap transition-all', i === a ? 'border-orange bg-orange text-black' : 'border-line bg-[#0d1224]')}>{q.k}</button>)}
          </div>
          <div className="absolute inset-x-10 bottom-1.5 text-center text-[0.78rem] text-mute">Influence over the purchase →</div>
          <div className="absolute top-1/2 left-1 origin-center -translate-x-1/3 -rotate-90 text-[0.78rem] whitespace-nowrap text-mute">Interest in the problem →</div>
        </Rise>
        <motion.div key={a} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="glass-o flex flex-col justify-center rounded-2xl p-5">
          <div className="font-display text-[1.7rem] font-bold">{p.k}</div><div className="text-[1.15rem] text-amber">{p.d}</div><p className="mt-3 text-[1.1rem] leading-snug">{p.note}</p>
        </motion.div>
      </div>
    </Slide>
  )
}

/* ---------- Downtime calculator ---------- */
function Downtime() {
  const [events, setEvents] = useState(6); const [mttr, setMttr] = useState(8); const [hours, setHours] = useState(6000); const [rate, setRate] = useState(2500); const [reduce, setReduce] = useState(40)
  const down = events * mttr; const lost = down * rate; const mtbf = events > 0 ? (hours - down) / events : hours
  const avail = hours > 0 ? (mtbf / (mtbf + mttr)) * 100 : 0
  const saved = down * (reduce / 100); const data = [{ s: 'Current', v: lost }, { s: 'With fewer stops', v: lost - saved * rate }]
  return (
    <Slide kicker="Calculator" title="Downtime Calculator" sub="Extends the deck’s formula: downtime × contribution per hour." tag={<Tag kind="placeholder" />}>
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1.1fr]">
        <Panel className="grid grid-cols-1 gap-2.5">
          <NumField label="Unplanned stops per year" value={events} onChange={setEvents} />
          <NumField label="Average repair time (MTTR)" suffix="hours" step={0.5} value={mttr} onChange={setMttr} />
          <NumField label="Scheduled operating hours per year" step={100} value={hours} onChange={setHours} />
          <NumField label="Contribution per hour" prefix="$" step={100} value={rate} onChange={setRate} />
          <label className="text-[0.84rem] text-mute">Stops avoided: <b className="num text-ink">{reduce}%</b><input type="range" min={0} max={90} value={reduce} onChange={(e) => setReduce(Number(e.target.value))} aria-label="Share of downtime avoided" /></label>
        </Panel>
        <div className="flex flex-col gap-2.5">
          <Big label="Downtime per year" sub="Stops × repair time"><AnimatedNumber value={down} format={(n) => `${Math.round(n)} h`} /></Big>
          <Big label="Inherent availability" sub="MTBF ÷ (MTBF + MTTR)"><AnimatedNumber value={avail} format={fmtPct} /></Big>
          <Big label="Lost contribution per year" sub="Downtime × contribution per hour"><AnimatedNumber value={lost} format={fmtMoney} /></Big>
        </div>
        <Panel className="flex flex-col">
          <div className="font-display font-semibold">Lost contribution per year</div>
          <div className="mt-1 min-h-[17rem] flex-1">
            <ResponsiveContainer><BarChart data={data} margin={{ top: 10, right: 6, left: 6, bottom: 0 }}><Grid /><XAxis dataKey="s" {...axis} /><YAxis {...axis} width={62} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} /><Tooltip content={<ChartTip prefix="$" />} cursor={{ fill: 'rgba(255,255,255,.04)' }} /><Bar dataKey="v" name="Lost contribution" radius={[5, 5, 0, 0]} isAnimationActive animationDuration={350}><Cell fill="var(--color-orange)" /><Cell fill="var(--color-cool)" /></Bar></BarChart></ResponsiveContainer>
          </div>
          <div data-testid="downtime-saved" className="text-[0.95rem]">Potential saving: <b className="num text-good">{fmtMoney(saved * rate)}</b> per year</div>
        </Panel>
      </div>
    </Slide>
  )
}

/* ---------- Economics ---------- */
function Payback() {
  const [v, setV] = useState({ inv: 60000, run: 12000, fail: 3, cost: 30000, maint: 8000 })
  const set = (k: keyof typeof v) => (n: number) => setV((x) => ({ ...x, [k]: n }))
  const b = v.fail * v.cost + v.maint - v.run; const pay = b > 0 ? v.inv / b : Infinity
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 text-[0.92rem]">
        <NumField label="Investment" prefix="$" step={1000} value={v.inv} onChange={set('inv')} />
        <NumField label="Running cost / year" prefix="$" step={1000} value={v.run} onChange={set('run')} />
        <NumField label="Failures avoided / year" value={v.fail} onChange={set('fail')} />
        <NumField label="Cost per failure" prefix="$" step={1000} value={v.cost} onChange={set('cost')} />
        <NumField label="Maintenance savings / year" prefix="$" step={1000} value={v.maint} onChange={set('maint')} />
      </div>
      <div data-testid="payback" className="mt-2 grid grid-cols-2 gap-2">
        <Big label="Annual net benefit"><AnimatedNumber value={b} format={fmtMoney} /></Big>
        <Big label="Simple payback">{Number.isFinite(pay) ? `${pay.toFixed(1)} yrs` : 'None'}</Big>
      </div>
      <div className="mt-1"><Tag kind="hypothetical" label="Hypothetical values. Replace them with site data." /></div>
    </div>
  )
}

/* ---------- Maintenance cost comparison ---------- */
function CostCompare() {
  const [cost, setCost] = useState(30000)
  const [v, setV] = useState({ rF: 6, rM: 10000, pF: 3, pM: 45000, dF: 1, dM: 30000, dS: 20000 })
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV((x) => ({ ...x, [k]: Number(e.target.value) }))
  const data = [
    { s: 'Reactive', Failures: v.rF * cost, Planned: v.rM, Monitoring: 0 },
    { s: 'Preventive', Failures: v.pF * cost, Planned: v.pM, Monitoring: 0 },
    { s: 'Predictive', Failures: v.dF * cost, Planned: v.dM, Monitoring: v.dS },
  ]
  const totals = data.map((d) => d.Failures + d.Planned + d.Monitoring)
  const best = totals.indexOf(Math.min(...totals))
  const Field = ({ l, k, max, step = 1 }: { l: string; k: keyof typeof v; max: number; step?: number }) => <label className="block text-[0.82rem] text-mute"><span className="flex justify-between"><span>{l}</span><b className="num text-ink">{step > 1 ? money(v[k]) : v[k]}</b></span><input type="range" min={0} max={max} step={step} value={v[k]} onChange={set(k)} aria-label={l} /></label>
  return (
    <Slide kicker="Calculator" title="Maintenance Cost Comparison" sub="Compare total yearly cost for one asset group: failures, planned work and monitoring." tag={<Tag kind="hypothetical" label="Hypothetical values: the outcome depends on your inputs" />}>
      <div className="grid gap-3 lg:grid-cols-[1fr_1.35fr]">
        <Panel className="space-y-0.5 !py-2.5">
          <NumField label="Cost per failure" prefix="$" step={1000} value={cost} onChange={setCost} />
          <div className="kicker mt-1 text-[0.68rem]">Reactive</div><div className="grid grid-cols-2 gap-2"><Field l="Failures per year" k="rF" max={15} /><Field l="Planned work" k="rM" max={100000} step={1000} /></div>
          <div className="kicker mt-1 text-[0.68rem]">Preventive</div><div className="grid grid-cols-2 gap-2"><Field l="Failures per year" k="pF" max={15} /><Field l="Planned work" k="pM" max={100000} step={1000} /></div>
          <div className="kicker mt-1 text-[0.68rem]">Predictive</div><div className="grid grid-cols-2 gap-2"><Field l="Failures per year" k="dF" max={15} /><Field l="Planned work" k="dM" max={100000} step={1000} /></div><Field l="Monitoring" k="dS" max={100000} step={1000} />
        </Panel>
        <div className="flex flex-col gap-2">
          <Rise className="glass rounded-2xl p-3">
            <div className="h-[17rem]"><ResponsiveContainer><BarChart data={data} margin={{ top: 8, right: 8, left: 6, bottom: 0 }} barCategoryGap="28%"><Grid /><XAxis dataKey="s" {...axis} /><YAxis {...axis} width={58} tickFormatter={(x) => `$${Math.round(x / 1000)}k`} /><Tooltip content={<ChartTip prefix="$" />} cursor={{ fill: 'rgba(255,255,255,.04)' }} /><Legend wrapperStyle={legendStyle} verticalAlign="top" height={24} /><Bar dataKey="Failures" stackId="a" fill="var(--color-orange)" animationDuration={300} /><Bar dataKey="Planned" stackId="a" fill="var(--color-amber)" animationDuration={300} /><Bar dataKey="Monitoring" stackId="a" fill="var(--color-cool)" radius={[4, 4, 0, 0]} animationDuration={300} /></BarChart></ResponsiveContainer></div>
          </Rise>
          <div data-testid="cost-totals" className="grid grid-cols-3 gap-2">{data.map((d, i) => <div key={d.s} className={cx('rounded-xl border p-2 text-center', i === best ? 'border-good bg-good/15' : 'border-hair')}><div className="text-[0.84rem]">{d.s}</div><div className="num font-display text-[1.3rem] font-bold"><AnimatedNumber value={totals[i]} format={fmtMoney} /></div>{i === best && <div className="text-[0.72rem] text-good">Lowest with these inputs</div>}</div>)}</div>
        </div>
      </div>
    </Slide>
  )
}

/* ---------- Prioritisation ---------- */
const ASSETS = [{ k: 'Pump A', f: 4, s: 4 }, { k: 'Motor B', f: 2, s: 5 }, { k: 'Fan C', f: 4, s: 1 }, { k: 'Gearbox D', f: 1, s: 3 }]
function Prioritise() {
  const [list, setList] = useState(ASSETS); const [a, setA] = useState(0)
  const ranked = [...list].map((x) => ({ ...x, risk: x.f * x.s })).sort((p, q) => q.risk - p.risk)
  const cur = list[a]
  const upd = (k: 'f' | 's', v: number) => setList((l) => l.map((x, i) => (i === a ? { ...x, [k]: v } : x)))
  return (
    <Slide kicker="Prioritisation" title="Problem Prioritisation Matrix" sub="Rank problems by frequency × severity, then start with the highest risk score." tag={<Tag kind="hypothetical" label="Example assets and scores" />}>
      <div className="grid gap-3 lg:grid-cols-[1.25fr_1fr]">
        <Rise className="glass relative h-[23rem] rounded-2xl">
          <div className="absolute inset-x-10 top-3 bottom-8" style={{ background: 'linear-gradient(45deg, rgba(47,227,154,.12), rgba(255,210,63,.12) 50%, rgba(255,90,95,.2))' }}>
            {list.map((x, i) => <button key={x.k} type="button" aria-pressed={i === a} onClick={() => setA(i)} style={{ left: `${((x.f - 0.5) / 5) * 100}%`, bottom: `${((x.s - 0.5) / 5) * 100}%`, transform: 'translate(-50%,50%)', transition: 'left .3s, bottom .3s' }} className={cx('absolute rounded-full border px-2.5 py-1 text-[0.84rem] font-semibold whitespace-nowrap', i === a ? 'border-orange bg-orange text-black' : 'border-line bg-[#0d1224]')}>{x.k}</button>)}
          </div>
          <div className="absolute inset-x-10 bottom-1.5 text-center text-[0.78rem] text-mute">Frequency →</div>
          <div className="absolute top-1/2 left-2 -translate-x-1/4 -rotate-90 text-[0.78rem] text-mute">Severity →</div>
        </Rise>
        <div className="flex flex-col gap-2.5">
          <Panel>
            <div className="font-display text-[1.14rem] font-bold">{cur.k}</div>
            <label className="mt-1 block text-[0.84rem] text-mute">Frequency: <b className="text-ink">{cur.f}</b><input type="range" min={1} max={5} value={cur.f} onChange={(e) => upd('f', Number(e.target.value))} aria-label="Frequency score" /></label>
            <label className="mt-1 block text-[0.84rem] text-mute">Severity: <b className="text-ink">{cur.s}</b><input type="range" min={1} max={5} value={cur.s} onChange={(e) => upd('s', Number(e.target.value))} aria-label="Severity score" /></label>
          </Panel>
          <Panel className="flex-1">
            <div className="kicker">Priority order</div>
            <ol data-testid="priority" className="mt-1.5 space-y-1.5">{ranked.map((x, i) => <li key={x.k} className="flex items-center gap-2"><span className="num grid h-7 w-7 place-items-center rounded-full bg-orange text-[0.86rem] font-bold text-black">{i + 1}</span><span className="flex-1 font-medium">{x.k}</span><span className="num text-amber">{x.risk}</span></li>)}</ol>
          </Panel>
        </div>
      </div>
    </Slide>
  )
}

/* ---------- Assumptions ---------- */
const ASSUME = [
  { a: 'Failures are frequent enough to matter', test: 'Audit logs: failures, exposure' }, { a: 'Each event is costly', test: 'Audit logs: downtime, cost' },
  { a: 'Faults show up in the signals', test: 'Instrument: baseline signal quality on 1–2 assets' }, { a: 'Warnings give enough time to act', test: 'Pilot: measure warning time and actions' },
  { a: 'Users will trust and act on alerts', test: 'Interview operators and maintainers; pilot' }, { a: 'The buyer can capture the savings', test: 'Interview buyers; check budget owner' },
]
type St = 'untested' | 'supported' | 'rejected'
function Assumptions() {
  const [s, setS] = useState<St[]>(ASSUME.map(() => 'untested'))
  const sup = s.filter((x) => x === 'supported').length; const rej = s.filter((x) => x === 'rejected').length
  const verdict = rej > 0 ? 'Evidence is weak: narrow the asset, improve the denominator, or stop.' : sup === ASSUME.length ? 'All assumptions supported: the case for scaling is strong.' : 'Keep testing: each step replaces an assumption with evidence.'
  return (
    <Slide kicker="Validation" title="Assumption Validation Board" sub="Assumptions restate the canvas, and the tests come from the deck’s validation plan. Record what the evidence shows." tag={<Tag kind="web" label="Added tool" />}>
      <div className="grid gap-2 sm:grid-cols-2">
        {ASSUME.map((x, i) => (
          <Panel key={x.a} className={cx('!p-3', s[i] === 'supported' && '!border-good/70', s[i] === 'rejected' && '!border-bad/70')}>
            <div className="font-display text-[1.05rem] leading-tight font-semibold">{x.a}</div>
            <div className="mt-0.5 text-[0.88rem] text-mute">{x.test}</div>
            <div className="mt-1.5 flex gap-1.5">
              <button type="button" aria-pressed={s[i] === 'supported'} onClick={() => setS((v) => v.map((y, k) => (k === i ? (y === 'supported' ? 'untested' : 'supported') : y)))} className={cx('flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.8rem]', s[i] === 'supported' ? 'border-good bg-good text-black' : 'border-hair')}><Check className="h-3.5 w-3.5" />Supported</button>
              <button type="button" aria-pressed={s[i] === 'rejected'} onClick={() => setS((v) => v.map((y, k) => (k === i ? (y === 'rejected' ? 'untested' : 'rejected') : y)))} className={cx('flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.8rem]', s[i] === 'rejected' ? 'border-bad bg-bad text-black' : 'border-hair')}><X className="h-3.5 w-3.5" />Rejected</button>
            </div>
          </Panel>
        ))}
      </div>
      <Panel orange className="mt-2.5 !py-2.5"><p data-testid="assume-verdict" className="font-display text-[1.2rem] leading-tight font-semibold">{verdict}</p></Panel>
    </Slide>
  )
}

const Q = () => <Quiz title="Check your understanding: Problem Sizing" questions={[
  { q: 'A breakdown causes 5 hours of downtime at $2,000 contribution per hour, plus $4,000 in direct costs. What does one event cost?', options: ['$6,000', '$10,000', '$14,000', '$40,000'], correct: 2, why: '5 × $2,000 = $10,000, plus $4,000 direct costs = $14,000. These numbers are hypothetical.' },
  { q: 'Why is a credible denominator essential to a failure rate?', options: ['It makes the number larger', 'It normalises failures by exposure', 'It removes the need for logs', 'It proves the market size'], correct: 1, why: 'Without exposure (machine-years, operating hours), rates from different assets cannot be compared.' },
  { q: 'Which market figure best reflects a realistic early share?', options: ['TAM', 'SAM', 'SOM', 'ARR'], correct: 2, why: 'SOM is the realistic early share, constrained by sales capacity and proof.' },
  { q: 'Which of these is an evaluation setback?', options: ['Clear maintenance owner', 'Buyer cannot capture savings', 'High cost per event', 'Multi-site replication potential'], correct: 1, why: 'If the buyer cannot capture savings, the case weakens even when the technology works.' },
]} />

const S = () => <SectionSummary title="Problem Sizing in review"
  concepts={['Problem-sizing canvas', 'Failure frequency and severity', 'Cost per breakdown', 'TAM, SAM, SOM and bottom-up sizing']}
  findings={['There is no universal failure rate', 'A failure is rarely just a repair', 'Every worked example here is hypothetical until evidence replaces it']}
  insights={['Users and buyers may be different people', 'Alternatives set the bar to beat', '“Stop” is a valid outcome if found early']}
  applications={['Choosing the first asset class', 'Building a pilot business case', 'Testing willingness to pay']}
  takeaway="Size before you solve." />

const extras: Record<string, ComponentType> = {
  stakeholders: Stakeholders, downtime: Downtime, costcompare: CostCompare, prioritise: Prioritise, assumptions: Assumptions, quiz: Q, summary: S,
  'dd-economics': () => <DeepDive id="economics" demo={<Payback />} demoLabel="Payback calculator" />,
}
export default extras
