import { describe, it, expect } from 'vitest';
import { ACTIVITIES, getActivitiesByCategory, getActivityById } from '../lib/activities';

describe('activities', () => {
  it('should have at least 18 items in activities list', () => {
    expect(ACTIVITIES.length).toBeGreaterThanOrEqual(18);
  });

  it('should have all required fields in each activity', () => {
    ACTIVITIES.forEach(activity => {
      expect(activity.id).toBeDefined();
      expect(typeof activity.id).toBe('string');
      expect(activity.id.length).toBeGreaterThan(0);

      expect(activity.label).toBeDefined();
      expect(typeof activity.label).toBe('string');

      expect(activity.sublabel).toBeDefined();
      expect(typeof activity.sublabel).toBe('string');

      expect(activity.category).toBeDefined();
      expect(['travel', 'food', 'energy', 'shopping']).toContain(activity.category);

      expect(activity.icon).toBeDefined();
      expect(typeof activity.icon).toBe('string');

      expect(activity.kgCO2).toBeDefined();
      expect(typeof activity.kgCO2).toBe('number');

      expect(activity.unit).toBeDefined();
      expect(typeof activity.unit).toBe('string');
    });
  });

  it('should have no duplicate IDs', () => {
    const ids = ACTIVITIES.map(a => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should ensure win activities have negative/zero kgCO2, with the exception of secondhand and home_cooked_veg', () => {
    ACTIVITIES.forEach(activity => {
      if (activity.isWin) {
        if (activity.id === 'secondhand') {
          expect(activity.kgCO2).toBe(1.0); // intentional special case
        } else if (activity.id === 'home_cooked_veg') {
          expect(activity.kgCO2).toBe(0.7); // intentional special case
        } else {
          expect(activity.kgCO2).toBeLessThanOrEqual(0);
        }
      }
    });
  });

  it('should filter activities by category correctly', () => {
    const travelActivities = getActivitiesByCategory('travel');
    expect(travelActivities.length).toBeGreaterThan(0);
    travelActivities.forEach(a => {
      expect(a.category).toBe('travel');
    });
  });

  it('should find specific activities by ID', () => {
    const activity = getActivityById('flight_domestic');
    expect(activity).toBeDefined();
    expect(activity?.id).toBe('flight_domestic');
    expect(activity?.label).toBe('Domestic flight');
  });

  it('should return undefined for nonexistent IDs', () => {
    const activity = getActivityById('nonexistent_id');
    expect(activity).toBeUndefined();
  });
});
