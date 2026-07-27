import { createContext, useContext, type ReactNode } from 'react'
import type { Profile } from '../lib/types'

const guestProfile: Profile = {
  id: 'guest',
  full_name: 'Alex Athlete',
  avatar_url: null,
  gender: 'male',
  age: 25,
  height_cm: 175,
  weight_kg: 78,
  goal: 'build_muscle',
  experience: 'intermediate',
  injuries: '',
  equipment: ['Bodyweight', 'Dumbbells'],
  workout_days: 4,
  session_duration: 45,
  xp: 3450,
  streak: 12,
  created_at: new Date().toISOString(),
}

interface AuthState {
  session: null
  user: null
  profile: Profile
  loading: boolean
  signIn: () => Promise<{ error: null }>
  signUp: () => Promise<{ error: null }>
  signInWithGoogle: () => Promise<void>
  resetPassword: () => Promise<{ error: null }>
  updatePassword: () => Promise<{ error: null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const value: AuthState = {
    session: null,
    user: null,
    profile: guestProfile,
    loading: false,
    signIn: async () => ({ error: null }),
    signUp: async () => ({ error: null }),
    signInWithGoogle: async () => {},
    resetPassword: async () => ({ error: null }),
    updatePassword: async () => ({ error: null }),
    signOut: async () => {},
    refreshProfile: async () => {},
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
