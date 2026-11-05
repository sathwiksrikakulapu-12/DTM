# Predictive Maintenance: Interactive Presentation Website

A colourful, 3D, interactive presentation for the Design Thinking and Methodology subject.

**6 sections × 20 slides = 120 slides:**

| # | Section | Slides |
|---|---|---:|
| 1 | Empathy Mapping | 20 |
| 2 | Brainstorming | 20 |
| 3 | Problem Sizing | 20 |
| 4 | Journey Mapping | 20 |
| 5 | Convergence and Divergence | 20 |
| 6 | Visualization | 20 |

## Run it

Requires Node.js 18 or newer.

```bash
cd website
npm install
npm run dev
```

Open the address Vite prints, usually http://localhost:5173.

To present from an optimised build, which loads faster than the dev server:

```bash
cd website
npm run build
npm run preview
```

Vite prints the address, usually http://localhost:4173. Once dependencies are installed, the site works offline.

To check the slide structure:

```bash
cd website
npm run validate
```

## Keyboard controls

| Key | Action |
|---|---|
| Right arrow / Space | Next tab, then next slide |
| Left arrow | Previous tab, then previous slide |
| Shift + Right / Left | Next or previous section |
| Home / End | First or last slide |
| F | Toggle fullscreen |
| O | Presentation overview |
| G | Glossary |
| N | Go deeper, concept explainer and original slide text |
| Esc | Close overlays, exit fullscreen or presentation mode |

## How source content maps to the six sections

There are six source files containing 121 slides. Every source slide appears exactly once, and `npm run validate` checks this.
Where several source slides share one website slide, they appear as numbered tabs, and the arrow keys step through the tabs first. `docs/content-inventory.md` lists the full mapping.

| Section | Source |
|---|---|
| Empathy Mapping | Empathy deck |
| Brainstorming | Added ideation methods, plus most of the Engineering Students deck as idea material |
| Problem Sizing | Sizing deck |
| Journey Mapping | Journey Mapping deck |
| Convergence and Divergence | Added design-thinking stages, plus the Convergence PDF |
| Visualization | Visualization deck, plus the technical parts of the Engineering Students deck |

## Folders

```
Predictive-Maintenance-Website/
├── reference/        design reference image
├── presentations/    the source decks
├── docs/             content-inventory.md: every slide mapped to its source
└── website/
    ├── public/img/        images extracted from the decks
    ├── scripts/           validate-slides.mjs and build-inventory.mjs
    └── src/
        ├── data/          manifest (the 120-slide structure), verbatim deck text, takeaways, concepts, glossary
        ├── engine/        presentation state, deck, navigation chrome
        ├── sections/      s1-s6 source slides; x1-x6, brainstorming, divergence: added slides
        ├── labs/          3D motor anatomy, sensor dashboard, failure simulator
        ├── sim/           simulated signals, FFT and anomaly score
        ├── three/         procedural 3D machine and scenes, with fallback
        ├── pages/         home, explore, factory, insights, glossary, resources
        └── ui/            shared components, charts, concept explorer, quiz, plots
```

## How honesty is handled

- Every source slide keeps its verbatim text in the side drawer (press N, then "Original slide text").
- Labels mark content as Illustrative, Hypothetical, Placeholder inputs, Simulated, or Added.
- Added explanations contain standard engineering formulas and established design-thinking methods, but no statistics or research findings.
- Chart values were read from the chart images in the decks, and those slides say so.
- The manager and operator personas, emotional curve and journey cross-references are interpretations, and are labelled as such.
- The simulator and dashboard are demonstrations, not validated physical models.

## 3D settings

- `?no3d=1` in the address, or Resources > "Turn 3D off", shows images instead of 3D scenes. Labs keep working.
- `?tier=low` or `?tier=high` overrides automatic quality detection.
