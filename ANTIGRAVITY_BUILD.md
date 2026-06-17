# Trace — Antigravity Build Instructions
### Step-by-Step Prompt Sequence for Google Antigravity
*Challenge 3: Carbon Footprint | Hack2Skill x Google PromptWars*

---

## Pre-Build Setup

- [ ] Get Gemini API key at https://aistudio.google.com → use `gemini-2.0-flash`
- [ ] Stack: React 18 + TypeScript + Vite + Tailwind CSS v3 + Vitest
- [ ] NOT building: a calculator wizard, a bar chart dashboard, a monthly score

---

## MASTER PROMPT — Paste This First

```
Build a React 18 + TypeScript + Vite web application called "Trace" with the tagline
"Every choice leaves a trace. Know yours."

This is a carbon consequence storyteller — NOT a calculator or dashboard. Instead of
showing users a carbon number, it shows them a personalized narrative about what their
specific choice meant for the real world, connected to real climate events in India.

## Core Concept
- Users log individual decisions (flew today, ate non-veg, ordered online)
- Gemini generates a 3-4 sentence personal consequence story for each decision
- A living SVG cityscape ("Ripple Scene") visually reacts to their cumulative choices
- A "Simulate" mode shows consequence stories for two choices BEFORE the user decides

## Tech Stack
- React 18 + TypeScript (strict: true in tsconfig)
- Vite (latest)
- Tailwind CSS v3
- Lucide React (icons)
- @google/genai (Gemini 2.0 Flash)
- Vitest + @testing-library/react

## File Structure
src/
├── types/index.ts
├── lib/
│   ├── activities.ts
│   ├── carbon-utils.ts
│   ├── gemini-prompts.ts
│   └── storage.ts
├── hooks/
│   ├── useJournal.ts
│   ├── useScene.ts
│   └── useGemini.ts
├── components/
│   ├── journal/
│   │   ├── JournalFeed.tsx
│   │   └── StoryCard.tsx
│   ├── log/
│   │   ├── LogSheet.tsx
│   │   ├── CategoryGrid.tsx
│   │   └── ActivityList.tsx
│   ├── scene/
│   │   ├── RippleScene.tsx
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
├── main.tsx
└── index.css

## Types (src/types/index.ts)
Generate this file exactly:

export type DecisionCategory = 'travel' | 'food' | 'energy' | 'shopping';
export type ScenePollutionLevel = 'clear' | 'hazy' | 'polluted' | 'critical';

export interface Activity {
  id: string;
  label: string;
  sublabel: string;
  category: DecisionCategory;
  icon: string;
  kgCO2: number;
  unit: string;
  isWin?: boolean; // positive/climate-win actions (negative or zero impact)
}

export interface JournalEntry {
  id: string;
  activityId: string;
  activityLabel: string;
  category: DecisionCategory;
  icon: string;
  kgCO2: number;
  relatableUnit: string;
  story: string | null;    // null while Gemini is loading
  isWin: boolean;
  timestamp: number;       // Date.now()
}

export interface SceneState {
  skyStart: string;        // CSS color for gradient start
  skyEnd: string;          // CSS color for gradient end
  sunOpacity: number;      // 0-1
  hazeOpacity: number;     // 0-1
  treeCount: number;       // 0-6
  riverColor: string;      // CSS color
  smokeActive: boolean;
  pollutionLevel: ScenePollutionLevel;
  ariaLabel: string;       // for screen readers
}

export interface SimulateState {
  choiceA: Activity | null;
  choiceB: Activity | null;
  result: SimulateResult | null;
  isLoading: boolean;
  error: string | null;
}

export interface SimulateResult {
  storyA: string;
  storyB: string;
  verdict: string;
  savingKg: number;
}

## Activities Library (src/lib/activities.ts)
Generate this file with ALL these activities:

import type { Activity } from '../types';

export const ACTIVITIES: Activity[] = [
  // TRAVEL
  { id: 'flight_domestic', label: 'Domestic flight', sublabel: 'e.g. Delhi → Mumbai', category: 'travel', icon: '✈️', kgCO2: 255, unit: 'per flight' },
  { id: 'flight_international', label: 'International flight', sublabel: 'e.g. Delhi → London', category: 'travel', icon: '🌍', kgCO2: 1100, unit: 'per flight' },
  { id: 'drive_long', label: 'Long drive (50 km)', sublabel: 'Petrol or diesel car', category: 'travel', icon: '🚗', kgCO2: 9.6, unit: 'per trip' },
  { id: 'drive_local', label: 'City drive (10 km)', sublabel: 'Petrol or diesel car', category: 'travel', icon: '🚗', kgCO2: 1.9, unit: 'per trip' },
  { id: 'auto_rickshaw', label: 'Auto-rickshaw', sublabel: '10 km ride', category: 'travel', icon: '🛺', kgCO2: 0.9, unit: 'per trip' },
  { id: 'metro_bus', label: 'Metro or Bus', sublabel: '10 km commute', category: 'travel', icon: '🚇', kgCO2: 0.4, unit: 'per trip' },
  { id: 'cycle_walk', label: 'Cycled or walked', sublabel: 'Any distance', category: 'travel', icon: '🚴', kgCO2: 0, unit: 'per trip', isWin: true },
  // FOOD
  { id: 'nonveg_meal', label: 'Non-veg meal', sublabel: 'Chicken, fish, or mutton', category: 'food', icon: '🍗', kgCO2: 3.2, unit: 'per meal' },
  { id: 'veg_meal', label: 'Vegetarian meal', sublabel: 'Restaurant or delivery', category: 'food', icon: '🥗', kgCO2: 1.1, unit: 'per meal' },
  { id: 'food_delivery', label: 'Food delivery order', sublabel: 'Swiggy or Zomato', category: 'food', icon: '🛵', kgCO2: 1.5, unit: 'per order' },
  { id: 'food_waste', label: 'Wasted food', sublabel: 'Threw away a meal', category: 'food', icon: '🗑️', kgCO2: 2.5, unit: 'incident' },
  { id: 'home_cooked_veg', label: 'Home-cooked veg meal', sublabel: 'Minimal packaging', category: 'food', icon: '🍲', kgCO2: 0.7, unit: 'per meal', isWin: true },
  // ENERGY
  { id: 'ac_day', label: 'AC on all day', sublabel: '8+ hours, 1.5 ton unit', category: 'energy', icon: '❄️', kgCO2: 3.0, unit: 'per day' },
  { id: 'ac_avoided', label: 'Skipped AC today', sublabel: 'Used ceiling fan instead', category: 'energy', icon: '🌀', kgCO2: -2.5, unit: 'saved', isWin: true },
  { id: 'lights_overnight', label: 'Lights/fans overnight', sublabel: 'Left on while sleeping', category: 'energy', icon: '💡', kgCO2: 0.5, unit: 'per night' },
  // SHOPPING
  { id: 'new_clothing', label: 'Bought new clothing', sublabel: 'Any garment', category: 'shopping', icon: '👕', kgCO2: 8.5, unit: 'per item' },
  { id: 'online_order', label: 'Online shopping order', sublabel: 'Amazon or Flipkart', category: 'shopping', icon: '📦', kgCO2: 0.8, unit: 'per order' },
  { id: 'phone_upgrade', label: 'New smartphone', sublabel: 'Device upgrade', category: 'shopping', icon: '📱', kgCO2: 70, unit: 'per device' },
  { id: 'secondhand', label: 'Bought second-hand', sublabel: 'Clothing, electronics, etc.', category: 'shopping', icon: '♻️', kgCO2: 1.0, unit: 'per item', isWin: true },
];

export function getActivitiesByCategory(category: DecisionCategory): Activity[] {
  return ACTIVITIES.filter(a => a.category === category);
}

export function getActivityById(id: string): Activity | undefined {
  return ACTIVITIES.find(a => a.id === id);
}

## Carbon Utils (src/lib/carbon-utils.ts)
Pure functions only — no imports from React, no side effects:

import type { SceneState } from '../types';

export function toRelatableUnit(kgCO2: number): string {
  if (kgCO2 <= 0) return 'net-zero impact';
  if (kgCO2 < 1) return `${Math.round(kgCO2 * 60)} minutes of Indian coal grid power`;
  if (kgCO2 < 5) return `${Math.round(kgCO2 / 0.192)} km in a petrol car`;
  if (kgCO2 < 50) return `${Math.ceil(kgCO2 / 1.75)} days for a tree to absorb`;
  if (kgCO2 < 200) return `${Math.round(kgCO2 / 0.82)} kWh of Delhi grid electricity`;
  return `${(kgCO2 / 255).toFixed(1)} Delhi–Mumbai flights equivalent`;
}

export function deriveSceneState(totalKgThisMonth: number): SceneState {
  if (totalKgThisMonth < 50) {
    return {
      skyStart: '#87CEEB', skyEnd: '#B0E0FF',
      sunOpacity: 1, hazeOpacity: 0,
      treeCount: 6, riverColor: '#4FC3F7',
      smokeActive: false, pollutionLevel: 'clear',
      ariaLabel: `Clear sky scene. Your footprint this month is low at ${Math.round(totalKgThisMonth)} kg.`,
    };
  }
  if (totalKgThisMonth < 150) {
    return {
      skyStart: '#B0C4DE', skyEnd: '#9DB7D8',
      sunOpacity: 0.65, hazeOpacity: 0.25,
      treeCount: 4, riverColor: '#78909C',
      smokeActive: false, pollutionLevel: 'hazy',
      ariaLabel: `Hazy sky scene. Your footprint this month is moderate at ${Math.round(totalKgThisMonth)} kg.`,
    };
  }
  if (totalKgThisMonth < 300) {
    return {
      skyStart: '#808080', skyEnd: '#696969',
      sunOpacity: 0.3, hazeOpacity: 0.55,
      treeCount: 2, riverColor: '#546E7A',
      smokeActive: true, pollutionLevel: 'polluted',
      ariaLabel: `Polluted sky scene. Your footprint this month is high at ${Math.round(totalKgThisMonth)} kg.`,
    };
  }
  return {
    skyStart: '#4A4A4A', skyEnd: '#3D3D3D',
    sunOpacity: 0.08, hazeOpacity: 0.85,
    treeCount: 1, riverColor: '#37474F',
    smokeActive: true, pollutionLevel: 'critical',
    ariaLabel: `Critical pollution scene. Your footprint this month is very high at ${Math.round(totalKgThisMonth)} kg.`,
  };
}

export function getMonthlyTotal(entries: Array<{ kgCO2: number; timestamp: number }>): number {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  return entries
    .filter(e => e.timestamp >= monthStart)
    .reduce((sum, e) => sum + e.kgCO2, 0);
}

export function getMonthlySummary(entries: Array<{ kgCO2: number; isWin: boolean; timestamp: number }>) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const thisMonth = entries.filter(e => e.timestamp >= monthStart);
  return {
    totalKg: Math.max(0, thisMonth.reduce((sum, e) => sum + e.kgCO2, 0)),
    decisionCount: thisMonth.length,
    winCount: thisMonth.filter(e => e.isWin).length,
  };
}

## Gemini Prompts (src/lib/gemini-prompts.ts)
Pure string-building functions only:

export function buildConsequencePrompt(
  activityLabel: string,
  kgCO2: number,
  relatableUnit: string,
): string {
  return `You are Trace, a climate storyteller for India. Write a consequence story about a person's decision.

RULES:
- 3-4 sentences only, no headers, no bullet points
- Second person ("Your flight...", "When you ordered...")
- Emotionally honest, not preachy or guilt-tripping
- Sentence 1: acknowledge the action and its scale using the relatable comparison below (not kg)
- Sentence 2-3: connect to a REAL, NAMED climate consequence already happening in India (choose the most relevant from the context library)
- Sentence 4: one specific, actionable alternative for next time

INDIA CLIMATE CONTEXT LIBRARY (pick the most relevant one):
- Delhi recorded 48.8°C on May 28, 2024 — hottest day in the city's recorded history
- Delhi AQI exceeded 400 (hazardous) for 3 consecutive weeks in November 2024, shortening lives by an estimated 12 years for long-term residents
- Bengaluru flooded catastrophically in September 2022; Sarjapur Road was underwater for 72 hours
- Bengaluru's lakes shrank by 79% between 1973 and 2017
- Mumbai received 944mm of rain in 24 hours in July 2023, displacing 80,000 people
- The Gangotri glacier has retreated 22 km since 1780, threatening drinking water for 500 million people in the Gangetic plain
- Arabian Sea surface temperatures in 2024 hit record highs, intensifying monsoon volatility and bleaching coral reefs near Lakshadweep
- India lost 668,000 lives annually to air pollution in 2019 (Lancet study) — over 1,800 deaths per day

DECISION DETAILS:
Action: ${activityLabel}
Carbon equivalent: ${relatableUnit} (use this comparison, not the raw number)

Write the story now:`;
}

export function buildSimulatePrompt(
  labelA: string,
  kgA: number,
  labelB: string,
  kgB: number,
): string {
  return `Compare two choices for someone in India. Return valid JSON only, no markdown, no explanation.

JSON shape:
{
  "storyA": "2 sentences about the consequence of choice A, second person, India-specific",
  "storyB": "2 sentences about the consequence of choice B, second person, India-specific",
  "verdict": "1 sentence recommending which to choose and the key reason why",
  "savingKg": <number: how many kg CO₂ are saved by choosing the lower-impact option>
}

Choice A: ${labelA} (${kgA} kg CO₂)
Choice B: ${labelB} (${kgB} kg CO₂)`;
}

## Storage (src/lib/storage.ts)
(Generate a localStorage abstraction with safeGet/safeSet pattern, key constants,
getJournal, addEntry, updateEntry, clearJournal functions — similar to the pattern from the previous design document but adapted for JournalEntry[])

## Hooks
Generate useJournal.ts (manages JournalEntry[], exposes addEntry, entries, summary),
useScene.ts (derives SceneState from journal using deriveSceneState + getMonthlyTotal, memoized),
useGemini.ts (generateStory, generateSimulation — calls @google/genai, returns loading/error/result)

## App.tsx
Four-screen app with bottom navigation:
- Tabs: Journal (BookOpen icon) | Ripple (Leaf icon) | Simulate (GitCompare icon)
- Floating Action Button (+ icon, green) centered in the bottom nav for Log
- Active tab indicator: green underline on icon
- LogSheet renders as a bottom sheet overlay (not a separate screen)
- Default screen: Journal

Design:
- Background: #0a0f0d (near-black, green tint)
- Surface: #111a15 (cards)
- Accent: #22c55e (green-500)
- Text primary: #f0fdf4 (green-50)
- Text muted: #6b7280

Generate all files with full implementations. Start with types, then lib, then hooks, then components leaf-to-root, then App.tsx.
```

---

## PROMPT 2 — The Ripple Scene (SVG Cityscape)

```
Build the RippleScene component. This is an SVG animated cityscape that visually responds to
the user's carbon footprint. It has these sub-components:

RippleScene.tsx:
- SVG viewBox="0 0 400 280", role="img", aria-label={sceneState.ariaLabel}
- Renders all sub-scenes stacked
- Wrapped in a div with overflow-hidden, rounded-2xl
- Shows pollution level badge in bottom-left corner (colored pill)

SceneSky.tsx (SVG group):
- Background rect with linearGradient from skyStart to skyEnd (both from SceneState)
- A circle for the sun: cx=320 cy=60 r=35, fill="#FDB813", opacity={sunOpacity}
- Haze layer: rect filling the whole sky, fill="rgba(180,160,120,1)", opacity={hazeOpacity}
- Animated particles when pollutionLevel is "polluted" or "critical":
  - 8 small circles scattered across the sky, fill="#8B7355", radius 3-6
  - CSS animation: float up slowly (translateY -20px over 3-5s, infinite, random delays)
  - @media (prefers-reduced-motion: reduce) { animation: none; }

SceneCity.tsx (SVG group):
- A city silhouette: 8-10 rectangles of varying heights (35-90px), fill="#1a1a2e"
- Placed at y≈160, creating an urban skyline
- 2 tall buildings in center with smokestack circles on top
- When smokeActive: show 2-3 SVG path smoke puffs above smokestacks
  - Smoke puffs: ellipses with CSS animation scale+opacity cycling (2s ease-in-out infinite)
  - @media (prefers-reduced-motion: reduce) { hide smoke puffs entirely }

SceneTrees.tsx (SVG group):
- 6 tree SVG groups along the bottom, evenly spaced
- Each tree: triangle (canopy, green) + rectangle (trunk, brown)
- treeCount prop (0-6): trees beyond treeCount have opacity 0.1 (faded/dead)
- Transition: opacity changes with CSS transition 1s ease
- Trees at positions: x = [30, 75, 140, 250, 320, 375]

River/Ground (in RippleScene directly):
- A wavy path at y≈240 representing ground/river
- Fill rectangle below it with riverColor from SceneState
- riverColor transitions with CSS transition 2s ease

ClimateTicker.tsx:
- A horizontal scrolling ticker at the very bottom of the scene (inside the SVG border)
- Background: rgba(0,0,0,0.7)
- Text: small, white, one of these rotating climate facts (cycles every 8 seconds):
  * "Delhi: 48.8°C recorded May 28, 2024 — hottest day in history"
  * "AQI 400+ in Delhi for 3 weeks, November 2024"
  * "Gangotri glacier has retreated 22 km since 1780"
  * "1,800 Indians die daily from air pollution (Lancet 2019)"
  * "Bengaluru lost 79% of its lakes in 44 years"
- Fade in/out transitions between facts (opacity 0→1→1→0 over 8s)
- @media (prefers-reduced-motion: reduce) { no animation, show first fact statically }

The whole scene should feel alive but not distracting. Animations are subtle.
```

---

## PROMPT 3 — Log Sheet (Bottom Sheet)

```
Build the LogSheet component — a bottom sheet that slides up from the bottom of the screen.
It manages a 3-step flow for logging a decision.

LogSheet.tsx:
- Renders as a fixed overlay: backdrop (rgba(0,0,0,0.6)) + bottom-anchored panel
- Panel: max-height 85vh, overflow-y auto, rounded-t-3xl, background #111a15
- Handle bar at top (visual drag indicator, decorative)
- Closes on: backdrop click, Escape key, "Cancel" button
- When open: focus trapped inside, aria-modal="true", role="dialog"
- Slide-up animation: translateY 100% → 0 (0.3s ease-out)
- @media (prefers-reduced-motion: reduce) { no slide animation, appears instantly }

Step 1 — Category Grid (CategoryGrid.tsx):
- Header: "What did you do?" (h2)
- 2×3 grid of category buttons:
  ✈️ Travel | 🍔 Food | ⚡ Energy | 🛍️ Shopping
- Plus a special 5th button spanning full width: "🏆 Log a Climate Win" (green outlined)
- Each button: large icon centered, label below, rounded-2xl card
- Selected: green border + green background tint
- Also show at bottom: text link "Before I Decide... → Simulate instead"

Step 2 — Activity List (ActivityList.tsx):
- Header: back chevron + category name
- Scrollable list of activities for that category
- Each row: icon + label + sublabel + impact badge on right
- Impact badge: for wins → "Win 🌿" in green; for others → relatable unit string in gray
- Selected row: green left border + subtle green bg
- "Next →" button at bottom, disabled until an activity is selected

Step 3 — Confirm:
- Large icon + selected activity label (centered)
- Relatable impact in large text: e.g. "= 1,328 km in a petrol car"
- For wins: "Every small win adds up. This is one of them." (motivational, green)
- "Log It" button (green, full width)
- On tap: closes sheet, adds entry to journal with story: null, triggers Gemini in background
- Show a brief toast: "Logged. Generating your story..." (1.5s)

After logging, useGemini.generateStory runs, and when complete, updates the journal entry's
story field. The StoryCard in JournalFeed shows a skeleton loader while story is null,
then smoothly reveals the story text when it arrives.
```

---

## PROMPT 4 — Journal Feed

```
Build the Journal Feed components.

JournalFeed.tsx:
- Renders inside the Journal tab
- Top section (sticky): monthly summary card
  - "This month" → X decisions | Y climate wins | "Your city's sky:" + pollution badge
  - Compact, doesn't take much vertical space
- If no entries: full-height empty state
  - Leaf illustration (SVG, simple)
  - "Your climate story starts here"
  - "Log your first decision" button (opens LogSheet)
- List of StoryCard components, newest first
- aria-live="polite" on the list container (so screen readers announce new entries)

StoryCard.tsx:
- Card: bg #111a15, border #1e2d23, rounded-2xl, padding 16px
- Left border: 3px solid, colored by category (travel=cyan, food=orange, energy=purple, shopping=amber)
- Header row: icon + activity label + timestamp (relative: "Today", "Yesterday", "3 days ago")
- Win badge: if isWin, show a small green "Climate Win" pill in header
- Relatable impact: medium text in muted color, e.g. "= 42 days for a tree to absorb"
- Story section:
  - If story is null: skeleton loader (3 lines of gray animated shimmer)
  - If story exists: text in text-[#d1fae5] (green-100), text-sm, line-height relaxed
- No delete button (journal is a permanent record — by design)
- Subtle appear animation: opacity 0→1 + translateY 8px→0, 0.3s ease
- @media (prefers-reduced-motion: reduce) { no animation }
```

---

## PROMPT 5 — Simulate View

```
Build the Simulate view.

SimulateView.tsx:
- Header: "Before I Decide..." (h2) + subtext "Compare two choices before you commit"
- Two selection wells side by side (or stacked on narrow screens):
  - Each well: "Choice A" / "Choice B" label, large dashed border, "+ Pick an option" tap target
  - Tapping opens a modal bottom sheet showing the activity list (reuse ActivityList)
  - Selected: shows icon + label in the well, with a change link
- "Compare" button: full width green, disabled until both choices are selected
- On Compare: calls Gemini, shows loading state (pulsing dots)
- Result section (appears below after Gemini responds):
  
  ComparisonCard.tsx × 2 (one per choice):
  - Card layout: choice label at top, consequence story text below
  - Lower-impact card: subtle green glow border
  - Higher-impact card: normal border
  
  Verdict banner (between the two cards):
  - Green background, verdict text + "saves X kg CO₂" pill
  
  Two action buttons:
  - "Log Choice A" | "Log Choice B" — whichever is tapped, entry is added to journal
  - The lower-impact choice button is styled as primary (green), other as secondary

Error state: "Couldn't compare right now. Check your connection and try again."
with a retry button.

Simulate results are NOT persisted — they're session-only (useState only, no localStorage).
This is intentional: Simulate is a decision-support tool, not a record.
```

---

## PROMPT 6 — Tests

```
Generate comprehensive Vitest tests for all three lib files.

src/__tests__/carbon-utils.test.ts:

Test toRelatableUnit:
- 0 → "net-zero impact"
- -1 (win) → "net-zero impact"
- 0.5 → "30 minutes of Indian coal grid power"
- 3 → "15 km in a petrol car" (round(3/0.192) = 15)
- 20 → "12 days for a tree to absorb" (ceil(20/1.75) = 12)
- 100 → "122 kWh of Delhi grid electricity" (round(100/0.82))
- 500 → "2.0 Delhi–Mumbai flights equivalent" ((500/255).toFixed(1))

Test deriveSceneState:
- 0 kg → pollutionLevel 'clear', treeCount 6, smokeActive false
- 49 kg → pollutionLevel 'clear'
- 50 kg → pollutionLevel 'hazy', treeCount 4
- 149 kg → pollutionLevel 'hazy'
- 150 kg → pollutionLevel 'polluted', treeCount 2, smokeActive true
- 299 kg → pollutionLevel 'polluted'
- 300 kg → pollutionLevel 'critical', treeCount 1
- AriaLabel contains the totalKg value for each state

Test getMonthlyTotal:
- Entries from this month are summed
- Entries from last month are excluded
- Empty array returns 0
- Wins (negative kgCO2) reduce the total

Test getMonthlySummary:
- Returns correct decisionCount, winCount, totalKg
- totalKg never goes below 0 (Math.max(0, ...))

src/__tests__/activities.test.ts:

- ACTIVITIES has at least 18 items
- Every activity has: id (non-empty string), label, category, icon, kgCO2 (number), unit
- No duplicate IDs
- Win activities (isWin: true) all have kgCO2 <= 0 except secondhand (intentional at 1.0)
- getActivitiesByCategory('travel') returns only travel activities
- getActivityById('flight_domestic') returns the correct activity
- getActivityById('nonexistent') returns undefined

src/__tests__/gemini-prompts.test.ts:

Test buildConsequencePrompt:
- Contains the activityLabel in the output
- Contains the relatableUnit in the output
- Does NOT contain the raw kgCO2 number (should use relatableUnit instead)
- Contains "India" context
- Returns a non-empty string

Test buildSimulatePrompt:
- Contains labelA and labelB
- Contains kgA and kgB as strings
- Contains the word "JSON"
- Contains "savingKg" (so Gemini knows to return it)
- Returns a non-empty string

Use Vitest describe/it/expect. No mocks — all pure functions.
```

---

## PROMPT 7 — Security, Accessibility & Config

```
Security and accessibility pass + full configuration files.

SECURITY:
1. In useGemini.ts: wrap Gemini JSON parsing in try/catch. If JSON.parse fails or the
   result doesn't match expected shape, return a graceful fallback story:
   "This choice has a real carbon impact. Small decisions, made consistently, add up
   to meaningful change over time."
   
2. In storage.ts: safeGet wraps JSON.parse in try/catch with fallback — verify this is correct.

3. In index.html: add to <head>:
   <meta http-equiv="Content-Security-Policy"
     content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
     connect-src https://generativelanguage.googleapis.com; img-src 'self' data:;">

4. In .env.example:
   VITE_GEMINI_API_KEY=your_gemini_api_key_here

5. In useGemini.ts: check that import.meta.env.VITE_GEMINI_API_KEY exists before calling
   Gemini, and surface a clear error if it's missing.

ACCESSIBILITY:
1. First element in App.tsx: SkipToContent component
   <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4
   focus:left-4 focus:z-50 focus:bg-green-500 focus:text-black focus:px-4 focus:py-2
   focus:rounded-lg">Skip to main content</a>

2. Main content area: id="main-content"

3. Bottom navigation: <nav aria-label="Main navigation">
   Each tab button: aria-label="Journal" (etc.), aria-current="page" when active

4. LogSheet: role="dialog" aria-modal="true" aria-labelledby="log-sheet-title"
   Focus the first interactive element on open. Return focus to FAB on close.
   Escape key closes the sheet.

5. RippleScene SVG: role="img" aria-label={sceneState.ariaLabel}
   No focusable elements inside the SVG (it's decorative, described by ariaLabel)

6. StoryCard skeleton loader: aria-busy="true" aria-label="Generating your climate story"
   When story arrives: aria-busy removed, aria-live="polite" announces new content

7. In index.css add:
   :focus-visible { outline: 2px solid #22c55e; outline-offset: 2px; }
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }

CONFIG FILES:
Generate package.json, vite.config.ts, tsconfig.json, tailwind.config.js, postcss.config.js.

package.json:
- name: "trace-carbon"
- scripts: dev, build, preview, test, test:coverage
- dependencies: react@^18.3, react-dom@^18.3, lucide-react@^0.400, @google/genai@^0.21
- devDependencies: typescript@^5.4, @types/react@^18.3, @types/react-dom@^18.3,
  vite@^5.4, @vitejs/plugin-react@^4.3, tailwindcss@^3.4, postcss@^8.4,
  autoprefixer@^10.4, vitest@^1.6, @testing-library/react@^16,
  @testing-library/jest-dom@^6, @testing-library/user-event@^14, jsdom@^24

vite.config.ts:
- plugins: [react()]
- test: { environment: 'jsdom', globals: true, setupFiles: ['./src/__tests__/setup.ts'] }
- build.rollupOptions.output.manualChunks: { 'react-vendor': ['react', 'react-dom'], 'genai': ['@google/genai'] }

tailwind.config.js:
- content: ['./index.html', './src/**/*.{ts,tsx}']
- theme.extend.colors: { surface: '#111a15', base: '#0a0f0d', border: '#1e2d23' }
- theme.extend.animation: { 'fade-in': 'fadeIn 0.3s ease' }
- theme.extend.keyframes: { fadeIn: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }

src/__tests__/setup.ts:
import '@testing-library/jest-dom';

public/manifest.json:
{ "name": "Trace", "short_name": "Trace", "description": "Every choice leaves a trace. Know yours.",
  "start_url": "/", "display": "standalone", "background_color": "#0a0f0d", "theme_color": "#22c55e" }
```

---

## Post-Build Verification

```bash
npm install
npm run test           # All tests must pass
npx tsc --noEmit      # Zero TypeScript errors
npm run build          # Must succeed, check bundle size
npm run preview        # Manual smoke test
```

**Manual flow to test:**
1. Open app → Journal empty state shows → "Log your first decision" visible
2. Tap FAB → LogSheet slides up → Category grid shows
3. Pick ✈️ Travel → Activity list shows → Pick "Domestic flight"
4. Confirm step → "= 146 days for a tree to absorb" shows → Tap "Log It"
5. LogSheet closes → Journal shows new card with skeleton loader
6. After a few seconds → Story appears (Gemini has responded)
7. Navigate to Ripple tab → Scene reflects footprint (hazy sky for 255 kg)
8. Navigate to Simulate → Pick "Domestic flight" vs "Metro or Bus" → Compare → Verdict appears
9. Refresh → Journal entries persist, scene state persists

---

## Why This Concept Wins

The instructor's exact words: *"build an application that genuinely makes a user feel something."*

- **Journal stories**: You read your own climate narrative. That lands emotionally.
- **Ripple scene**: You see Delhi's sky turn gray. That lands visually.
- **Simulate**: You see the consequence BEFORE you decide. That lands at the right moment.
- **No numbers shown to users**: Only relatable units. That lands cognitively.

No other submission will have a living SVG city that reacts to your choices,
Gemini consequence stories tied to named Indian climate events,
and a decision-point comparison tool — all in a clean, tested, accessible codebase.

---

*Trace — Every choice leaves a trace. Know yours.*
*Built for PromptWars Challenge 3 | Hack2Skill x Google | Built using Google Antigravity*
