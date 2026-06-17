import { describe, it, expect } from 'vitest';
import { buildConsequencePrompt, buildSimulatePrompt } from '../lib/gemini-prompts';

describe('gemini-prompts', () => {
  describe('buildConsequencePrompt', () => {
    it('should construct a prompt containing the activity details, comparison units, and Indian context', () => {
      const activityLabel = 'Domestic flight';
      const relatableUnit = '1.0 Delhi–Mumbai flights equivalent';

      const prompt = buildConsequencePrompt(activityLabel, relatableUnit, 'Delhi');

      expect(prompt).toBeDefined();
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(0);

      expect(prompt).toContain(activityLabel);
      expect(prompt).toContain(relatableUnit);
      expect(prompt).toContain('India');
      expect(prompt).toContain('Delhi');
      expect(prompt).toContain('Bengaluru');
      // Raw kg number must never appear — users see relatable units only
      expect(prompt).not.toContain('255');
    });
  });

  describe('buildSimulatePrompt', () => {
    it('should construct a simulation prompt containing A and B labels, CO2 values, JSON requirements, and savingKg', () => {
      const labelA = 'Domestic flight';
      const kgA = 255;
      const labelB = 'Metro or Bus';
      const kgB = 0.4;

      const prompt = buildSimulatePrompt(labelA, kgA, labelB, kgB, 'Delhi');

      expect(prompt).toBeDefined();
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(0);

      // Check inclusions
      expect(prompt).toContain(labelA);
      expect(prompt).toContain(labelB);
      expect(prompt).toContain(String(kgA));
      expect(prompt).toContain(String(kgB));
      expect(prompt).toContain('JSON');
      expect(prompt).toContain('savingKg');
      expect(prompt).toContain('Delhi');
    });
  });
});
