export type Goal = 'lose_weight' | 'build_muscle' | 'maintain' | 'endurance' | 'strength'
export type Experience = 'beginner' | 'intermediate' | 'advanced'
export type Gender = 'male' | 'female' | 'other'

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  gender: Gender | null
  age: number | null
  height_cm: number | null
  weight_kg: number | null
  goal: Goal | null
  experience: Experience | null
  injuries: string | null
  equipment: string[] | null
  workout_days: number | null
  session_duration: number | null
  xp: number
  streak: number
  created_at: string
}

export interface DailyLog {
  id: string
  user_id: string
  date: string
  calories_burned: number
  water_glasses: number
  sleep_hours: number
  heart_rate: number
  steps: number
}

export interface WeightEntry {
  id: string
  user_id: string
  date: string
  weight_kg: number
}

export interface WorkoutLog {
  id: string
  user_id: string
  date: string
  exercise_name: string
  category: string
  duration_min: number
  calories: number
  sets: number
  reps: number
  weight_kg: number
}

export interface MealPlan {
  id: string
  user_id: string
  date: string
  meal_type: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface Challenge {
  id: string
  user_id: string
  title: string
  type: 'daily' | 'weekly' | 'monthly'
  target: number
  progress: number
  xp_reward: number
  completed: boolean
  expires_at: string | null
}

export interface Badge {
  id: string
  user_id: string
  name: string
  description: string
  icon: string
  earned_at: string
}

export interface Post {
  id: string
  user_id: string
  author_name: string
  author_avatar: string | null
  content: string
  image_url: string | null
  likes: number
  comments: number
  created_at: string
}

export interface ChatMessage {
  id: string
  user_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface Exercise {
  id: string
  name: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  target_muscle: string
  calories: number
  equipment: string
  duration_min: number
  instructions: string
  image_url: string
  video_url: string | null
  ai_tip: string
}
