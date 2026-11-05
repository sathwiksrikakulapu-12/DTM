// Regenerates ../docs/content-inventory.md from the slide manifest and the extracted deck text.
// Run with: npm run inventory
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const read = (p) => JSON.parse(fs.readFileSync(path.join(here, '..', 'src', 'data', p), 'utf8'))
const { sections, decks } = read('manifest.json')
const text = read('sourceText.json')
const esc = (x) => String(x).replace(/\|/g, '\\|')

let n = 0
const out = [
  '# Content inventory', '',
  '6 sections × 20 slides = 120 slides. Source slides are never dropped: a website slide can hold several as tabs.',
  'Open any slide directly at `#/slide/<No.>`.', '',
]
for (const s of sections) {
  out.push(`## Section ${String(s.id).padStart(2, '0')}: ${s.title}`, '', `${s.desc} Visual style: ${s.style}.`, '')
  out.push('| No. | In section | Title | Source | Web treatment |', '|---|---|---|---|---|')
  s.slides.forEach((sl, i) => {
    n++
    const src = sl.parts.map(([ref]) => {
      const m = /^(s\d):(\d+)$/.exec(ref)
      return m ? `${decks[m[1]].replace('Predictive Maintenance ', '').replace(/\.(pptx|pdf)$/, '')}, slide ${m[2]}` : 'Added for the web'
    }).join('; ')
    out.push(`| ${n} | ${i + 1} | ${esc(sl.title)} | ${esc(src)} | ${esc(sl.visual)} |`)
  })
  out.push('')
}
out.push('## Source slides and where they appear', '')
const where = new Map()
let c = 0
for (const s of sections) for (const sl of s.slides) { c++; for (const [ref] of sl.parts) where.set(ref, `${c} (${s.title})`) }
for (const d of Object.keys(decks)) {
  out.push(`### ${decks[d]}`, '', '| Source slide | Website slide | First lines |', '|---|---|---|')
  text[d].forEach((lines, i) => out.push(`| ${i + 1} | ${where.get(`${d}:${i + 1}`) ?? 'NOT MAPPED'} | ${esc(lines.join(' ').slice(0, 90))} |`))
  out.push('')
}
const dest = path.join(here, '..', '..', 'docs', 'content-inventory.md')
fs.mkdirSync(path.dirname(dest), { recursive: true })
fs.writeFileSync(dest, out.join('\n'))
console.log('Wrote', dest, 'with', n, 'slides')
