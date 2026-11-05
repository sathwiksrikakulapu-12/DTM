import { useState, type ComponentType } from 'react'
import { BarChart3, BrainCircuit, Database, HeartHandshake, Lightbulb, Radio } from 'lucide-react'
import { Bar, BarChart } from 'recharts'
import { AnimatedNumber, money, Panel, Rise, Slide, Tag } from '../ui/kit'
import { ArchDiagram, DeepDive, Quiz, SectionSummary, type ArchNode } from '../ui/lab'
import { axis, ChartTip, Grid, Legend, legendStyle, ResponsiveContainer, Tooltip, XAxis, YAxis } from '../ui/charts'

const NODES: ArchNode[] = [
  { k: 'Machine Sensors', icon: Radio, purpose: 'Reveal how customer assets are behaving.', how: 'Retrofit or built-in sensors capture vibration, temperature, pressure and current.', inputs: 'Physical machine behaviour.', outputs: 'Raw condition signals.', next: 'Signals are collected through a secure gateway.' },
  { k: 'Data Collection', icon: Database, purpose: 'Bring diverse signals into one asset model.', how: 'Secure connectivity normalises signals from different machines and vendors.', inputs: 'Signals plus operating context.', outputs: 'Clean, identified time-series data.', next: 'The shared data feeds the analytics engine.' },
  { k: 'Analytics', icon: BarChart3, purpose: 'Detect deterioration across the connected fleet.', how: 'Baselines, anomaly models and failure-risk models score each asset.', inputs: 'Normalised data and history.', outputs: 'Risk scores and health trends.', next: 'Scores become prioritised insights.' },
  { k: 'Predictive Insights', icon: BrainCircuit, purpose: 'Explain which asset needs attention and why.', how: 'Ranks risk by consequence and shows the evidence behind it.', inputs: 'Risk scores and asset criticality.', outputs: 'Prioritised, explainable insights.', next: 'Insights become a recommended action.' },
  { k: 'Maintenance Recommendation', icon: Lightbulb, purpose: 'Name the next step, the owner and the timing.', how: 'Experts and rules translate the insight into a work order for the team.', inputs: 'Insights and maintenance plans.', outputs: 'Work order and planned window.', next: 'The customer team acts, and the outcome is recorded.' },
  { k: 'Customer Value', icon: HeartHandshake, purpose: 'Deliver measurable outcomes that justify renewal.', how: 'Less downtime, planned labour and lower cost are tracked and reviewed.', inputs: 'Completed work and confirmed outcomes.', outputs: 'Verified value, retention and new learning.', next: 'Learning flows back and improves every earlier stage.' },
]
function Pipeline() {
  return <Slide kicker="Data-to-value pipeline" title="Data-to-Value Pipeline" sub="Select a stage to follow how data becomes value for an industrial customer." tag={<Tag kind="web" label="Added explainer" />}><ArchDiagram nodes={NODES} /></Slide>
}

function Revenue() {
  const [assets, setAssets] = useState(500); const [price, setPrice] = useState(40); const [cost, setCost] = useState(22); const [fixed, setFixed] = useState(4000)
  const mrr = assets * price; const svc = assets * cost + fixed; const contrib = mrr - svc
  const chart = [100, 250, 500, 1000, 2000].map((a) => ({ assets: a, Revenue: a * price, 'Service cost': a * cost + fixed }))
  const sliders = [
    { l: 'Connected assets', v: assets, set: setAssets, min: 50, max: 2000, step: 50, f: `${assets}` }, { l: 'Price per asset / month', v: price, set: setPrice, min: 10, max: 100, step: 1, f: `$${price}` },
    { l: 'Variable service cost per asset / month', v: cost, set: setCost, min: 5, max: 80, step: 1, f: `$${cost}` }, { l: 'Fixed platform cost / month', v: fixed, set: setFixed, min: 0, max: 20000, step: 500, f: money(fixed) },
  ]
  return (
    <Slide kicker="Revenue model" title="Subscription and Revenue Model" sub="Explore why scale matters: fixed platform costs spread across more connected assets." tag={<Tag kind="hypothetical" label="All values hypothetical, not a price quote" />}>
      <div className="grid gap-3 lg:grid-cols-[1fr_1.35fr]">
        <div className="flex flex-col gap-2">
          <Panel className="space-y-1.5 !py-3">{sliders.map((s) => <label key={s.l} className="block text-[0.86rem] text-mute"><span className="flex justify-between"><span>{s.l}</span><b className="num text-ink">{s.f}</b></span><input type="range" aria-label={s.l} min={s.min} max={s.max} step={s.step} value={s.v} onChange={(e) => s.set(Number(e.target.value))} /></label>)}</Panel>
          <div className="grid grid-cols-2 gap-2" data-testid="revenue">
            <Panel orange className="!p-3"><div className="kicker text-[0.7rem]">Monthly recurring revenue</div><div className="font-display text-[1.7rem] font-bold"><AnimatedNumber value={mrr} format={(n) => money(n)} /></div></Panel>
            <Panel orange className="!p-3"><div className="kicker text-[0.7rem]">Monthly contribution</div><div className={'font-display text-[1.7rem] font-bold ' + (contrib < 0 ? 'text-[#ff8a8e]' : 'text-good')}><AnimatedNumber value={contrib} format={(n) => (n < 0 ? '−' : '') + money(Math.abs(n))} /></div></Panel>
          </div>
        </div>
        <Rise className="glass rounded-2xl p-3">
          <div className="font-display font-semibold">Revenue and service cost by number of assets</div>
          <div className="mt-1 h-[20rem]">
            <ResponsiveContainer><BarChart data={chart} margin={{ top: 8, right: 8, left: 6, bottom: 0 }} barGap={3}><Grid /><XAxis dataKey="assets" {...axis} /><YAxis {...axis} width={58} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} /><Tooltip content={<ChartTip prefix="$" />} cursor={{ fill: 'rgba(255,255,255,.04)' }} /><Legend wrapperStyle={legendStyle} verticalAlign="top" height={24} /><Bar dataKey="Revenue" fill="var(--color-orange)" radius={[4, 4, 0, 0]} animationDuration={350} /><Bar dataKey="Service cost" fill="var(--color-cool)" radius={[4, 4, 0, 0]} animationDuration={350} /></BarChart></ResponsiveContainer>
          </div>
        </Rise>
      </div>
    </Slide>
  )
}

const Q = () => <Quiz title="Check your understanding: the service" questions={[
  { q: 'What is the “value moment” in the customer journey?', options: ['Signing the contract', 'Installing the sensors', 'The first trusted prediction that changes a maintenance decision', 'The first invoice'], correct: 2, why: 'This is the deck’s definition, and it marks when the customer first sees the service change an outcome.' },
  { q: 'What flows back in the business model?', options: ['Sensors and cables', 'Learning and retention', 'Only payment', 'Nothing'], correct: 1, why: '“Value flows right, learning and retention flow back.” That loop is what makes it a service.' },
  { q: 'Which package suits a customer just starting out?', options: ['Visibility', 'Prediction', 'Outcome', 'None of them'], correct: 0, why: 'Visibility offers connectivity, a health dashboard and basic alerts, and customers can scale up as maturity grows.' },
  { q: 'Which control addresses model drift?', options: ['Encrypt + govern', 'Monitor performance', 'Design for legacy', 'Tune to consequence'], correct: 1, why: 'Model performance has to be tracked over time because operating conditions and machines change.' },
]} />

const S = () => <SectionSummary title="Visualization in review"
  concepts={['Signal-to-value service loop', 'Business model and architecture', 'Service packages', 'Customer journey and value moment']}
  findings={['Each stakeholder sees a slice of one asset truth', 'Illustrative economics improve with scale', 'Trust needs controls and human accountability']}
  insights={['The first trusted prediction is the value moment', 'Human judgment stays in the loop', 'Start narrow, then scale']}
  applications={['Per-asset monitoring subscriptions', 'Prioritised maintenance dashboards', 'Outcome-based service options']}
  takeaway="Turn asset signals into service value." />

const extras: Record<string, ComponentType> = { pipeline: Pipeline, revenue: Revenue, quiz: Q, summary: S, 'dd-paas': () => <DeepDive id="paas" /> }
export default extras
