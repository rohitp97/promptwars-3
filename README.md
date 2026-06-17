# Trace
### Every choice leaves a trace. Know yours.

> Built for **PromptWars Virtual — Challenge 3: Carbon Footprint**
> Organized by Hack2Skill × Google | Built using **Google Antigravity**

---

## The Problem with Carbon Footprint Apps

Every existing carbon tracker does the same thing: ask you a bunch of questions, produce a number in kg CO₂, show you a bar chart, and suggest you "eat less meat."

None of that changes behaviour. Because **data without context, emotion, and personalisation does nothing.**

Knowing you produced "158 kg CO₂ this month" is meaningless. Knowing that your Delhi–Mumbai flight added 146 days to the work a tree needs to do — against the backdrop of Delhi recording 48.8°C on May 28, 2024 — is not.

---

## What Trace Does Differently

Trace is a **carbon consequence storyteller**, not a calculator.

Instead of giving users a score, it gives them a story — a personal, emotionally grounded narrative connecting their specific choices to real climate events already happening in India.

### Three Core Interactions

**1. Decision Journal**
Log one decision at a time (not a monthly survey). Each logged entry gets a Gemini-generated consequence story: 3–4 sentences, second person, India-specific, tied to a named real-world event like Bengaluru's 72-hour flood or Delhi's AQI 400+ weeks.

**2. Ripple Scene**
A living SVG cityscape — sky, trees, river, buildings — that visually reacts to your cumulative monthly footprint. Log a flight and watch the sky gray, trees disappear, and smokestacks activate. Make better choices and the scene clears. No chart. No number. Just the city you live in, changing.

**3. Simulate (Before I Decide)**
Pick two choices and compare their consequence stories *before* committing. This is the decision-point nudge the research says actually changes behaviour — intervening *before* the action, not after.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite |
| Styling | Tailwind CSS v3 |
| AI | Google Gemini 2.0 Flash (`@google/genai`) |
| Icons | Lucide React |
| Testing | Vitest + Testing Library |
| Storage | `localStorage` (no backend) |

---

## Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd trace-carbon

# 2. Install dependencies
npm install

# 3. Add your Gemini API key
cp .env.example .env
# Edit .env and set VITE_GEMINI_API_KEY=your_key_here
# Get a free key at https://aistudio.google.com

# 4. Start the dev server
npm run dev
# Open http://localhost:5173
```

### Run Tests

```bash
npm run test           # Run all tests (27 tests, 3 files)
npm run test:coverage  # Coverage report
```

### Production Build

```bash
npm run build   # Type-check + bundle
npm run preview # Preview production build
```

---

## Project Structure

```
src/
├── types/
│   └── index.ts               # All TypeScript interfaces and type aliases
├── lib/                       # Pure functions — no side effects, fully testable
│   ├── activities.ts          # Pre-built activity library (22 activities, 4 categories)
│   ├── carbon-utils.ts        # Emission calculations, relatable unit conversion, scene state
│   ├── gemini-prompts.ts      # Prompt builders (pure string functions)
│   └── storage.ts             # localStorage abstraction with safeGet/safeSet
├── hooks/
│   ├── useJournal.ts          # Journal CRUD, monthly summary, city-aware persistence
│   ├── useScene.ts            # Derives SVG scene state from journal entries
│   └── useGemini.ts           # Gemini API integration (story generation + simulation)
├── components/
│   ├── journal/               # JournalFeed + StoryCard with skeleton loader
│   ├── log/                   # LogSheet (bottom sheet), CategoryGrid, ActivityList
│   ├── scene/                 # RippleScene SVG (Sky, City, Trees, ClimateTicker)
│   └── simulate/              # SimulateView + ComparisonCard
├── __tests__/                 # Vitest tests for all lib functions
│   ├── carbon-utils.test.ts
│   ├── activities.test.ts
│   └── gemini-prompts.test.ts
└── App.tsx                    # Root: 4-tab navigation, city selector, FAB
```

---

## India-Calibrated Data

Generic carbon apps use European or US emission factors. Trace uses India-specific numbers:

| Source | Factor Used |
|--------|-------------|
| Electricity grid | 0.82 kg CO₂/kWh (CEA 2024) |
| Domestic flight | 255 kg CO₂/flight (incl. radiative forcing) |
| Auto-rickshaw | 0.089 kg CO₂/km |
| Metro / Bus | 0.041 kg CO₂/km |
| Petrol car | 0.192 kg CO₂/km |

### Relatable Units (not raw kg)

Users never see "255 kg CO₂". They see:

- `= 1.0 Delhi–Mumbai flights equivalent`
- `= 146 days for a tree to absorb`
- `= 1,328 km in a petrol car`
- `= 311 kWh of Delhi grid electricity`

### India Climate Context in Every Story

Gemini consequence stories reference real, named events:
- Delhi's 48.8°C record on May 28, 2024
- Delhi AQI 400+ for 3 consecutive weeks (November 2024)
- Bengaluru's worst flooding in 50 years (September 2022)
- Gangotri glacier retreating 22 km since 1780
- Arabian Sea marine heatwaves intensifying monsoon volatility (2024)
- 1,800 Indians dying daily from air pollution (Lancet 2019)

---

## Judging Criteria

### Code Quality
- All business logic in pure functions under `lib/` — zero side effects, zero React dependencies
- Custom hooks abstract all state from UI components
- Strict TypeScript throughout: no `any`, `unknown` with explicit type narrowing on all external data
- `crypto.randomUUID()` for all ID generation
- Single source of truth for all CSS animations in `index.css` — no inline style injection

### Security
- Gemini API key in `.env` (`VITE_GEMINI_API_KEY`), never in source
- All Gemini JSON validated against expected shape before use — malformed responses fall back gracefully
- `unknown` type used for all external data, narrowed before casting
- Gemini content rendered as plain text — no XSS surface
- Content-Security-Policy meta tag in `index.html`
- No `dangerouslySetInnerHTML` anywhere in the codebase

### Efficiency
- Carbon calculations memoized via `useMemo` — recomputes only when entries change
- Scene state derived once per journal update, not on every render
- Gemini called only on explicit user actions (log or compare) — never on navigation
- Stories cached inside journal entries — never re-fetched
- All CSS animations defined once in `index.css` — not injected per component instance

### Testing
- 27 tests across 3 files, all passing
- Tests cover pure functions only — no mocks needed
- Full boundary value coverage on `toRelatableUnit` and `deriveSceneState`
- Edge cases: negative kgCO2 (climate wins), cross-month filtering, empty arrays
- Intentional exceptions explicitly documented in test assertions

### Accessibility
- Skip-to-content link (first DOM element)
- `role="dialog"` and `aria-modal="true"` on the sheet panel, not the backdrop
- Focus trapped inside LogSheet when open; returns to FAB on close
- Escape key closes all bottom sheets
- `aria-live="polite"` on journal feed — screen readers announce new entries
- `aria-busy` + `aria-label` on skeleton loaders
- `role="img"` + descriptive `aria-label` on the Ripple Scene SVG
- All interactive elements keyboard-navigable
- `:focus-visible` ring applied globally
- `prefers-reduced-motion` kills all animations

---

## Key Design Decisions

**Why a journal, not a dashboard?**
Dashboards aggregate and abstract. A journal is personal and specific. "Your flight today added 146 days to a tree's work" lands differently than "Transport: 255 kg this month."

**Why India-specific emission factors?**
India's electricity grid runs at 0.82 kg CO₂/kWh — 3.4× dirtier than the EU average. Using global averages would underestimate Indian urban footprints by up to 40%.

**Why no backend?**
`localStorage` means zero setup friction. The journal is personal by nature — no account needed, works offline, instantly available on first load.

**Why no monthly carbon score?**
A cumulative score encourages the wrong mental model. Decision-by-decision logging keeps every individual choice meaningful.

---

## Assumptions

1. **Target user**: Urban Indian (Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad). Activities and factors reflect this context.
2. **No backend**: Data persists in `localStorage`. City-aware keys mean each city gets its own journal.
3. **Activity library**: 22 pre-built activities cover the most common high-impact choices.
4. **Gemini fallback**: If the API is unavailable, stories fall back gracefully. The full app (journal, Ripple Scene, Simulate) works without AI.
5. **Emission factors**: Based on CEA 2024 grid data and published lifecycle studies.

---

## Acknowledgements

- India grid emission factor: [Central Electricity Authority (CEA) 2024](https://cea.nic.in)
- Climate event data: Lancet Countdown 2024, IMD records, IPCC AR6
- AI: Google Gemini 2.0 Flash via `@google/genai`
- Built entirely using **Google Antigravity**

---

*PromptWars Virtual — Challenge 3 | Hack2Skill × Google*
