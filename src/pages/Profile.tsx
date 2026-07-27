import { useState } from 'react'
import { User, Target, Heart, Watch, Edit2, Check, X, Dumbbell, Flame, Award } from 'lucide-react'
import { Card, SectionHeader } from '../components/ui'
import type { Profile as ProfileType, Goal, Experience, Gender } from '../lib/types'

export default function Profile() {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<ProfileType>({
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
  })

  const save = () => {
    setEditing(false)
  }

  const profile = form

  const bmi = profile.weight_kg && profile.height_cm
    ? (Number(profile.weight_kg) / Math.pow(Number(profile.height_cm) / 100, 2)).toFixed(1)
    : '—'

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary-600/25 to-accent-500/15">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 text-3xl font-bold text-white shadow-glow">
            {profile.full_name?.[0] || 'A'}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-display text-2xl font-bold">{profile.full_name || 'Athlete'}</h1>
            <p className="text-sm text-white/55">alex.athlete@example.com</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="chip bg-primary/15 text-primary-300"><Flame className="h-3 w-3" /> {profile.streak} day streak</span>
              <span className="chip bg-yellow-500/15 text-yellow-400"><Award className="h-3 w-3" /> {profile.xp} XP</span>
              <span className="chip bg-secondary/15 text-secondary-400"><Dumbbell className="h-3 w-3" /> {profile.experience || 'Beginner'}</span>
            </div>
          </div>
          <button onClick={() => (editing ? save() : setEditing(true))} className="btn-ghost">
            {editing ? <><Check className="h-4 w-4" /> Save</> : <><Edit2 className="h-4 w-4" /> Edit</>}
          </button>
          {editing && <button onClick={() => setEditing(false)} className="btn-ghost"><X className="h-4 w-4" /></button>}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Age" value={profile.age || '—'} />
        <Stat label="Height" value={profile.height_cm ? `${profile.height_cm} cm` : '—'} />
        <Stat label="Weight" value={profile.weight_kg ? `${profile.weight_kg} kg` : '—'} />
        <Stat label="BMI" value={bmi} />
      </div>

      {/* Fitness goals */}
      <Card>
        <SectionHeader title="Fitness Goals" action={<Target className="h-5 w-5 text-secondary-400" />} />
        {editing ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Goal">
              <select className="input" value={form.goal || ''} onChange={(e) => setForm({ ...form, goal: e.target.value as Goal })}>
                <option value="lose_weight">Lose Weight</option>
                <option value="build_muscle">Build Muscle</option>
                <option value="maintain">Maintain</option>
                <option value="endurance">Endurance</option>
                <option value="strength">Strength</option>
              </select>
            </Field>
            <Field label="Experience">
              <select className="input" value={form.experience || ''} onChange={(e) => setForm({ ...form, experience: e.target.value as Experience })}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </Field>
            <Field label="Gender">
              <select className="input" value={form.gender || ''} onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Age">
              <input type="number" className="input" value={form.age || ''} onChange={(e) => setForm({ ...form, age: +e.target.value })} />
            </Field>
            <Field label="Height (cm)">
              <input type="number" className="input" value={form.height_cm || ''} onChange={(e) => setForm({ ...form, height_cm: +e.target.value })} />
            </Field>
            <Field label="Weight (kg)">
              <input type="number" className="input" value={form.weight_kg || ''} onChange={(e) => setForm({ ...form, weight_kg: +e.target.value })} />
            </Field>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Info label="Primary Goal" value={profile.goal?.replace('_', ' ') || 'Not set'} />
            <Info label="Experience Level" value={profile.experience || 'Not set'} />
            <Info label="Workout Days" value={`${profile.workout_days} days/week`} />
            <Info label="Session Duration" value={`${profile.session_duration} min`} />
          </div>
        )}
      </Card>

      {/* Medical conditions */}
      <Card>
        <SectionHeader title="Medical Conditions & Injuries" action={<Heart className="h-5 w-5 text-red-400" />} />
        <p className="text-sm text-white/70">{profile.injuries || 'None reported. Always consult a doctor before starting a new program.'}</p>
      </Card>

      {/* Connected devices */}
      <Card>
        <SectionHeader title="Connected Devices" action={<Watch className="h-5 w-5 text-accent-400" />} />
        <div className="space-y-2">
          {['Apple Watch', 'Garmin', 'Fitbit'].map((d) => (
            <div key={d} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
              <span className="text-sm">{d}</span>
              <button className="chip bg-primary/15 text-primary-300">Connect</button>
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="text-center">
      <p className="text-xs text-white/55">{label}</p>
      <p className="stat-value mt-1">{value}</p>
    </Card>
  )
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <p className="text-xs text-white/55">{label}</p>
      <p className="mt-1 font-semibold capitalize">{value}</p>
    </div>
  )
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}
