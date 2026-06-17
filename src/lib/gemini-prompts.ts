export function buildConsequencePrompt(
  activityLabel: string,
  relatableUnit: string,
  city: string,
): string {
  return `You are Trace, a climate storyteller for India. Write a consequence story about a person's decision in the city of ${city}.

RULES:
- 3-4 sentences only, no headers, no bullet points
- Second person ("Your flight...", "When you ordered...")
- Emotionally honest, not preachy or guilt-tripping
- Sentence 1: acknowledge the action and its scale using the relatable comparison below (not kg)
- Sentence 2-3: connect to a REAL, NAMED climate consequence already happening in India. If the user is in "${city}", strongly prioritize consequences relevant to "${city}" (e.g. AQI in Delhi, water/lakes in Bengaluru, heatwaves/floods in Delhi/Mumbai, etc.)
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
  city: string,
): string {
  return `Compare two choices for someone in ${city}, India. Return valid JSON only, no markdown, no explanation.

JSON shape:
{
  "storyA": "2 sentences about the consequence of choice A, second person, tailored to ${city} or India",
  "storyB": "2 sentences about the consequence of choice B, second person, tailored to ${city} or India",
  "verdict": "1 sentence recommending which to choose and the key reason why",
  "savingKg": <number: how many kg CO₂ are saved by choosing the lower-impact option>
}

Choice A: ${labelA} (${kgA} kg CO₂)
Choice B: ${labelB} (${kgB} kg CO₂)`;
}
