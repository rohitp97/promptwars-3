# Trace — Challenge 3 Design Document
### Hack2Skill x Google PromptWars | Carbon Footprint Tracker
*"Every choice leaves a trace. Know yours."*

---

## 1. Why EcoTrace v1 Was Wrong

The original EcoTrace concept (calculator wizard → dashboard → bar charts) is exactly the pattern
the instructor called out: "solving a problem that has already been solved multiple times over."

The brief's actual challenge: **make invisible data feel personal and urgent enough to change behavior**.
A dashboard does not do this. A number does not do this. A story does.

---

## 2. The Core Insight

> "Data without context, emotion, and personalization does nothing."
> — Instructor, YouTube Live

The real problem is not that people lack carbon data.  
The real problem is that carbon consequences feel **abstract, distant, and someone else's problem**.

48°C Delhi summers are not abstract. Bengaluru floods are not abstract. A child's asthma attack from
AQI 400 air is not abstract.

The solution: **connect every individual choice to a real consequence that already happened in India**.

---

## 3. The Concept: Trace

**"Every choice leaves a trace. Know yours."**

Trace is not a carbon tracker. It is a **carbon consequence storyteller**.

Instead of asking "how much CO₂ did I produce?", Trace asks:
- "What did my choice actually do to the world?"
- "What would have happened if I'd chosen differently?"
- "What is the world around me right now, because of choices like mine?"

### Three Core Innovations

**1. Consequence Stories (Gemini)**
Every logged decision generates a 3–4 sentence personal narrative that connects your specific
choice to a real climate consequence in your city. Not guilt-tripping. Honest, grounded storytelling.

*Example:* You log "Flew Delhi → Mumbai"
Gemini response: *"Your flight released 255 kg of CO₂ — about four months of electricity for an
average Delhi household. The Arabian Sea surface temperature hit record highs in 2024 partly because
of cumulative emissions from routes like this one. Next time, the Rajdhani Express covers this route
in 16 hours and emits 96% less carbon."*

**2. The Living Scene (Ripple)**
An SVG animated cityscape — sky, trees, a river, buildings — that visually reacts to your
cumulative logged choices. As your footprint grows, the sky grays, trees disappear, the river
muddies, smokestacks activate. As you make better choices, the scene clears.

This is the emotional hook. You can *see* your impact evolving.

**3. Simulate (Decision-Point Nudge)**
Before making a choice, compare two options side-by-side. See the consequence stories for both.
Get a Gemini recommendation. Then decide — and if you choose the lower-impact option, log it as a
climate win.

This is the "tiny well-timed nudge at the decision point" the instructor described.

---

## 4. App Structure: 4 Screens

```
┌─────────────────────────────────┐
│          Journal (Home)         │  ← Chronological feed of decisions + stories
├─────────────────────────────────┤
│           [+ Log]               │  ← FAB: Quick 3-step decision log (30 sec)
├─────────────────────────────────┤
│         Ripple Scene            │  ← Living SVG cityscape
├─────────────────────────────────┤
│           Simulate              │  ← Before-the-decision comparison tool
└─────────────────────────────────┘
```

### Screen 1: Journal (Home)
- Scrollable feed, newest first
- Each card: decision label + carbon amount in relatable units + Gemini story
- City context badge: links to a real India climate event relevant to the category
- Empty state: "Your climate story starts with one choice. Log your first decision."
- Monthly summary at top: "This month: X decisions logged, Y kg CO₂, Z climate wins"

### Screen 2: Log a Decision (FAB)
Three steps, 30 seconds total:

**Step 1 — Category** (icon grid, one tap):
✈️ Travel | 🍔 Food | ⚡ Energy | 🛍️ Shopping | ♻️ Climate Win

**Step 2 — Specific Action** (pre-built activity list, scrollable):
- Travel: Domestic flight / International flight / Drove 50+ km (petrol) / Metro or Bus / Auto-rickshaw / Cycled or Walked
- Food: Non-veg meal / Vegetarian meal / Food delivery order / Wasted food / Home-cooked meal
- Energy: AC all day / Left lights/fans on overnight / Switched to ceiling fan instead of AC
- Shopping: Bought new clothing / Online order / New device / Bought second-hand

**Step 3 — Confirm**
- Shows carbon estimate in relatable unit ("= X tree-days to absorb")
- "Log It" button → Gemini generates story → card added to journal → scene updates

**Also in Step 1**: "Before I Decide..." toggle → goes to Simulate screen instead

### Screen 3: Ripple Scene
An SVG animated cityscape with these reactive elements:

```
Sky (gradient: #87CEEB → #B0C4DE → #808080 → #3D3D3D)
  └─ Sun circle (opacity: 1.0 → 0.6 → 0.3 → 0.05)
  └─ Haze particles (opacity: 0 → 0.2 → 0.5 → 0.8)
City skyline (silhouette rectangles)
  └─ Smokestacks (display: none → visible at high footprint)
  └─ Smoke animation (CSS @keyframes, respects prefers-reduced-motion)
Trees (6 SVG tree groups, fade out progressively)
River/ground (color: #4FC3F7 → #78909C → #546E7A → #37474F)
Real-time ticker at bottom: India climate events
```

Scene state derived from cumulative CO₂ logged this month:
- < 50 kg: Clear sky, 6 trees, blue river, no smoke
- 50–150 kg: Hazy sky, 4 trees, murky river, no smoke
- 150–300 kg: Gray sky, 2 trees, dirty river, smokestacks active
- > 300 kg: Brown sky, 1 tree, polluted river, heavy smoke, red sun

### Screen 4: Simulate
- Pick Choice A and Choice B from the activity library
- Gemini generates a consequence story for each
- Shows: carbon difference + which is better + specific recommendation
- "I'll choose B (lower impact)" → logs as Climate Win to journal

---

## 5. Activity Library (The Data Layer)

```typescript
// Pre-built activities — no wizard needed, one tap to log

export const ACTIVITIES: Activity[] = [
  // Travel
  { id: 'flight_domestic', label: 'Domestic flight', sublabel: 'e.g. Delhi → Mumbai', category: 'travel', icon: '✈️', kgCO2: 255, unit: 'per flight' },
  { id: 'flight_international', label: 'International flight', sublabel: 'e.g. Delhi → London', category: 'travel', icon: '🌍', kgCO2: 1100, unit: 'per flight' },
  { id: 'drive_long', label: 'Long drive (50 km)', sublabel: 'Petrol/diesel car', category: 'travel', icon: '🚗', kgCO2: 9.6, unit: 'per trip' },
  { id: 'drive_local', label: 'City drive (10 km)', sublabel: 'Petrol/diesel car', category: 'travel', icon: '🚗', kgCO2: 1.9, unit: 'per trip' },
  { id: 'auto_rickshaw', label: 'Auto-rickshaw', sublabel: '10 km ride', category: 'travel', icon: '🛺', kgCO2: 0.9, unit: 'per trip' },
  { id: 'metro_bus', label: 'Metro or Bus', sublabel: '10 km commute', category: 'travel', icon: '🚇', kgCO2: 0.4, unit: 'per trip' },
  { id: 'cycle_walk', label: 'Cycled or walked', sublabel: 'Any distance', category: 'travel', icon: '🚴', kgCO2: 0, unit: 'per trip', isWin: true },
  // Food
  { id: 'nonveg_meal', label: 'Non-veg meal', sublabel: 'With chicken, fish, or mutton', category: 'food', icon: '🍗', kgCO2: 3.2, unit: 'per meal' },
  { id: 'veg_meal', label: 'Vegetarian meal', sublabel: 'Home-cooked or restaurant', category: 'food', icon: '🥗', kgCO2: 1.1, unit: 'per meal' },
  { id: 'food_delivery', label: 'Food delivery order', sublabel: 'Swiggy / Zomato', category: 'food', icon: '🛵', kgCO2: 1.5, unit: 'per order' },
  { id: 'food_waste', label: 'Wasted food', sublabel: 'Threw away a meal or ingredients', category: 'food', icon: '🗑️', kgCO2: 2.5, unit: 'incident' },
  { id: 'home_cooked_veg', label: 'Home-cooked veg meal', sublabel: 'With minimal packaging', category: 'food', icon: '🍲', kgCO2: 0.7, unit: 'per meal', isWin: true },
  // Energy
  { id: 'ac_day', label: 'AC on all day', sublabel: '8+ hours (1.5 ton unit)', category: 'energy', icon: '❄️', kgCO2: 3.0, unit: 'per day' },
  { id: 'ac_avoided', label: 'Skipped AC today', sublabel: 'Used ceiling fan instead', category: 'energy', icon: '🌀', kgCO2: -2.5, unit: 'per day', isWin: true },
  { id: 'lights_overnight', label: 'Lights/fans overnight', sublabel: 'Left on while sleeping', category: 'energy', icon: '💡', kgCO2: 0.5, unit: 'per night' },
  // Shopping
  { id: 'new_clothing', label: 'Bought new clothing', sublabel: 'Any garment', category: 'shopping', icon: '👕', kgCO2: 8.5, unit: 'per item' },
  { id: 'online_order', label: 'Online shopping order', sublabel: 'Amazon / Flipkart delivery', category: 'shopping', icon: '📦', kgCO2: 0.8, unit: 'per order' },
  { id: 'phone_upgrade', label: 'New smartphone', sublabel: 'Device upgrade', category: 'shopping', icon: '📱', kgCO2: 70, unit: 'per device' },
  { id: 'secondhand', label: 'Bought second-hand', sublabel: 'Clothing, electronics, etc.', category: 'shopping', icon: '♻️', kgCO2: 1.0, unit: 'per item', isWin: true },
];
```

---

## 6. Gemini Integration

### Consequence Story Prompt
```
You are Trace, a climate storyteller for India. The user just logged a specific action.
Write a consequence story: 3–4 sentences, second-person ("Your..."), emotionally honest but not preachy.

Structure:
1. Acknowledge the specific action and its carbon weight in ONE relatable comparison (not kg)
2. Connect it to a REAL climate consequence happening right now in India (pick the most relevant city/event)
3. End with ONE specific, concrete alternative for next time

Real India climate context to draw from:
- Delhi recorded 48.8°C on May 28, 2024 (hottest day on record for the city)
- Delhi AQI crossed 400 for 3 consecutive weeks in November 2024
- Bengaluru saw its worst flooding in 50 years in 2022; Sarjapur Road was underwater for days
- Bengaluru's lakes reduced by 79% over 50 years due to encroachment and pollution
- Mumbai received 944mm of rain in 24 hours in July 2023, flooding Andheri and Kurla
- The Gangotri glacier has retreated 22 km since 1780, threatening Gangetic drinking water for 500M people
- Marine heatwaves in the Arabian Sea in 2024 intensified Cyclone Biparjoy and bleached coral reefs

DO NOT: lecture, use carbon jargon, be vague, add lists, use headers.
FORMAT: Plain text, 3-4 sentences only.

User's action: {activityLabel}
Carbon equivalent: {kgCO2} kg CO₂
Relatable comparison: {relatableUnit}
```

### Simulate Comparison Prompt
```
Compare two choices for someone in India. Be concise and direct.
Return JSON only:
{
  "choiceA": { "story": "2-sentence consequence for choice A" },
  "choiceB": { "story": "2-sentence consequence for choice B" },
  "verdict": "One sentence recommending which is better and why",
  "savingKg": number (how much CO₂ is saved by choosing B over A)
}

Choice A: {activityA.label} ({activityA.kgCO2} kg CO₂)
Choice B: {activityB.label} ({activityB.kgCO2} kg CO₂)
```

---

## 7. Relatable Units (No Raw kg Shown to Users)

```typescript
export function toRelatableUnit(kgCO2: number): string {
  if (kgCO2 <= 0) return 'net-zero impact';
  if (kgCO2 < 1) return `${Math.round(kgCO2 * 60)} minutes of Indian coal power`;
  if (kgCO2 < 5) return `${(kgCO2 / 0.192).toFixed(0)} km in a petrol car`;
  if (kgCO2 < 50) return `${Math.ceil(kgCO2 / 1.75)} days for a tree to absorb`;
  if (kgCO2 < 200) return `${Math.round(kgCO2 / 0.82)} kWh of Delhi grid power`;
  return `${(kgCO2 / 255).toFixed(1)} Delhi–Mumbai flights equivalent`;
}
```

The user never sees "255 kg CO₂". They see "= 1,328 km in a petrol car" or "= 146 days for a tree to absorb."

---

## 8. Architecture

### File Structure
```
src/
├── types/index.ts
├── lib/
│   ├── activities.ts          # Activity library (the pre-built list)
│   ├── carbon-utils.ts        # Pure functions: relatable units, scene state
│   ├── gemini-prompts.ts      # Prompt builders (pure string functions)
│   └── storage.ts             # localStorage abstraction
├── hooks/
│   ├── useJournal.ts          # CRUD on journal entries
│   ├── useScene.ts            # Derives SceneState from journal
│   └── useGemini.ts           # Gemini API calls
├── components/
│   ├── journal/
│   │   ├── JournalFeed.tsx
│   │   └── StoryCard.tsx
│   ├── log/
│   │   ├── LogSheet.tsx       # Bottom sheet, 3-step flow
│   │   ├── CategoryGrid.tsx
│   │   └── ActivityList.tsx
│   ├── scene/
│   │   ├── RippleScene.tsx    # SVG cityscape
│   │   ├── SceneSky.tsx
│   │   ├── SceneCity.tsx
│   │   ├── SceneTrees.tsx
│   │   └── ClimateTicker.tsx
│   └── simulate/
│       ├── SimulateView.tsx
│       └── ComparisonCard.tsx
├── __tests__/
│   ├── carbon-utils.test.ts
│   ├── activities.test.ts
│   └── gemini-prompts.test.ts
├── App.tsx
└── index.css
```

### Tech Stack
| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 18 + TypeScript (strict) | Type-safe, testable |
| Build | Vite | Fast, great DX |
| Styling | Tailwind CSS v3 | No runtime cost |
| Scene | Inline SVG + CSS animations | No canvas dependency, accessible |
| AI | Gemini 2.0 Flash (`@google/genai`) | Fast, structured output |
| Icons | Lucide React | Tree-shakeable |
| Testing | Vitest + Testing Library | Co-located with Vite |
| Storage | localStorage | No backend |

---

## 9. Judging Criteria Alignment

### Code Quality
- All business logic in pure functions (`lib/`) — zero side effects
- `useJournal`, `useScene`, `useGemini` — state fully abstracted from UI
- Strict TypeScript: no `any`, discriminated unions for category types
- `gemini-prompts.ts` contains only string-building pure functions — easily audited

### Security
- API key in `.env` (VITE_GEMINI_API_KEY), never in source
- Gemini response stories rendered as text (not HTML) — no XSS surface
- If structured JSON from Gemini: parsed with try/catch, validated against expected shape before use
- localStorage values validated on read (safeGet pattern with fallback)
- CSP meta tag in `index.html`

### Efficiency
- Activity list is a static constant — zero computation, zero API calls
- Scene state is `useMemo`-derived from journal — recomputes only when entries change
- Gemini called only on: (a) new log entry, (b) simulate request
- Stories cached in the journal entry itself — never re-fetched
- Lazy-loaded screens (React.lazy + Suspense)
- SVG scene: CSS animations only, no JS animation loop, no canvas

### Testing
- `carbon-utils.ts`: test every relatable unit threshold + scene state derivation
- `activities.ts`: validate every activity has required fields, no duplicate IDs, kgCO2 ≥ 0
- `gemini-prompts.ts`: test prompt builders return correct interpolated strings
- All testable without mocking Gemini (prompts are pure string functions)

### Accessibility
- SVG scene: `role="img"` + `aria-label` describing current scene state
- Bottom sheet: focus-trapped when open, Escape to close, `aria-modal`
- Journal feed: `aria-live="polite"` so screen readers announce new entries
- Activity list: keyboard-navigable (Arrow keys + Enter), `role="listbox"`
- Skip-to-content link
- `prefers-reduced-motion`: disables all SVG/CSS animations
- Full keyboard access to all 4 screens via bottom nav

---

## 10. What Makes This Win

| What Every Other Submission Does | What Trace Does |
|----------------------------------|-----------------|
| Calculator wizard → monthly CO₂ score | Decision-by-decision consequence log |
| Bar chart dashboard | Living, emotional cityscape |
| "You produced 50 kg this month" | "Your flight added 146 days to a tree's work" |
| Monthly reflection | Decision-point simulation before you choose |
| Generic global tips | Stories rooted in Delhi 48°C, Bengaluru floods |
| Numbers that don't land | Narratives that do |

The instructor said: **"build an application that genuinely makes a user feel something."**

When a user sees the Delhi sky in their Ripple Scene turn from clear blue to hazy brown because
of their logged choices this month — they feel something. That is the design goal.

---

*Trace — Every choice leaves a trace. Know yours.*
*Built for PromptWars Challenge 3 | Hack2Skill x Google | Built using Google Antigravity*
