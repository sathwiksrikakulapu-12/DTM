// Validates the mandatory presentation structure. Run with: npm run validate
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const read = (p) => JSON.parse(fs.readFileSync(path.join(here, '..', 'src', 'data', p), 'utf8'))
const { sections, decks } = read('manifest.json')
const text = read('sourceText.json')

const REQUIRED = ['Empathy Mapping', 'Brainstorming', 'Problem Sizing', 'Journey Mapping', 'Convergence and Divergence', 'Visualization']
const errors = []
if (sections.length !== 6) errors.push(`Expected 6 sections, found ${sections.length}`)
REQUIRED.forEach((name, i) => { if (sections[i]?.title !== name) errors.push(`Section ${i + 1} should be "${name}", found "${sections[i]?.title}"`) })

let total = 0
for (const s of sections) {
  total += s.slides.length
  console.log(`${s.title}: ${s.slides.length} slides`)
  if (s.slides.length !== 20) errors.push(`${s.title} has ${s.slides.length} slides, expected 20`)
}
console.log(`Total: ${total} slides`)
if (total !== 120) errors.push(`Total is ${total}, expected 120`)

// Every source slide must appear exactly once.
const seen = new Map()
for (const s of sections) for (const sl of s.slides) for (const [ref] of sl.parts) {
  if (/^s\d:/.test(ref)) seen.set(ref, (seen.get(ref) ?? 0) + 1)
}
let sourceTotal = 0
for (const deck of Object.keys(decks)) {
  const count = text[deck].length; sourceTotal += count
  for (let k = 1; k <= count; k++) {
    const c = seen.get(`${deck}:${k}`) ?? 0
    if (c !== 1) errors.push(`${decks[deck]} slide ${k} appears ${c} times`)
  }
}
console.log(`Source slides mapped: ${seen.size} of ${sourceTotal}`)

if (errors.length) { console.error('\nINVALID:\n- ' + errors.join('\n- ')); process.exit(1) }
console.log('\nStructure valid: 6 sections × 20 slides = 120 slides, and every source slide is mapped exactly once.')
