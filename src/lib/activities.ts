import type { Activity, DecisionCategory } from '../types';

export const ACTIVITIES: Activity[] = [
  // TRAVEL
  { id: 'flight_domestic', label: 'Domestic flight', sublabel: 'e.g. Delhi → Mumbai', category: 'travel', icon: '✈️', kgCO2: 255, unit: 'per flight' },
  { id: 'flight_international', label: 'International flight', sublabel: 'e.g. Delhi → London', category: 'travel', icon: '🌍', kgCO2: 1100, unit: 'per flight' },
  { id: 'drive_long', label: 'Long drive (50 km)', sublabel: 'Petrol or diesel car', category: 'travel', icon: '🚗', kgCO2: 9.6, unit: 'per trip' },
  { id: 'drive_local', label: 'City drive (10 km)', sublabel: 'Petrol or diesel car', category: 'travel', icon: '🚗', kgCO2: 1.9, unit: 'per trip' },
  { id: 'drive_ev', label: 'Electric car drive (10 km)', sublabel: 'EV charged on grid', category: 'travel', icon: '⚡🚗', kgCO2: 0.6, unit: 'per trip' },
  { id: 'ride_petrol_2w', label: 'Petrol 2-wheeler (10 km)', sublabel: 'Motorcycle or scooter', category: 'travel', icon: '🛵', kgCO2: 0.5, unit: 'per trip' },
  { id: 'ride_electric_2w', label: 'Electric 2-wheeler (10 km)', sublabel: 'E-scooter or e-bike', category: 'travel', icon: '⚡🛵', kgCO2: 0.1, unit: 'per trip' },
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
  { id: 'quick_commerce', label: 'Quick commerce delivery', sublabel: 'Blinkit, Zepto, or Instamart', category: 'shopping', icon: '⚡📦', kgCO2: 0.3, unit: 'per order' },
  { id: 'phone_upgrade', label: 'New smartphone', sublabel: 'Device upgrade', category: 'shopping', icon: '📱', kgCO2: 70, unit: 'per device' },
  { id: 'secondhand', label: 'Bought second-hand', sublabel: 'Clothing, electronics, etc.', category: 'shopping', icon: '♻️', kgCO2: 1.0, unit: 'per item', isWin: true },
];

export function getActivitiesByCategory(category: DecisionCategory): Activity[] {
  return ACTIVITIES.filter(a => a.category === category);
}

export function getActivityById(id: string): Activity | undefined {
  return ACTIVITIES.find(a => a.id === id);
}
