import { useEffect, useState } from 'react'
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { TrendingUp, Weight, Ruler, Dumbbell, Flame, Target, Bot, Download } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Card, SectionHeader, EmptyState, Spinner } from '../components/ui'
import type { WeightEntry, WorkoutLog } from '../lib/types'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Progress() {
  const { profile } = useAuth()
  const [weights, setWeights] = useState<WeightEntry[]>([])
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([])
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState<'weekly' | 'monthly'>('weekly')

  useEffect(() => {
    Promise.all([
      supabase.from('weight_entries').select('*').order('date', { ascending: true }),
      supabase.from('workout_logs').select('*').order('date', { ascending: true }),
    ]).then(([w, wk]) => {
      setWeights((w.data as WeightEntry[]) || [])
      setWorkouts((wk.data as WorkoutLog[]) || [])
      setLoading(false)
    })
  }, [])

  // Demo data if empty
  const weightData =
    weights.length > 0
      ? weights.map((w) => ({ date: w.date.slice(5), weight: Number(w.weight_kg) }))
      : MONTHS.slice(0, 6).map((m, i) => ({ date: m, weight: 80 - i * 0.4 }))

  const caloriesData = MONTHS.slice(0, 7).map((m, i) => ({
    month: m,
    Burned: 1800 + Math.round(Math.sin(i) * 400 + i * 80),
    Goal: 2000,
  }))

  const strengthData = [
    { lift: 'Bench', Jan: 60, Jun: 80 },
    { lift: 'Squat', Jan: 80, Jun: 110 },
    { lift: 'Deadlift', Jan: 100, Jun: 140 },
    { lift: 'OHP', Jan: 35, Jun: 50 },
  ]

  const measurements = [
    { label: 'Chest', value: '102 cm', change: '+2' },
    { label: 'Waist', value: '84 cm', change: '-3' },
    { label: 'Arms', value: '38 cm', change: '+1.5' },
    { label: 'Thighs', value: '58 cm', change: '+2' },
  ]

  const goalCompletion = [
    { label: 'Lose 5 kg', pct: 60 },
    { label: 'Bench 80 kg', pct: 100 },
    { label: 'Run 5K', pct: 40 },
    { label: '20 workouts', pct: 75 },
  ]

  if (loading) return <div className="grid place-items-center py-20"><Spinner /></div>

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SectionHeader title="Progress" subtitle="Track your fitness journey" action={<button className="btn-ghost"><Download className="h-4 w-4" /> Export</button>} />

      {/* Range toggle */}
      <div className="flex gap-2">
        {(['weekly', 'monthly'] as const).map((r) => (
          <button key={r} onClick={() => setRange(r)} className={`chip px-4 py-2 capitalize ${range === r ? 'bg-primary text-white' : 'bg-white/5 text-white/60'}`}>
            {r}
          </button>
        ))}
      </div>

      {/* Weight history */}
      <Card>
        <SectionHeader title="Weight History" subtitle="kg over time" action={<Weight className="h-5 w-5 text-accent-400" />} />
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }} />
              <Line type="monotone" dataKey="weight" stroke="#4F46E5" strokeWidth={2.5} dot={{ fill: '#4F46E5', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Calories + strength */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Calories Burned" subtitle="Monthly" action={<Flame className="h-5 w-5 text-primary-400" />} />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caloriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Burned" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Goal" fill="rgba(255,255,255,0.15)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <SectionHeader title="Strength Progress" subtitle="1RM (kg)" action={<Dumbbell className="h-5 w-5 text-secondary-400" />} />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strengthData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="lift" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} width={60} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Jan" fill="rgba(255,255,255,0.2)" radius={[0, 8, 8, 0]} />
                <Bar dataKey="Jun" fill="#22C55E" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Body measurements */}
      <Card>
        <SectionHeader title="Body Measurements" subtitle="Latest stats" action={<Ruler className="h-5 w-5 text-accent-400" />} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {measurements.map((m) => (
            <div key={m.label} className="rounded-2xl bg-white/5 p-4">
              <p className="text-xs text-white/55">{m.label}</p>
              <p className="stat-value mt-1">{m.value}</p>
              <p className={`mt-1 text-xs ${m.change.startsWith('+') ? 'text-secondary-400' : 'text-primary-300'}`}>{m.change} cm</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Workout history */}
      <Card>
        <SectionHeader title="Workout History" subtitle="Recent sessions" action={<Dumbbell className="h-5 w-5 text-primary-300" />} />
        {workouts.length === 0 ? (
          <EmptyState icon={<Dumbbell className="h-7 w-7" />} title="No workouts logged yet" subtitle="Complete a workout to see it here." />
        ) : (
          <div className="space-y-2">
            {workouts.slice(0, 8).map((w) => (
              <div key={w.id} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <div>
                  <p className="font-medium">{w.exercise_name}</p>
                  <p className="text-xs text-white/50">{w.date} • {w.category}</p>
                </div>
                <div className="flex gap-4 text-sm text-white/60">
                  <span>{w.sets}×{w.reps}</span>
                  <span>{w.calories} kcal</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Goal completion + AI analysis */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Goal Completion" subtitle="Your active goals" action={<Target className="h-5 w-5 text-secondary-400" />} />
          <div className="space-y-4">
            {goalCompletion.map((g) => (
              <div key={g.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-white/70">{g.label}</span>
                  <span className="font-semibold">{g.pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" style={{ width: `${g.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-accent-500/15 to-primary-500/10">
          <SectionHeader title="AI Analysis" subtitle="Your coach's insight" action={<Bot className="h-5 w-5 text-accent-400" />} />
          <div className="space-y-3 text-sm text-white/80">
            <p>You've increased your bench press by 33% since January — excellent strength progression.</p>
            <p>Your weight is trending down steadily at a healthy rate of ~0.4 kg/month. Keep it up.</p>
            <p className="text-primary-300">Suggestion: Add one extra cardio session to accelerate fat loss.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
