import type { Exercise, Profile } from './types'

const GOAL_FOCUS: Record<string, string[]> = {
  lose_weight: ['Cardio', 'HIIT', 'Core', 'Legs'],
  build_muscle: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms'],
  maintain: ['Chest', 'Back', 'Legs', 'Core', 'Cardio'],
  endurance: ['Cardio', 'HIIT', 'Legs', 'Core'],
  strength: ['Legs', 'Back', 'Chest', 'Shoulders'],
}

const SPLIT_BY_DAYS: Record<number, string[]> = {
  3: ['Push', 'Pull', 'Legs'],
  4: ['Chest+Triceps', 'Back+Biceps', 'Legs', 'Shoulders+Core'],
  5: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms+Core'],
  6: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core+Cardio'],
}

export interface GeneratedPlan {
  weekly: { day: string; focus: string; exercises: Exercise[]; isRest: boolean }[]
  warmup: string
  cooldown: string
  suggestions: string[]
  splitName: string
}

export function generateWorkoutPlan(
  profile: Partial<Profile>,
  exercises: Exercise[]
): GeneratedPlan {
  const days = profile.workout_days || 4
  const goal = profile.goal || 'build_muscle'
  const focus = GOAL_FOCUS[goal] || GOAL_FOCUS.build_muscle
  const split = SPLIT_BY_DAYS[days] || SPLIT_BY_DAYS[4]
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const weekly = split.map((focusName, i) => {
    const dayFocus = focus[i % focus.length]
    const pool = exercises.filter((e) => e.category === dayFocus)
    const picks = pool.slice(0, 4)
    // rest days fill the remaining slots
    return {
      day: dayNames[i] || `Day ${i + 1}`,
      focus: focusName,
      exercises: picks,
      isRest: picks.length === 0,
    }
  })

  // Add rest days if workout_days < 7
  while (weekly.length < 7) {
    weekly.push({
      day: dayNames[weekly.length] || `Day ${weekly.length + 1}`,
      focus: 'Rest & Recovery',
      exercises: [],
      isRest: true,
    })
  }

  return {
    weekly,
    warmup:
      '5 min light cardio + dynamic stretches (arm circles, leg swings, hip openers).',
    cooldown:
      '5 min static stretching focusing on worked muscles + deep breathing.',
    suggestions: [
      'Progressively increase weight by 2.5–5% weekly when reps feel easy.',
      'Prioritize sleep and protein intake for recovery.',
      'Deload every 4–6 weeks to avoid burnout.',
    ],
    splitName: split.join(' / '),
  }
}

// Simple rule-based "AI" coach responses (no external API needed)
export function coachReply(message: string, profile: Profile | null): string {
  const m = message.toLowerCase()
  if (/hi|hello|hey/.test(m) && m.length < 12)
    return "Hey! I'm your AI coach. Ask me about workouts, nutrition, recovery, or motivation!"
  if (/workout|exercise|train/.test(m))
    return profile?.goal === 'lose_weight'
      ? 'For fat loss, combine 3–4 strength sessions with 2 HIIT or cardio sessions per week. Keep rest periods short to elevate heart rate.'
      : 'Aim for 3–5 strength sessions weekly, focusing on progressive overload. Hit each muscle group 2x per week and track your lifts.'
  if (/nutrition|eat|diet|protein|meal/.test(m))
    return 'Target ~1.6–2.2g protein per kg of bodyweight, fill the rest with carbs around workouts and healthy fats. Use the Macro Calculator in Nutrition for exact numbers.'
  if (/injur|hurt|pain|recover/.test(m))
    return 'For injury prevention: warm up thoroughly, use full range of motion, and never train through sharp pain. Prioritize sleep and deload weeks.'
  if (/motivat|lazy|tired|give up/.test(m))
    return "Discipline beats motivation. Show up for just 10 minutes — momentum carries you through. Your future self will thank you. Let's go!"
  if (/water|hydrat/.test(m))
    return 'Aim for 2.5–3.5 liters of water daily, more on training days. Log your glasses in the Dashboard to stay on track.'
  if (/sleep/.test(m))
    return '7–9 hours of sleep is when your muscles recover and grow. Protect your last hour before bed — no screens, dim lights.'
  return "Great question! I can help with workouts, nutrition, recovery, motivation, and daily habits. Tell me a bit more about your goal and I'll tailor my advice."
}

export function calcMacros(weightKg: number, goal: string, activity = 1.55) {
  const bmr = weightKg * 22 * (activity > 1 ? 1 : 1)
  let tdee = weightKg * 24 * activity
  if (goal === 'lose_weight') tdee = tdee * 0.82
  if (goal === 'build_muscle') tdee = tdee * 1.08
  const protein = weightKg * 2
  const fat = weightKg * 0.9
  const carbs = (tdee - protein * 4 - fat * 9) / 4
  return {
    calories: Math.round(tdee),
    protein: Math.round(protein),
    carbs: Math.max(0, Math.round(carbs)),
    fat: Math.round(fat),
  }
}

export function generateMeals(calories: number) {
  const per = (pct: number) => Math.round((calories * pct) / 100)
  return [
    { meal_type: 'Breakfast', name: 'Greek Yogurt Bowl with Berries & Granola', calories: per(0.25), protein: 35, carbs: 55, fat: 12 },
    { meal_type: 'Lunch', name: 'Grilled Chicken Quinoa Salad', calories: per(0.3), protein: 42, carbs: 48, fat: 16 },
    { meal_type: 'Dinner', name: 'Baked Salmon with Sweet Potato & Greens', calories: per(0.3), protein: 38, carbs: 42, fat: 18 },
    { meal_type: 'Snacks', name: 'Protein Shake & Almonds', calories: per(0.15), protein: 28, carbs: 18, fat: 14 },
  ]
}

export const GROCERY_LIST = [
  { category: 'Protein', items: ['Chicken breast', 'Salmon', 'Greek yogurt', 'Eggs', 'Lean beef', 'Whey protein'] },
  { category: 'Carbs', items: ['Oats', 'Quinoa', 'Sweet potato', 'Brown rice', 'Whole-grain bread', 'Bananas'] },
  { category: 'Vegetables', items: ['Spinach', 'Broccoli', 'Bell peppers', 'Cucumber', 'Avocado', 'Tomatoes'] },
  { category: 'Fruits', items: ['Berries', 'Apples', 'Bananas', 'Oranges'] },
  { category: 'Pantry', items: ['Olive oil', 'Almonds', 'Granola', 'Honey', 'Dark chocolate'] },
]

export const RECIPES = [
  { name: 'Post-Workout Protein Smoothie', time: '5 min', calories: 320, tags: ['High Protein', 'Quick'], image: 'https://images.pexels.com/photos/1346154/pexels-photo-1346154.jpeg' },
  { name: 'Chicken & Quinoa Power Bowl', time: '25 min', calories: 540, tags: ['Balanced', 'Meal Prep'], image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg' },
  { name: 'Salmon & Sweet Potato Plate', time: '30 min', calories: 610, tags: ['Omega-3', 'Dinner'], image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg' },
  { name: 'Greek Yogurt Berry Parfait', time: '5 min', calories: 280, tags: ['Breakfast', 'Light'], image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg' },
]

export const SUPPLEMENTS = [
  { name: 'Whey Protein', use: 'Post-workout recovery', dose: '25–30g' },
  { name: 'Creatine Monohydrate', use: 'Strength & power', dose: '5g daily' },
  { name: 'Omega-3 Fish Oil', use: 'Joint & heart health', dose: '1–2g with meals' },
  { name: 'Vitamin D3', use: 'Bone & immune support', dose: '1000–2000 IU' },
  { name: 'Magnesium', use: 'Sleep & muscle recovery', dose: '200–400mg before bed' },
]

export const DAILY_CHALLENGES = [
  { title: 'Burn 300 Calories', target: 300, xp: 50 },
  { title: 'Drink 8 Glasses of Water', target: 8, xp: 30 },
  { title: 'Walk 10,000 Steps', target: 10000, xp: 40 },
  { title: 'Complete a 20-min Workout', target: 20, xp: 60 },
]

export const WEEKLY_CHALLENGES = [
  { title: '5 Workouts This Week', target: 5, xp: 200 },
  { title: 'Burn 2000 Calories', target: 2000, xp: 250 },
]

export const MONTHLY_CHALLENGES = [
  { title: '20 Workouts This Month', target: 20, xp: 1000 },
  { title: 'Lose 2 kg', target: 2, xp: 800 },
]

export const ALL_BADGES = [
  { name: 'First Workout', description: 'Complete your first workout', icon: 'Flame' },
  { name: 'Week Warrior', description: '7-day streak', icon: 'Trophy' },
  { name: 'Calorie Crusher', description: 'Burn 1000 calories in a week', icon: 'Flame' },
  { name: 'Hydration Hero', description: 'Drink 8 glasses 7 days in a row', icon: 'Droplets' },
  { name: 'Early Riser', description: 'Workout before 7am 5 times', icon: 'Sunrise' },
  { name: 'Strength Master', description: 'Lift 100kg on any lift', icon: 'Dumbbell' },
]
