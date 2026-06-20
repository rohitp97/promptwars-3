import { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Activity, SimulateResult } from '../types';
import { buildConsequencePrompt, buildSimulatePrompt } from '../lib/gemini-prompts';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export function useGemini() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimulateResult | null>(null);

  const getAIInstance = useCallback(() => {
    if (!API_KEY) {
      throw new Error('VITE_GEMINI_API_KEY is missing in your environment variables. Please check your .env file.');
    }
    return new GoogleGenAI({ apiKey: API_KEY });
  }, []);

  const generateStory = useCallback(async (
    activityLabel: string,
    relatableUnit: string,
    city: string
  ): Promise<string> => {
    try {
      const ai = getAIInstance();
      const prompt = buildConsequencePrompt(activityLabel, relatableUnit, city);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from Gemini API');
      }
      return text.trim();
    } catch (err: unknown) {
      if (import.meta.env.DEV) console.error('Error generating story from Gemini:', err);
      return "This choice has a real carbon impact. Small decisions, made consistently, add up to meaningful change over time.";
    }
  }, [getAIInstance]);

  const runSimulation = useCallback(async (
    activityA: Activity,
    activityB: Activity,
    city: string
  ): Promise<SimulateResult | null> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = getAIInstance();
      const prompt = buildSimulatePrompt(activityA.label, activityA.kgCO2, activityB.label, activityB.kgCO2, city);

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from Gemini during simulation');
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch (jsonErr) {
        if (import.meta.env.DEV) console.error('Failed to parse Gemini simulation response JSON:', text, jsonErr);
        throw new Error('Invalid JSON format returned by AI');
      }

      // Validate structure before trusting response shape
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        typeof (parsed as Record<string, unknown>).storyA !== 'string' ||
        typeof (parsed as Record<string, unknown>).storyB !== 'string' ||
        typeof (parsed as Record<string, unknown>).verdict !== 'string' ||
        typeof (parsed as Record<string, unknown>).savingKg !== 'number'
      ) {
        throw new Error('Gemini simulation response missing required fields');
      }

      const safe = parsed as Record<string, unknown>;
      const simResult: SimulateResult = {
        storyA: safe.storyA as string,
        storyB: safe.storyB as string,
        verdict: safe.verdict as string,
        savingKg: safe.savingKg as number,
      };

      setResult(simResult);
      return simResult;
    } catch (err: unknown) {
      if (import.meta.env.DEV) console.error('Error running simulation:', err);
      const errMsg = err instanceof Error ? err.message : 'An error occurred during comparison.';
      setError(errMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getAIInstance]);

  return {
    isLoading,
    error,
    result,
    generateStory,
    runSimulation,
  };
}
