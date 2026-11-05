import { motion } from 'framer-motion'
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react'
import {
  Activity, AlertOctagon, ArrowRight, Boxes, Briefcase, Calculator, CalendarDays, Check, ClipboardCheck, Clock, Cog, Database, DollarSign, Fan, FileBarChart, FlaskConical, Gauge, GaugeCircle, HardHat, Minus, Package,
  Plus, ScanSearch, Scale, Search, Settings2, ShieldAlert, Target, Trash2, Truck, UserCog, Users, Waves, Wrench, X, Zap,
} from 'lucide-react'
import { AnimatedNumber, IconBadge, money, NumField, Panel, Photo, Rise, Slide, Stagger, Tag, useRunner, RunButton, cx, Sr } from '../ui/kit'
import { at, goSlide } from '../engine/store'

const fmtMoney = (n: number) => money(n)
const fmtNum = (n: number) => (Math.round(n * 100) / 100).toLocaleString('en-US')

/* Evaluation state shared by slides 13 and 14 so the case meter carries over. */
const evalStore = {
  picked: new Set<string>(),
  listeners: new Set<() => void>(),
  version: 0,
  toggle(k: string) { this.picked.has(k) ? this.picked.delete(k) : this.picked.add(k); this.version++; this.listeners.forEach((l) => l()) },
}
function useEval() {
  const v = useSyncExternalStore((l) => { evalStore.listeners.add(l); return () => evalStore.listeners.delete(l) }, () => evalStore.version)
  return { picked: evalStore.picked, toggle: useCallback((k: string) => evalStore.toggle(k), []), v }
}

const Result = ({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) => (
  <div className="rounded-2xl border border-orange/60 bg-gradient-to-br from-orange/20 to-transparent p-4">
    <div className="kicker text-[0.72rem]">{label}</div>
    <div className="mt-1 font-display text-[2.5rem] leading-none font-bold">{value}</div>
    {sub && <div className="mt-1.5 text-[0.86rem] text-mute">{sub}</div>}
  </div>
)

/* 1 */
function S1() {
  const chain = ['SIZE THE PAIN', 'TEST THE EVIDENCE', 'EARN THE RIGHT TO BUILD']
  return (
    <div className="grid min-h-full items-center gap-6 lg:grid-cols-[1.45fr_1fr]">
      <Stagger>
        <Rise className="kicker">Problem-Sizing Canvas</Rise>
        <Rise><h1 className="mt-3 font-display text-[3.8rem] leading-[0.98] font-bold tracking-tight lg:text-[5rem]">Predictive<br /><span className="text-orange">Maintenance</span></h1></Rise>
        <Rise><p className="mt-5 max-w-[34rem] text-[1.3rem] leading-snug text-ink/90">Understand how large the machine-breakdown problem is — and whether it is worth solving.</p></Rise>
        <Rise className="mt-6 flex flex-wrap items-center gap-2">
          {chain.map((c, i) => <span key={c} className="flex items-center gap-2"><span className="rounded-lg border border-line bg-black/40 px-3 py-1.5 font-display text-[0.92rem] font-semibold tracking-wide">{c}</span>{i < 2 && <ArrowRight className="h-4 w-4 text-orange" />}</span>)}
          <Sr>SIZE THE PAIN → TEST THE EVIDENCE → EARN THE RIGHT TO BUILD</Sr>
        </Rise>
      </Stagger>
      <Photo src="/img/s4-01.webp" alt="Engineer standing beside a long production line" className="h-[22rem] lg:h-[33rem]" />
    </div>
  )
}

/* 2 */
function S2() {
  const sig = [['Vibration', Activity], ['temperature', Gauge], ['current', Zap], ['oil', Waves], ['acoustics', Search]] as const
  return (
    <Slide title="What Is Predictive Maintenance?" sub="Use machine-condition data to identify developing faults — then plan maintenance before functional failure.">
      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <div className="flex flex-col gap-3">
          <Panel>
            <div className="kicker">Signals</div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {sig.map(([s, I]) => <div key={s} className="flex flex-col items-center gap-1.5 rounded-xl border border-hair bg-white/[.03] py-3 text-center"><I className="h-6 w-6 text-amber" strokeWidth={1.4} /><span className="text-[0.92rem] capitalize">{s}</span></div>)}
            </div>
            <Sr>Vibration • temperature • current • oil • acoustics</Sr>
          </Panel>
          <Panel orange className="flex flex-1 items-center"><p className="font-display text-[1.6rem] leading-tight font-semibold">The goal is not ‘predict everything.’ It is to create enough warning time for a safer, cheaper intervention.</p></Panel>
        </div>
        <Photo src="/img/s4-02.webp" alt="Gloved hands fitting a sensor to a motor" className="h-[18rem] lg:h-[23rem]" />
      </div>
    </Slide>
  )
}

/* 3 */
function S3() {
  const ripple = [['stop output', Boxes], ['idle labor', Users], ['create scrap', Trash2], ['disrupt delivery promises', Truck], ['force expensive emergency work', Wrench]] as const
  return (
    <Slide title="The Problem We Are Sizing" sub={<span className="font-display text-[1.4rem] font-semibold text-ink">A failure is rarely just a repair.</span>}>
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-3">
          <Rise className="text-[1.15rem] leading-snug">It can stop output, idle labor, create scrap, disrupt delivery promises, and force expensive emergency work.</Rise>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
            {ripple.map(([s, I], i) => (
              <motion.div key={s} variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }} className="glass lift flex flex-col gap-2 rounded-xl p-3"><I className="h-6 w-6 text-orange" strokeWidth={1.4} /><span className="block text-[0.94rem] leading-tight first-letter:uppercase">{s}</span></motion.div>
            ))}
          </div>
          <Panel orange className="flex-1">
            <div className="flex items-center gap-2"><ScanSearch className="h-5 w-5 text-orange" /><span className="kicker">Sizing question</span></div>
            <p className="mt-2 font-display text-[1.5rem] leading-tight font-semibold">For which machines, users, and operating contexts is this pain frequent and costly enough to justify earlier detection?</p>
          </Panel>
        </div>
        <Photo src="/img/s4-03.webp" alt="Engineer contemplating a stopped machine" className="h-[18rem] lg:h-[24rem]" />
      </div>
    </Slide>
  )
}

/* 4 */
function S4() {
  const cells = [
    { n: '01', k: 'USER SEGMENT', q: 'Who has the pain?', i: Users, s: 5 }, { n: '02', k: 'FREQUENCY', q: 'How often does it occur?', i: CalendarDays, s: 6 },
    { n: '03', k: 'SEVERITY', q: 'What does one event cost?', i: AlertOctagon, s: 7 }, { n: '04', k: 'EVALUATION', q: 'What strengthens or weakens the case?', i: Scale, s: 13 },
  ]
  return (
    <Slide title="Reference Format: Problem-Sizing Canvas" tag={<span className="text-[0.84rem] text-mute">Select a block to open it</span>}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {cells.map(({ n, k, q, i: I, s }) => (
          <Panel key={n} onClick={() => goSlide(at(4, s))} className="group flex min-h-[13rem] flex-col justify-between !rounded-lg">
            <div className="flex items-center justify-between"><span className="num font-display text-[2.4rem] leading-none font-bold text-orange">{n}</span><I className="h-8 w-8 text-amber" strokeWidth={1.3} /></div>
            <div><div className="font-display text-[1.5rem] font-bold tracking-wide">{k}</div><div className="mt-1 flex items-center justify-between text-[1.18rem] text-mute">{q}<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:text-orange" /></div></div>
          </Panel>
        ))}
      </div>
    </Slide>
  )
}

/* 5 */
function S5() {
  const who = [['OPERATOR', 'Feels disruption', HardHat, 'user'], ['MAINTENANCE', 'Diagnoses + repairs', Wrench, 'user'], ['PLANT MANAGER', 'Owns throughput', UserCog, 'both'], ['FINANCE / OWNER', 'Approves spend', Briefcase, 'buyer']] as const
  const [view, setView] = useState<'user' | 'buyer' | null>(null)
  const matches = (w: string) => view === null || w === view || w === 'both'
  return (
    <Slide title="Who Experiences the Problem?">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {(['user', 'buyer'] as const).map((v) => <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(view === v ? null : v)} className={cx('rounded-full border px-4 py-1 text-[0.9rem] font-medium', view === v ? 'border-orange bg-orange text-black' : 'border-line')}>{v === 'user' ? 'Interview the user' : 'Sell to the economic buyer'}</button>)}
        <span className="text-[0.8rem] text-dim">Highlighting is an interpretation to prompt discussion.</span>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {who.map(([k, d, I, w], i) => (
          <Panel key={k} className={cx('flex min-h-[14rem] flex-col transition-opacity', !matches(w) && 'opacity-30', view && matches(w) && 'hot')}>
            <div className="flex items-center justify-between"><span className="num font-display text-[1.7rem] font-bold text-orange">{i + 1}</span><I className="h-7 w-7 text-amber" strokeWidth={1.4} /></div>
            <div className="mt-auto font-display text-[1.25rem] font-bold">{k}</div>
            <div className="mt-1 text-[1.12rem] leading-snug text-mute">{d}</div>
          </Panel>
        ))}
      </div>
      <Panel orange className="mt-3"><p className="font-display text-[1.45rem] leading-tight font-semibold">Interview the user. Sell to the economic buyer. Do not assume they are the same person.</p></Panel>
    </Slide>
  )
}

/* 6 */
function S6() {
  const steps = ['Define failure', 'Choose asset class', 'Set time window', 'Count exposure', 'Normalize rate']
  const [ev, setEv] = useState(6); const [mach, setMach] = useState(10); const [yrs, setYrs] = useState(2); const [hrs, setHrs] = useState(6000)
  const my = mach * yrs
  const totalH = my * hrs
  const perYear = my > 0 ? ev / my : 0; const per1k = totalH > 0 ? (ev / totalH) * 1000 : 0
  return (
    <Slide title="How Often Do Failures Occur?" tag={<Tag kind="placeholder" />}>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((s, i) => <Rise key={s} className="flex items-center gap-2"><span className="glass rounded-full px-3 py-1 font-display text-[0.98rem] font-semibold"><span className="num mr-1.5 text-amber">{i + 1}</span>{s}</span>{i < 4 && <ArrowRight className="h-4 w-4 text-orange" />}</Rise>)}
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col gap-3">
          <Panel className="text-[1.05rem] leading-snug">Use maintenance logs and operating hours. Report events per machine-year, per 1,000 operating hours, or per production cycle — always segmented by machine type, age, duty cycle, and environment.</Panel>
          <Panel orange className="flex-1"><p className="font-display text-[1.5rem] leading-tight font-semibold">No universal rate. A credible denominator matters as much as the numerator.</p></Panel>
        </div>
        <Panel>
          <div className="flex items-center gap-2 font-display font-semibold"><Calculator className="h-5 w-5 text-amber" />Failure-rate calculator</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <NumField label="Failure events counted" value={ev} onChange={setEv} />
            <NumField label="Machines in the asset class" value={mach} onChange={setMach} />
            <NumField label="Time window (years)" value={yrs} onChange={setYrs} step={0.5} />
            <NumField label="Operating hours per machine-year" value={hrs} onChange={setHrs} step={100} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Result label="Per machine-year" value={<AnimatedNumber value={perYear} format={fmtNum} />} sub={`${ev} events ÷ ${fmtNum(my)} machine-years`} />
            <Result label="Per 1,000 operating hours" value={<AnimatedNumber value={per1k} format={fmtNum} />} sub={`${ev} events ÷ ${fmtNum(totalH)} hours`} />
          </div>
        </Panel>
      </div>
    </Slide>
  )
}

/* 7 */
function S7() {
  const parts = [['LOST OUTPUT', 'units × margin', Boxes], ['LABOR', 'idle + overtime', Users], ['REPAIR', 'parts + contractor', Wrench], ['QUALITY', 'scrap + rework', Trash2], ['SERVICE', 'expedite + penalties', Truck], ['RISK', 'safety + compliance', ShieldAlert]] as const
  const [on, setOn] = useState<Set<string>>(new Set(parts.map((p) => p[0])))
  return (
    <Slide title="How Severe Is the Impact?" tag={<span className="text-[0.84rem] text-mute"><span className="num font-semibold text-amber">{on.size}</span> of 6 components counted in the sizing</span>}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {parts.map(([k, f, I]) => {
          const a = on.has(k)
          return (
            <Panel key={k} hot={a} onClick={() => setOn((s) => { const n = new Set(s); a ? n.delete(k) : n.add(k); return n })} className={cx('flex min-h-[11.6rem] flex-col', !a && 'opacity-55')}>
              <div className="flex items-center justify-between"><I className="h-8 w-8 text-orange" strokeWidth={1.3} /><span className={cx('grid h-6 w-6 place-items-center rounded-md border', a ? 'border-orange bg-orange text-black' : 'border-hair')}>{a && <Check className="h-4 w-4" />}</span></div>
              <div className="mt-auto font-display text-[1.35rem] font-bold">{k}</div>
              <div className="num mt-0.5 text-[1.15rem] text-amber">{f}</div>
            </Panel>
          )
        })}
      </div>
    </Slide>
  )
}

/* 8 */
function S8() {
  const [hours, setHours] = useState(8); const [rate, setRate] = useState(2500)
  const [d, setD] = useState({ repair: 6000, labor: 1800, scrap: 1200, logistics: 800, risk: 1000 })
  const direct = Object.values(d).reduce((a, b) => a + b, 0)
  const down = hours * rate; const total = down + direct
  const parts = [{ k: 'Downtime', v: down }, { k: 'Repair', v: d.repair }, { k: 'Labor', v: d.labor }, { k: 'Scrap', v: d.scrap }, { k: 'Logistics', v: d.logistics }, { k: 'Risk', v: d.risk }]
  const shades = ['var(--color-orange)', 'var(--color-amber)', '#d4d8dd', '#9aa3ad', '#6e7782', '#4a525c']
  return (
    <Slide title="Map the Cost of One Breakdown" tag={<Tag kind="placeholder" />}>
      <div className="grid gap-3 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col gap-3">
          <Panel>
            <div className="kicker">Cost / Event</div>
            <p className="mt-1 font-display text-[1.42rem] leading-tight font-semibold">Downtime × contribution / hour</p>
            <p className="font-display text-[1.2rem] leading-tight text-ink/85">+ repair + labor + scrap + logistics + risk</p>
          </Panel>
          <Panel className="flex-1">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
              <NumField label="Downtime" suffix="hours" value={hours} onChange={setHours} step={0.5} />
              <NumField label="Contribution" prefix="$" suffix="/ hour" value={rate} onChange={setRate} step={100} />
              {(['repair', 'labor', 'scrap', 'logistics', 'risk'] as const).map((k) => <NumField key={k} label={k[0].toUpperCase() + k.slice(1)} prefix="$" value={d[k]} step={100} onChange={(v) => setD((x) => ({ ...x, [k]: v }))} />)}
            </div>
          </Panel>
        </div>
        <div className="flex flex-col gap-3">
          <Panel>
            <div className="kicker">Factory-specific placeholders</div>
            <div className="num mt-2 space-y-0.5 font-display text-[1.14rem]">
              <div><Sr>[ ___ hours ] × [ $ ___ / hour ]</Sr>[ <span className="text-amber">{hours}</span> hours ] × [ $ <span className="text-amber">{rate.toLocaleString('en-US')}</span> / hour ]</div>
              <div><Sr>+ [ $ ___ direct costs ]</Sr>+ [ $ <span className="text-amber">{direct.toLocaleString('en-US')}</span> direct costs ]</div>
            </div>
            <Sr>= [ $ ___ per breakdown ]</Sr>
          </Panel>
          <Result label="= per breakdown" value={<AnimatedNumber value={total} format={fmtMoney} />} sub="Example inputs, not evidence. Replace them with values for your factory." />
          <Panel className="flex-1">
            <div className="flex h-5 overflow-hidden rounded-md" role="img" aria-label="Cost breakdown by component">
              {parts.map((p, i) => <motion.div key={p.k} animate={{ width: `${total ? (p.v / total) * 100 : 0}%` }} transition={{ duration: 0.35 }} className="border-r-2 border-[#171d24] last:border-0" style={{ background: shades[i] }} title={`${p.k}: ${money(p.v)}`} />)}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[0.86rem] lg:grid-cols-3">
              {parts.map((p, i) => <div key={p.k} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: shades[i] }} /><span className="text-mute">{p.k}</span><span className="num ml-auto font-medium">{total ? Math.round((p.v / total) * 100) : 0}%</span></div>)}
            </div>
          </Panel>
        </div>
      </div>
    </Slide>
  )
}

/* 9 */
function S9() {
  const [a, setA] = useState(2)
  const lv = [
    { k: 'TAM', d: 'All relevant assets and customers', s: 100 },
    { k: 'SAM', d: 'Reachable segment with the right data and channels', s: 66 },
    { k: 'SOM', d: 'Realistic early share — constrained by sales capacity and proof', s: 34 },
  ]
  return (
    <Slide title="Estimate the Addressable Market">
      <div className="grid items-center gap-5 lg:grid-cols-[1fr_1.1fr]">
        <Rise className="relative mx-auto aspect-square w-full max-w-[26rem]">
          {lv.map((l, i) => (
            <button key={l.k} type="button" aria-pressed={a === i} aria-label={l.k} onClick={() => setA(i)} className={cx('absolute bottom-0 left-1/2 flex -translate-x-1/2 items-start justify-center rounded-full border-2 transition-all', a === i ? 'border-orange bg-orange/30 shadow-[0_0_2rem_color-mix(in_srgb,var(--color-orange)_35%,transparent)]' : 'border-line bg-orange/[.07] hover:bg-orange/15')} style={{ width: `${l.s}%`, height: `${l.s}%` }}>
              <span className="mt-[9%] font-display text-[1.6rem] font-bold">{l.k}</span>
            </button>
          ))}
        </Rise>
        <div className="flex flex-col gap-2.5">
          {lv.map((l, i) => (
            <Panel key={l.k} hot={a === i} onClick={() => setA(i)} className={cx(a === i && 'glass-o')}><div className="font-display text-[1.45rem] font-bold text-amber">{l.k}</div><p className="mt-0.5 text-[1.12rem] leading-snug">{l.d}</p></Panel>
          ))}
          <div className="mt-1"><Tag kind="deck" label="A framework, not fabricated market statistics." /></div>
        </div>
      </div>
    </Slide>
  )
}

/* 10 */
function S10() {
  const [v, setV] = useState({ a: 0, b: 0, c: 0, d: 0 })
  const total = v.a * v.b * v.c * (v.d / 100)
  return (
    <Slide title="Bottom-Up Market Sizing" sub="Build from observable customers and a defensible price — then apply capacity and conversion constraints." tag={<Tag kind="placeholder" label="Inputs start blank, as in the deck" />}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: 'A', t: 'Target sites', k: 'a', blank: '___' }, { l: 'B', t: 'Qualifying assets / site', k: 'b', blank: '___' },
          { l: 'C', t: 'Annual price / asset', k: 'c', p: '$', blank: '$ ___' }, { l: 'D', t: 'Adoption rate', k: 'd', s: '%', blank: '___ %' },
        ].map((f) => (
          <Panel key={f.l} className="!p-4">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-orange font-display text-[1.4rem] font-bold text-black">{f.l}</div>
            <div className="mt-3 mb-2 min-h-[3rem] text-[1.1rem] leading-tight font-medium">{f.t}</div>
            <NumField label={`Enter ${f.l}`} prefix={f.p} suffix={f.s} value={(v as any)[f.k]} onChange={(n) => setV((x) => ({ ...x, [f.k]: n }))} step={f.k === 'c' ? 100 : 1} />
            <Sr>{f.blank}</Sr>
          </Panel>
        ))}
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_1fr]">
        <Result label="ANNUAL OPPORTUNITY  =  A × B × C × D" value={total ? <AnimatedNumber value={total} format={fmtMoney} /> : <span className="text-mute">Enter inputs</span>} sub={total ? `${v.a} × ${v.b} × $${v.c.toLocaleString('en-US')} × ${v.d}%` : 'The deck leaves every input blank on purpose.'} />
        <Panel className="flex items-center justify-between gap-3">
          <p className="text-[1rem] leading-snug text-mute">Need a starting point? The deck's explicitly hypothetical example fills these values on a later slide.</p>
          <button type="button" onClick={() => setV({ a: 40, b: 25, c: 1200, d: 20 })} className="btn-ghost shrink-0 rounded-full px-3.5 py-1.5 text-[0.88rem]">Load example</button>
        </Panel>
      </div>
    </Slide>
  )
}

/* 11 */
function S11() {
  const data = [['FAILURE LOGS', 'date • asset • fault mode', FileBarChart], ['DOWNTIME', 'start • restore • lost output', Clock], ['COSTS', 'parts • labor • scrap', DollarSign], ['CONDITION DATA', 'signal • sample rate • history', Activity], ['ASSET BASE', 'count • age • duty cycle', Cog], ['BUYING DATA', 'budget • owner • renewal', Briefcase]] as const
  const [on, setOn] = useState<Set<number>>(new Set())
  return (
    <Slide title="What Data Do We Need?">
      <Rise className="mb-3 flex items-center gap-3"><div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-gradient-to-r from-orange to-amber" animate={{ width: `${(on.size / 6) * 100}%` }} /></div><span className="num text-[0.9rem] text-mute">Data sources gathered: <span className="font-semibold text-amber">{on.size} / 6</span></span></Rise>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.map(([k, f, I], i) => {
          const a = on.has(i)
          return (
            <Panel key={k} hot={a} onClick={() => setOn((s) => { const n = new Set(s); a ? n.delete(i) : n.add(i); return n })} className="flex min-h-[10.8rem] flex-col">
              <div className="flex items-center justify-between"><I className="h-7 w-7 text-orange" strokeWidth={1.3} /><span className={cx('grid h-6 w-6 place-items-center rounded-md border', a ? 'border-orange bg-orange text-black' : 'border-hair')}>{a && <Check className="h-4 w-4" />}</span></div>
              <div className="mt-auto font-display text-[1.25rem] font-bold">{k}</div>
              <div className="mt-0.5 text-[1.08rem] text-mute">{f}</div>
            </Panel>
          )
        })}
      </div>
    </Slide>
  )
}

/* 12 */
function S12() {
  const rows = [['User segment', 'Specific + reachable?'], ['Frequency', 'Measured per exposure?'], ['Severity', 'Full cost captured?'], ['Alternatives', 'Pain poorly served?'], ['Feasibility', 'Data + workflow fit?']]
  const [score, setScore] = useState<(number | null)[]>(rows.map(() => null))
  const [ev, setEv] = useState(rows.map(() => ''))
  const scored = score.filter((s): s is number => s !== null)
  const total = scored.reduce((a, b) => a + b, 0)
  return (
    <Slide title="Problem-Sizing Table" tag={<span className="text-[0.84rem] text-mute">Score each row 1–5 and note the evidence</span>}>
      <Rise className="glass overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[42rem] border-collapse text-left">
          <thead><tr className="border-b border-line text-[0.82rem] tracking-[0.14em] text-amber">{['CATEGORY', 'QUESTION', 'EVIDENCE', 'SCORE'].map((h) => <th key={h} scope="col" className="px-4 py-2.5 font-display font-semibold">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map(([c, q], i) => (
              <tr key={c} className="border-b border-hair last:border-0 hover:bg-white/[.025]">
                <th scope="row" className="px-4 py-2.5 font-display text-[1.14rem] font-semibold">{c}</th>
                <td className="px-4 py-2.5 text-[1.05rem] text-mute">{q}</td>
                <td className="px-4 py-2.5"><input type="text" aria-label={`Evidence for ${c}`} placeholder="__________" value={ev[i]} onChange={(e) => setEv((x) => x.map((v, k) => (k === i ? e.target.value : v)))} /></td>
                <td className="px-4 py-2.5">
                  <div role="group" aria-label={`Score for ${c}, 1–5`} className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" aria-pressed={score[i] === n} onClick={() => setScore((x) => x.map((v, k) => (k === i ? (v === n ? null : n) : v)))} className={cx('num grid h-8 w-8 place-items-center rounded-lg border text-[0.92rem] font-semibold transition-colors', score[i] !== null && n <= score[i]! ? 'border-orange bg-orange text-black' : 'border-hair hover:border-orange/70')}>{n}</button>)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Rise>
      <Rise className="mt-3 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-orange/10 px-5 py-3">
        <span className="font-display text-[1.2rem] font-semibold">Total score</span>
        <span className="num font-display text-[2rem] font-bold text-amber">{total}<span className="text-[1.1rem] text-mute"> / 25</span></span>
        <span className="text-[0.92rem] text-mute">{scored.length} of 5 rows scored</span>
        <button type="button" onClick={() => { setScore(rows.map(() => null)); setEv(rows.map(() => '')) }} className="btn-ghost ml-auto rounded-full px-3 py-1 text-[0.84rem]">Reset table</button>
      </Rise>
    </Slide>
  )
}

/* 13/14 */
const BOOST = ['High cost per event', 'Frequent repeatable failure modes', 'Existing sensor / historian data', 'Clear maintenance owner', 'Short payback expectation', 'Multi-site replication potential']
const SETBK = ['Rare or random fault patterns', 'Low downtime economics', 'Missing or inaccessible data', 'Long integration cycle', 'No trusted action workflow', 'Buyer cannot capture savings']
function CaseMeter() {
  const { picked } = useEval()
  const b = BOOST.filter((x) => picked.has(x)).length; const s = SETBK.filter((x) => picked.has(x)).length
  return (
    <Rise className="glass mt-3 flex flex-wrap items-center gap-4 rounded-2xl px-5 py-3">
      <span className="font-display text-[1.05rem] font-semibold">Case meter</span>
      <div className="relative h-3 min-w-[10rem] flex-1 rounded-full bg-white/10">
        <span aria-hidden className="absolute top-[-3px] left-1/2 h-[calc(100%+6px)] w-[2px] bg-white/40" />
        {b > 0 && <motion.span className="absolute top-0 left-1/2 h-full rounded-r-full bg-good" animate={{ width: `${(b / 6) * 50}%` }} />}
        {s > 0 && <motion.span className="absolute top-0 right-1/2 h-full rounded-l-full bg-bad" animate={{ width: `${(s / 6) * 50}%` }} />}
      </div>
      <span className="num text-[0.95rem]"><span className="font-semibold text-[#ff8b7c]">{s}</span> setbacks · <span className="font-semibold text-good">{b}</span> boosters</span>
    </Rise>
  )
}
function EvalGrid({ list, sign }: { list: string[]; sign: '+' | '–' }) {
  const { picked, toggle } = useEval()
  const I = sign === '+' ? Plus : Minus
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((s) => {
        const a = picked.has(s)
        return (
          <Panel key={s} hot={a} onClick={() => toggle(s)} className="flex min-h-[10.3rem] flex-col justify-between">
            <span className={cx('grid h-10 w-10 place-items-center rounded-full', a ? (sign === '+' ? 'bg-good text-black' : 'bg-bad text-black') : sign === '+' ? 'bg-good/15 text-good' : 'bg-bad/15 text-[#ff8b7c]')}><I className="h-5 w-5" strokeWidth={2.4} /></span>
            <span className="font-display text-[1.32rem] leading-tight font-semibold">{s}</span>
          </Panel>
        )
      })}
    </div>
  )
}
function S13() { return <Slide title="Evaluation Boosters" tag={<span className="text-[0.84rem] text-mute">Select those that apply to your case</span>}><EvalGrid list={BOOST} sign="+" /><CaseMeter /></Slide> }
function S14() { return <Slide title="Evaluation Setbacks" tag={<span className="text-[0.84rem] text-mute">Select those that apply to your case</span>}><EvalGrid list={SETBK} sign="–" /><CaseMeter /></Slide> }

/* 15 */
function S15() {
  const alt = [['Reactive repair', 'Low setup', 'High disruption'], ['Calendar PM', 'Simple planning', 'Over- / under-maintenance'], ['Manual rounds', 'Human context', 'Infrequent + variable'], ['OEM monitoring', 'Deep asset knowledge', 'Narrow + costly'], ['Predictive service', 'Earlier signal', 'Needs data + trust']]
  const [a, setA] = useState(4)
  return (
    <Slide title="Current Alternatives">
      <div className="flex flex-col gap-2">
        {alt.map(([k, p, m], i) => (
          <Panel key={k} hot={a === i} onClick={() => setA(i)} className={cx('grid items-center gap-2 !py-3.5 sm:grid-cols-[1fr_1fr_1fr]', a === i && 'glass-o')}>
            <span className="font-display text-[1.32rem] font-bold">{k}</span>
            <span className="flex items-center gap-2 text-[1.14rem]"><Plus className="h-4 w-4 shrink-0 text-good" strokeWidth={2.5} />{p}</span>
            <span className="flex items-center gap-2 text-[1.14rem] text-ink/85"><Minus className="h-4 w-4 shrink-0 text-[#ff8b7c]" strokeWidth={2.5} />{m}</span>
          </Panel>
        ))}
      </div>
    </Slide>
  )
}

/* 16 */
function S16() {
  const crit = ['Critical rotating assets', 'repeatable fault signatures', 'measurable downtime cost', 'accessible condition data', 'maintenance team able to act on warnings']
  const assets = [['motors', Settings2], ['pumps', Gauge], ['fans', Fan], ['gearboxes', Cog]] as const
  return (
    <Slide title="Where Predictive Maintenance Fits" sub={<span className="font-display text-[1.5rem] font-semibold text-amber">Start narrow.</span>}>
      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <div className="flex flex-col gap-3">
          <Panel orange>
            <div className="kicker">Best initial use case</div>
            <p className="mt-1.5 text-[1.24rem] leading-snug">Critical rotating assets with repeatable fault signatures, measurable downtime cost, accessible condition data, and a maintenance team able to act on warnings.</p>
          </Panel>
          <div className="flex flex-wrap gap-1.5" aria-hidden>{crit.map((c) => <Rise key={c} className="flex items-center gap-1.5 rounded-full border border-hair px-3 py-1 text-[0.88rem] capitalize"><Check className="h-3.5 w-3.5 text-orange" />{c}</Rise>)}</div>
          <Panel>
            <div className="text-[1.04rem] font-medium text-mute">Example focus: motors, pumps, fans, gearboxes.</div>
            <div className="mt-2.5 grid grid-cols-4 gap-2">{assets.map(([a, I]) => <div key={a} className="lift flex flex-col items-center gap-1.5 rounded-xl border border-hair py-3 capitalize"><I className="h-7 w-7 text-orange" strokeWidth={1.3} />{a}</div>)}</div>
          </Panel>
        </div>
        <Photo src="/img/s4-16.webp" alt="Row of pumps and motors in a clean plant" className="h-[18rem] lg:h-[25rem]" />
      </div>
    </Slide>
  )
}

/* 17 */
function S17() {
  const [a, setA] = useState(40); const [b, setB] = useState(25); const [c, setC] = useState(1200); const [d, setD] = useState(20)
  const arr = a * b * c * (d / 100)
  const fields = [
    { v: a, set: setA, min: 5, max: 100, step: 1, f: `${a}`, l: 'target sites' }, { v: b, set: setB, min: 5, max: 100, step: 1, f: `${b}`, l: 'assets / site' },
    { v: c, set: setC, min: 200, max: 4000, step: 100, f: `$${c.toLocaleString('en-US')}`, l: 'annual price / asset' }, { v: d, set: setD, min: 1, max: 60, step: 1, f: `${d}%`, l: 'initial adoption' },
  ]
  const isOriginal = a === 40 && b === 25 && c === 1200 && d === 20
  return (
    <Slide title="Illustrative Worked Example" tag={<Tag kind="hypothetical" label="Explicitly hypothetical — replace every input with customer evidence." />}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {fields.map((x) => (
          <Panel key={x.l}>
            <div className="num font-display text-[2.6rem] leading-none font-bold text-amber">{x.f}</div>
            <div className="mt-1 text-[1.04rem] text-mute">{x.l}</div>
            <input type="range" className="mt-3" aria-label={x.l} min={x.min} max={x.max} step={x.step} value={x.v} onChange={(e) => x.set(Number(e.target.value))} />
          </Panel>
        ))}
      </div>
      <Rise className="mt-4 rounded-2xl border border-orange/60 bg-gradient-to-r from-orange/25 to-transparent p-6">
        <div className="num font-display text-[1.32rem] text-ink/85">{a} × {b} × ${c.toLocaleString('en-US')} × {d}%  =</div>
        <div className="mt-1 font-display text-[3.4rem] leading-none font-bold"><AnimatedNumber value={arr} format={fmtMoney} /> <span className="text-[1.6rem] text-amber">ARR</span></div>
        <div className="mt-2 flex items-center gap-3 text-[0.9rem] text-mute">
          {isOriginal ? 'Showing the deck’s original inputs: 40 × 25 × $1,200 × 20%  =  $240,000 ARR' : 'Inputs changed from the deck’s original example.'}
          {!isOriginal && <button type="button" onClick={() => { setA(40); setB(25); setC(1200); setD(20) }} className="btn-ghost rounded-full px-3 py-0.5 text-[0.84rem]">Reset to deck values</button>}
        </div>
      </Rise>
    </Slide>
  )
}

/* 18 */
function S18() {
  const [v, setV] = useState({ loss: 0, savings: 0, sub: 0, en: 0 })
  const value = v.loss + v.savings; const price = v.sub + v.en; const surplus = value - price
  const max = Math.max(value, price, 1)
  return (
    <Slide title="Can the Service Capture Value?" tag={<Tag kind="placeholder" label="Inputs start blank: use your own evidence" />}>
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_0.95fr]">
        <Panel>
          <div className="font-display text-[1.22rem] font-bold text-amber">CUSTOMER VALUE</div>
          <div className="mt-2 space-y-2"><NumField label="Avoided loss" prefix="$" step={1000} value={v.loss} onChange={(n) => setV((x) => ({ ...x, loss: n }))} /><NumField label="+ maintenance savings" prefix="$" step={1000} value={v.savings} onChange={(n) => setV((x) => ({ ...x, savings: n }))} /></div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-good" animate={{ width: `${(value / max) * 100}%` }} /></div>
          <div className="num mt-1 text-[0.95rem]">{money(value)}</div>
        </Panel>
        <Panel>
          <div className="font-display text-[1.22rem] font-bold text-amber">SERVICE PRICE</div>
          <div className="mt-2 space-y-2"><NumField label="Subscription" prefix="$" step={1000} value={v.sub} onChange={(n) => setV((x) => ({ ...x, sub: n }))} /><NumField label="+ enablement" prefix="$" step={1000} value={v.en} onChange={(n) => setV((x) => ({ ...x, en: n }))} /></div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-orange" animate={{ width: `${(price / max) * 100}%` }} /></div>
          <div className="num mt-1 text-[0.95rem]">{money(price)}</div>
        </Panel>
        <Result label="Customer surplus" value={value || price ? <AnimatedNumber value={surplus} format={(n) => (n < 0 ? '−' : '') + money(Math.abs(n))} /> : <span className="text-mute">Enter values</span>} sub={value || price ? (surplus > 0 ? 'A visible surplus is left for the customer.' : 'No surplus: price does not leave value for the customer.') : 'Customer value minus service price'} />
      </div>
      <Panel orange className="mt-3"><p className="font-display text-[1.45rem] leading-tight font-semibold">Price must leave a visible, credible surplus for the customer.</p></Panel>
      <Panel className="mt-3 text-[1.1rem] leading-snug">Test willingness to pay against budget ownership, procurement friction, implementation cost, and time to verified savings.</Panel>
    </Slide>
  )
}

/* 19 */
function S19() {
  const plan = [['Interview', '10–15 operators, maintainers, buyers', Users], ['Audit logs', 'Failures, downtime, cost, exposure', Database], ['Instrument', 'Baseline signal quality on 1–2 assets', Activity], ['Pilot', 'Measure warning time and actions', FlaskConical], ['Decide', 'Scale, narrow, or stop', Scale]] as const
  const [done, setDone] = useState(0)
  return (
    <Slide title="Validation Plan" sub="Each step replaces an assumption with evidence." tag={<span className="text-[0.84rem] text-mute">Mark steps complete; each unlocks the next</span>}>
      <div className="grid gap-2.5 lg:grid-cols-5">
        {plan.map(([k, d, I], i) => {
          const isDone = i < done; const cur = i === done
          return (
            <Panel key={k} hot={cur} onClick={() => setDone(isDone && i === done - 1 ? i : cur ? i + 1 : done)} className={cx('flex min-h-[19rem] flex-col', i > done && 'opacity-50', isDone && 'glass-o')}>
              <div className="flex items-center justify-between"><span className="num font-display text-[1.7rem] font-bold text-orange">0{i + 1}</span>{isDone ? <Check className="h-6 w-6 text-good" /> : <I className="h-6 w-6 text-amber" strokeWidth={1.4} />}</div>
              <div className="mt-4 font-display text-[1.32rem] font-bold">{k}</div>
              <p className="mt-2 text-[1.08rem] leading-snug text-ink/85">{d}</p>
              <span className="mt-auto pt-3 text-[0.8rem] text-mute">{isDone ? 'Evidence in hand' : cur ? 'Select to complete' : 'Locked'}</span>
            </Panel>
          )
        })}
      </div>
      <Rise className="mt-3 flex items-center gap-3"><div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-gradient-to-r from-orange to-amber" animate={{ width: `${(done / 5) * 100}%` }} /></div><span className="num text-[0.9rem] text-mute">{done} / 5</span></Rise>
    </Slide>
  )
}

/* 20 */
function S20() {
  const tests = ['segment is reachable', 'failure frequency is measurable', 'impact is material', 'service can capture value after integration cost']
  const [c, setC] = useState(tests.map(() => false))
  const all = c.every(Boolean)
  return (
    <div className="grid min-h-full items-center gap-6 lg:grid-cols-[1.5fr_1fr]">
      <Stagger>
        <Rise><h1 className="font-display text-[3.8rem] leading-[0.98] font-bold tracking-tight lg:text-[5rem]">Size before<br /><span className="text-orange">you solve.</span></h1></Rise>
        <Rise><p className="mt-4 text-[1.18rem] leading-snug">Proceed when the segment is reachable, failure frequency is measurable, impact is material, and the service can capture value after integration cost.</p></Rise>
        <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {tests.map((t, i) => (
            <Rise key={t}><button type="button" aria-pressed={c[i]} onClick={() => setC((x) => x.map((v, k) => (k === i ? !v : v)))} className={cx('glass lift flex h-full w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[0.98rem] leading-tight', c[i] && 'hot')}>
              <span className={cx('grid h-5 w-5 shrink-0 place-items-center rounded-md border', c[i] ? 'border-orange bg-orange text-black' : 'border-hair')}>{c[i] && <Check className="h-3.5 w-3.5" />}</span><span className="block first-letter:uppercase">{t}</span>
            </button></Rise>
          ))}
        </div>
        <Rise className={cx('mt-3 rounded-xl border p-3 text-[1.14rem] leading-snug font-medium transition-colors', all ? 'border-good/70 bg-good/10' : 'border-line bg-orange/10')}>
          {all ? <span className="flex items-center gap-2 text-good"><ClipboardCheck className="h-5 w-5 shrink-0" />Evidence supports proceeding.</span> : <span>If the evidence is weak: narrow the asset, improve the denominator, or stop.</span>}
          {all && <Sr>If the evidence is weak: narrow the asset, improve the denominator, or stop.</Sr>}
        </Rise>
      </Stagger>
      <Photo src="/img/s4-20.webp" alt="Engineer studying dashboards with a robot arm in the background" className="h-[22rem] lg:h-[33rem]" />
    </div>
  )
}

export default [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20]
