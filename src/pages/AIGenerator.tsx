import { useEffect, useState } from 'react'
import { Bot, Sparkles, Download, RotateCcw, Clock, Flame, Moon, Heart, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import type { Exercise, Profile, Goal, Experience, Gender } from '../lib/types'
import { generateWorkoutPlan, type GeneratedPlan } from '../lib/ai'
import { Card, SectionHeader, Spinner } from '../components/ui'

const GOALS: { value: Goal; label: string }[] = [
  { value: 'lose_weight', label: 'Lose Weight' },
  { value: 'build_muscle', label: 'Build Muscle' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'strength', label: 'Strength' },
]
const LEVELS: { value: Experience; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]
const EQUIPMENT = ['Bodyweight', 'Dumbbells', 'Barbell', 'Kettlebell', 'Resistance Band', 'Pull-up Bar', 'Cable Machine', 'None']

export default function AIGenerator() {
  const { profile } = useAuth()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [form, setForm] = useState({
    age: profile?.age || 25,
    height: profile?.height_cm || 175,
    weight: profile?.weight_kg || 78,
    gender: (profile?.gender || 'male') as Gender,
    goal: (profile?.goal || 'build_muscle') as Goal,
    experience: (profile?.experience || 'intermediate') as Experience,
    injuries: profile?.injuries || '',
    equipment: profile?.equipment || ['Bodyweight', 'Dumbbells'],
    days: profile?.workout_days || 4,
    duration: profile?.session_duration || 45,
  })
  const [plan, setPlan] = useState<GeneratedPlan | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('exercises').select('*').then(({ data }) => setExercises((data as Exercise[]) || []))
  }, [])

  const toggleEquip = (e: string) => {
    setForm((f) => ({
      ...f,
      equipment: f.equipment.includes(e) ? f.equipment.filter((x) => x !== e) : [...f.equipment, e],
    }))
  }

  const generate = async () => {
    setLoading(true)
    setPlan(null)
    await new Promise((r) => setTimeout(r, 900)) // simulate AI thinking
    const partial: Partial<Profile> = {
      workout_days: form.days,
      session_duration: form.duration,
      goal: form.goal,
      experience: form.experience,
      weight_kg: form.weight,
    }
    setPlan(generateWorkoutPlan(partial, exercises))
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <SectionHeader title="AI Workout Generator" subtitle="Get a personalized plan built for you" action={<Bot className="h-6 w-6 text-accent-400" />} />

      <Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Age">
            <input type="number" className="input" value={form.age} onChange={(e) => setForm({ ...form, age: +e.target.value })} />
          </Field>
          <Field label="Height (cm)">
            <input type="number" className="input" value={form.height} onChange={(e) => setForm({ ...form, height: +e.target.value })} />
          </Field>
          <Field label="Weight (kg)">
            <input type="number" className="input" value={form.weight} onChange={(e) => setForm({ ...form, weight: +e.target.value })} />
          </Field>
          <Field label="Gender">
            <select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Goal">
            <select className="input" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value as Goal })}>
              {GOALS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </Field>
          <Field label="Experience">
            <select className="input" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value as Experience })}>
              {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </Field>
          <Field label="Workout Days / Week">
            <input type="range" min={3} max={6} className="mt-3 w-full accent-primary" value={form.days} onChange={(e) => setForm({ ...form, days: +e.target.value })} />
            <p className="mt-1 text-sm text-primary-300">{form.days} days</p>
          </Field>
          <Field label="Session Duration (min)">
            <input type="range" min={20} max={90} step={5} className="mt-3 w-full accent-primary" value={form.duration} onChange={(e) => setForm({ ...form, duration: +e.target.value })} />
            <p className="mt-1 text-sm text-primary-300">{form.duration} min</p>
          </Field>
          <Field label="Injuries / Limitations">
            <input className="input" placeholder="e.g. bad knee" value={form.injuries} onChange={(e) => setForm({ ...form, injuries: e.target.value })} />
          </Field>
        </div>

        <div className="mt-4">
          <p className="label">Available Equipment</p>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT.map((e) => (
              <button
                key={e}
                onClick={() => toggleEquip(e)}
                className={`chip px-3 py-1.5 ${form.equipment.includes(e) ? 'bg-primary text-white' : 'bg-white/5 text-white/60'}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <button onClick={generate} disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? <><Spinner className="h-4 w-4" /> Generating…</> : <><Sparkles className="h-4 w-4" /> Generate My Plan</>}
        </button>
      </Card>

      {loading && (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="relative">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 animate-ping rounded-3xl bg-primary-500/30" />
          </div>
          <p className="text-white/70">Your AI coach is designing your plan…</p>
        </Card>
      )}

      {plan && (
        <div className="space-y-6 animate-fade-in">
          <Card className="bg-gradient-to-br from-primary-600/25 to-accent-500/15">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-white/65">Your personalized plan</p>
                <h2 className="font-display text-xl font-bold">{plan.splitName}</h2>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost"><Download className="h-4 w-4" /> PDF</button>
                <button onClick={generate} className="btn-ghost"><RotateCcw className="h-4 w-4" /> Regenerate</button>
              </div>
            </div>
          </Card>

          {/* Warm-up / Cool-down */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <div className="flex items-center gap-2"><Heart className="h-5 w-5 text-secondary-400" /><h3 className="font-semibold">Warm-up</h3></div>
              <p className="mt-2 text-sm text-white/70">{plan.warmup}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-2"><Moon className="h-5 w-5 text-accent-400" /><h3 className="font-semibold">Cool-down</h3></div>
              <p className="mt-2 text-sm text-white/70">{plan.cooldown}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary-300" /><h3 className="font-semibold">Progress Tips</h3></div>
              <ul className="mt-2 space-y-1 text-sm text-white/70">
                {plan.suggestions.map((s, i) => <li key={i} className="flex gap-2"><ChevronRight className="h-4 w-4 shrink-0 text-primary-300" />{s}</li>)}
              </ul>
            </Card>
          </div>

          {/* Weekly schedule */}
          <SectionHeader title="Weekly Schedule" subtitle="Your muscle split & rest days" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plan.weekly.map((d, i) => (
              <Card key={i} className={d.isRest ? 'opacity-70' : ''}>
                <div className="flex items-center justify-between">
                  <span className="chip bg-white/5 text-white/70">{d.day}</span>
                  {d.isRest ? <Moon className="h-5 w-5 text-accent-400" /> : <Flame className="h-5 w-5 text-primary-400" />}
                </div>
                <h3 className="mt-2 font-display font-bold">{d.focus}</h3>
                {d.exercises.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {d.exercises.map((e) => (
                      <li key={e.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
                        <span>{e.name}</span>
                        <span className="flex items-center gap-2 text-white/50"><Clock className="h-3 w-3" />{e.duration_min}m</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-white/50">Active recovery — walk, stretch, or yoga.</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
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
