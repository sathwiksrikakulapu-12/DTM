import { motion } from 'framer-motion'
import { Fragment } from 'react'
import { ArrowDownRight, ArrowUpRight, Box, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, Clock3, Database, FlaskConical, Lightbulb, Play, ShieldCheck, Siren, Sparkle, Users } from 'lucide-react'
import { atKey, countOf, firstOf, goSlide, lastOf, navigate, sections, slides, TOTAL } from '../engine/store'
import { lastViewed, MeshBackground, SECTION_ICONS, SectionSidebar, TopNav } from '../engine/Chrome'
import { Deferred, LazyHero, Scene3D, Motor2DFallback } from '../three/Stage'
import { cx } from '../ui/kit'

function Gauge({ value }: { value: number }) {
  const r = 42; const c = Math.PI * r; const off = c * (1 - value / 100)
  return (
    <svg viewBox="0 0 110 62" className="mx-auto w-full max-w-[9rem]" role="img" aria-label={`Illustrative asset health ${value} percent`}>
      <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="#ff5a5f" /><stop offset=".5" stopColor="#ffb13b" /><stop offset="1" stopColor="#34e39a" /></linearGradient></defs>
      <path d="M13 56a42 42 0 0 1 84 0" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="7" strokeLinecap="round" />
      <motion.path d="M13 56a42 42 0 0 1 84 0" fill="none" stroke="url(#g)" strokeWidth="7" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: off }} transition={{ duration: 1.3, ease: 'easeOut' }} />
      <text x="55" y="47" textAnchor="middle" fill="#F6F7FB" fontFamily="Space Grotesk Variable" fontWeight="700" fontSize="19">{value}%</text>
      <text x="55" y="59" textAnchor="middle" fill="#34e39a" fontSize="7.5">Healthy</text>
    </svg>
  )
}

const directions = [
  { icon: ShieldCheck, label: 'Downtime risk', dir: 'down', text: 'lower' },
  { icon: Clock3, label: 'Asset life', dir: 'up', text: 'longer' },
  { icon: CircleDollarSign, label: 'Maintenance cost', dir: 'down', text: 'lower' },
]

/** Animated circuit lines behind the hero. */
const CircuitLines = () => (
  <svg aria-hidden viewBox="0 0 800 300" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full opacity-60">
    {[
      ['M0 60H160L200 100H420L460 60H800', '#3fd9ff', 9], ['M0 210H110L150 170H340L390 220H800', '#c58bff', 13],
      ['M0 120H70L110 150H260L300 120H560L620 170H800', '#ff8a00', 11], ['M0 270H240L280 240H640L680 275H800', '#2fe39a', 15],
    ].map(([d, c, s]) => (
      <g key={d as string}>
        <path d={d as string} fill="none" stroke={c as string} strokeOpacity=".16" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <circle r="2.4" fill={c as string}><animateMotion dur={`${s}s`} repeatCount="indefinite" path={d as string} /></circle>
      </g>
    ))}
  </svg>
)

export default function Home() {
  const last = lastViewed()
  const activeSection = sections.find((s) => last >= firstOf(s.id) && last <= lastOf(s.id))?.id ?? 1
  return (
    <div className="theme-home relative min-h-dvh overflow-x-hidden bg-bg lg:flex lg:h-dvh lg:flex-col lg:overflow-hidden">
      <MeshBackground />
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <img src={import.meta.env.BASE_URL + 'img/s3-01.webp'} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[.2] saturate-[.9]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#060a18_6%,rgba(6,10,24,.45)_42%,rgba(6,10,24,.25)_70%,#060a18_100%),linear-gradient(180deg,rgba(6,10,24,.05)_40%,#060a18_80%)]" />
      </div>
      <CircuitLines />

      <TopNav transparent />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-2 px-2.5 pt-2.5 pb-2 lg:px-3">
        <div className="relative flex min-h-0 flex-1 flex-col gap-2.5 lg:flex-row">
          <SectionSidebar active={activeSection} current={last > 1 ? last : undefined} className="order-3 w-full shrink-0 lg:order-none lg:w-[11.4rem]" />

          <div className="relative order-2 h-[22rem] w-full lg:absolute lg:inset-y-[-0.6rem] lg:right-[11.9rem] lg:left-[29rem] lg:order-none lg:h-auto lg:w-auto lg:[mask-image:linear-gradient(90deg,transparent,#000_9%,#000_96%,transparent),linear-gradient(180deg,#000_90%,transparent)] lg:[mask-composite:intersect]">
            <Scene3D fallback={<div className="ml-auto h-full w-full max-w-[34rem] p-6"><Motor2DFallback /></div>}>
              <Deferred ms={80}><LazyHero /></Deferred>
            </Scene3D>
          </div>

          <div className="pointer-events-none relative order-1 flex min-w-0 flex-col justify-center py-2 lg:order-none lg:w-[26rem] lg:pl-4">
            <div className="kicker text-[0.72rem] text-ink/80">Design Thinking × Industrial Systems</div>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-2.5 font-display text-[2.7rem] leading-[0.98] font-bold tracking-tight lg:text-[3.1rem]">
              PREDICTIVE<br /><span className="grad-text">MAINTENANCE</span>
            </motion.h1>
            <div className="mt-2.5 font-display text-[1.4rem] font-semibold">A Human-Centered Approach</div>
            <p className="mt-1.5 max-w-[24rem] text-[0.96rem] leading-snug text-ink/85">Applying design thinking and methodology to turn machine data into timely, trusted and actionable maintenance.</p>
            <div className="glass mt-2.5 flex w-fit flex-wrap items-center gap-x-3 gap-y-1 rounded-full px-3 py-1 text-[0.78rem]">
              {[[Users, 'People', '#c58bff'], [Database, 'Data', '#3fd9ff'], [Lightbulb, 'Design', '#ff8ad1'], [Sparkle, 'Value', '#2fe39a']].map(([I, l, c]: any, i) => (
                <Fragment key={l}>{i > 0 && <span className="h-3 w-px bg-hair" />}<span className="flex items-center gap-1.5"><I className="h-[0.9rem] w-[0.9rem]" style={{ color: c }} strokeWidth={1.8} />{l}</span></Fragment>
              ))}
            </div>
            <div className="pointer-events-auto mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => goSlide(1)} className="btn-primary flex items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-[0.92rem]">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-black/85"><Play className="h-3.5 w-3.5 fill-white text-white" /></span>Start Presentation<ChevronRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => navigate('/factory')} className="btn-ghost flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.92rem] font-medium"><Box className="h-4 w-4 text-amber" />Explore in 3D</button>
            </div>
            <a href="#/explore" className="pointer-events-auto mt-2 flex w-fit items-center gap-1 text-[0.76rem] text-mute hover:text-amber"><ChevronDown className="bob h-4 w-4 text-cool" />Explore all {TOTAL} slides</a>
          </div>

          <div className="relative order-4 ml-auto flex w-full shrink-0 flex-col gap-2 lg:order-none lg:w-[11.4rem]">
            <div className="glass-o flex-1 rounded-2xl p-2.5">
              <div className="flex items-baseline justify-between"><div className="font-display text-[1rem] font-semibold">Asset Health</div><span className="text-[0.62rem] text-amber">Illustrative</span></div>
              <Gauge value={92} />
              <ul className="mt-1 divide-y divide-hair text-[0.74rem]">
                {directions.map(({ icon: I, label, dir, text }) => (
                  <li key={label} className="flex items-center gap-1.5 py-1">
                    <I className="h-[0.9rem] w-[0.9rem] shrink-0 text-amber" strokeWidth={1.7} /><span className="flex-1 leading-tight">{label}</span>
                    <span className="flex items-center gap-0.5 font-medium text-good">{dir === 'down' ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid shrink-0 grid-cols-2 gap-1.5">
              <button type="button" onClick={() => goSlide(atKey(1, 'simulator'))} className="glass lift flex flex-col items-center rounded-xl p-1.5 text-center text-[0.72rem] leading-tight font-medium"><Siren className="mb-0.5 h-4 w-4 text-[#ff8a8e]" />Failure simulator</button>
              <button type="button" onClick={() => goSlide(atKey(1, 'machine'))} className="glass lift flex flex-col items-center rounded-xl p-1.5 text-center text-[0.72rem] leading-tight font-medium"><FlaskConical className="mb-0.5 h-4 w-4 text-cool" />3D motor lab</button>
            </div>
            <button type="button" onClick={() => navigate('/factory')} className="photo hover-zoom lift group relative h-[4.9rem] shrink-0 overflow-hidden rounded-2xl border border-line text-left">
              <img src={import.meta.env.BASE_URL + 'img/s3-06.webp'} alt="" />
              <span className="absolute inset-0 z-10 grid place-items-center"><span className="grid h-8 w-8 place-items-center rounded-full bg-orange text-black shadow-[0_0_1.2rem_color-mix(in_srgb,var(--color-orange)_70%,transparent)] transition-transform group-hover:scale-110"><Play className="h-3.5 w-3.5 fill-current" /></span></span>
              <span className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 to-transparent px-2 pt-3 pb-1 text-center text-[0.72rem] font-medium">Enter the 3D Factory</span>
            </button>
          </div>
        </div>

        <section aria-label="The six-section journey" className="glass flex shrink-0 flex-col gap-2 rounded-2xl px-4 py-1.5 lg:flex-row lg:items-center lg:gap-5">
          <div className="font-display text-[1rem] font-semibold whitespace-nowrap">The Journey</div>
          <div className="relative flex flex-1 items-center justify-between">
            <div aria-hidden className="absolute top-[1.05rem] right-[4%] left-[4%] h-[2px] bg-gradient-to-r from-[#b983ff] via-[#ff9a1f] via-40% to-[#35c8ff]" />
            {sections.map((s, i) => {
              const I = SECTION_ICONS[s.icon]
              return (
                <motion.button key={s.id} type="button" onClick={() => goSlide(firstOf(s.id))} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }}
                  className={cx(`theme-${s.id}`, 'group relative z-10 flex min-w-0 flex-col items-center')}>
                  <span className="grid h-[2.1rem] w-[2.1rem] place-items-center rounded-full border border-orange bg-[#0d1224] text-orange transition-all group-hover:bg-orange group-hover:text-black group-hover:shadow-[0_0_1rem_var(--color-orange)]"><I className="h-[1rem] w-[1rem]" strokeWidth={1.8} /></span>
                  <span className="mt-0.5 max-w-[7.5rem] text-center text-[0.76rem] leading-[1.1] font-medium">{s.title}</span>
                </motion.button>
              )
            })}
          </div>
        </section>

        <section aria-label="Section previews" className="grid shrink-0 grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-6">
          {sections.map((s, i) => {
            const seen = last >= lastOf(s.id) ? 100 : last < firstOf(s.id) ? 0 : ((last - firstOf(s.id) + 1) / countOf(s.id)) * 100
            return (
              <motion.button key={s.id} type="button" onClick={() => goSlide(firstOf(s.id))} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06 }} whileHover={{ y: -4 }}
                className={cx(`theme-${s.id}`, 'hover-zoom group relative h-[9.2rem] overflow-hidden rounded-2xl border border-line text-left transition-shadow hover:border-orange hover:shadow-[0_0_1.5rem_color-mix(in_srgb,var(--color-orange)_45%,transparent)]')}>
                <div className="photo absolute inset-0"><img src={import.meta.env.BASE_URL + s.img.replace(/^\//, '')} alt="" loading="lazy" style={{ objectPosition: s.id === 2 ? '50% 12%' : '50% 40%' }} /></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--tint)_70%,#04060f)] via-[color-mix(in_srgb,var(--tint)_55%,transparent)] to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-2">
                  <div className="flex items-center gap-1.5">
                    <span className="num rounded-full border border-orange bg-black/50 px-1.5 font-display text-[0.74rem] font-bold text-amber">{String(s.id).padStart(2, '0')}</span>
                    <span className="font-display text-[0.86rem] leading-tight font-semibold">{s.title}</span>
                  </div>
                  <p className="mt-0.5 line-clamp-3 text-[0.68rem] leading-[1.18] text-ink/80">{s.desc}</p>
                  <span className="num mt-0.5 block text-[0.64rem] font-medium text-amber">{countOf(s.id)} slides</span>
                  <span aria-hidden className="mt-1 block h-[3px] overflow-hidden rounded-full bg-white/15"><span className="block h-full bg-gradient-to-r from-orange to-amber" style={{ width: `${seen}%` }} /></span>
                </div>
              </motion.button>
            )
          })}
        </section>

        <div className="flex shrink-0 items-center gap-3">
          <span className="num rounded-full border border-line bg-black/30 px-3 py-0.5 font-display text-[0.78rem] font-semibold"><span className="text-amber">{String(last).padStart(2, '0')}</span> / {TOTAL}</span>
          <span className="hidden truncate text-[0.72rem] text-mute lg:inline">{slides[last - 1]?.title}</span>
          <button type="button" aria-label="Jump to a position in the presentation" className="relative h-4 flex-1" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); goSlide(Math.ceil(((e.clientX - r.left) / r.width) * TOTAL)) }}>
            <span className="absolute top-1/2 h-1 w-full -translate-y-1/2 overflow-hidden rounded-full bg-white/10"><span className="block h-full bg-gradient-to-r from-cool via-amber to-orange" style={{ width: `${(last / TOTAL) * 100}%` }} /></span>
          </button>
          <button type="button" aria-label="Previous slide" onClick={() => goSlide(Math.max(1, last - 1))} className="btn-ghost grid h-7 w-7 place-items-center rounded-full"><ChevronLeft className="h-4 w-4" /></button>
          <button type="button" aria-label="Continue presentation" onClick={() => goSlide(last)} className="grid h-7 w-7 place-items-center rounded-full border border-orange bg-orange/15 text-amber"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  )
}
