import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Flame, Droplets, Moon, Heart, Weight, Activity, Trophy, Bot,
  Calendar, Target, Zap, ChevronRight, Quote, Play, TrendingUp, Dumbbell, Award,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  RadialBarChart, RadialBar, PolarAngleAxis,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Card, StatCard, SectionHeader, ProgressBar } from '../components/ui'
import { ALL_BADGES, DAILY_CHALLENGES } from '../lib/ai'

const QUOTES = [
  'The body achieves what the mind believes.',
  'Push yourself, because no one else is going to do it for you.',
  'Success starts with self-discipline.',
  'Your only limit is you.',
  'Sweat is just fat crying.',
]

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Dashboard() {
  const { profile } = useAuth()
  const [today, setToday] = useState({
    calories: 420,
    water: 5,
    sleep: 7.5,
    heart: 72,
    weight: profile?.weight_kg || 78,
    steps: 6400,
  })
  const [weekData, setWeekData] = useState<{ day: string; calories: number }[]>([])
  const [badges, setBadges] = useState<string[]>([])
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)])

  useEffect(() => {
    // Build weekly chart from random-ish demo data
    setWeekData(WEEK.map((day) => ({ day, calories: 200 + Math.round(Math.random() * 500) })))
    setBadges(ALL_BADGES.slice(0, 3).map((b) => b.name))
  }, [])

  const bmi =
    profile?.weight_kg && profile?.height_cm
      ? (Number(profile.weight_kg) / Math.pow(Number(profile.height_cm) / 100, 2)).toFixed(1)
      : '—'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const name = profile?.full_name?.split(' ')[0] || 'Athlete'

  const goals = [
    { label: 'Workouts', value: 3, max: 5 },
    { label: 'Calories', value: today.calories, max: 600 },
    { label: 'Water', value: today.water, max: 8 },
    { label: 'Steps', value: today.steps, max: 10000 },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* AI Greeting */}
      <Card hover={false} className="relative overflow-hidden bg-gradient-to-br from-primary-600/30 via-card to-accent-500/20">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm text-white/70">
              <Bot className="h-4 w-4 text-accent-400" /> AI Coach
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold md:text-3xl">
              {greeting}, <span className="text-gradient">{name}</span>
            </h1>
            <p className="mt-1 max-w-md text-sm text-white/65">
              You're on a <strong className="text-secondary-400">{profile?.streak || 3}-day streak</strong>. Let's keep the momentum going — your upper body session is ready.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/app/ai-generator" className="btn-primary">
                <Play className="h-4 w-4" /> Continue Workout
              </Link>
              <Link to="/app/ai-coach" className="btn-ghost">
                <Bot className="h-4 w-4" /> Ask AI Coach
              </Link>
            </div>
          </div>
          <div className="hidden shrink-0 md:block">
            <div className="grid h-28 w-28 place-items-center rounded-full bg-primary/15">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 shadow-glow">
                <Flame className="h-9 w-9 text-white" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={<Flame className="h-5 w-5" />} label="Calories Burned" value={today.calories} unit="kcal" accent="primary" trend="+12%" />
        <StatCard icon={<Droplets className="h-5 w-5" />} label="Water Intake" value={today.water} unit="/ 8 glasses" accent="accent" />
        <StatCard icon={<Moon className="h-5 w-5" />} label="Sleep" value={today.sleep} unit="hrs" accent="secondary" />
        <StatCard icon={<Heart className="h-5 w-5" />} label="Heart Rate" value={today.heart} unit="bpm" accent="primary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Weekly progress graph */}
        <Card className="lg:col-span-2">
          <SectionHeader title="Weekly Progress" subtitle="Calories burned this week" action={<span className="chip bg-secondary/15 text-secondary-400"><TrendingUp className="h-3 w-3" /> +18%</span>} />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekData}>
                <defs>
                  <linearGradient id="cal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }} />
                <Area type="monotone" dataKey="calories" stroke="#4F46E5" strokeWidth={2.5} fill="url(#cal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Daily goals radial */}
        <Card>
          <SectionHeader title="Daily Goals" subtitle="Today's targets" />
          <div className="space-y-4">
            {goals.map((g) => (
              <div key={g.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-white/70">{g.label}</span>
                  <span className="font-semibold">{g.value.toLocaleString()} / {g.max.toLocaleString()}</span>
                </div>
                <ProgressBar value={g.value} max={g.max} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Workout calendar */}
        <Card className="lg:col-span-2">
          <SectionHeader title="Workout Calendar" subtitle="This week" action={<Calendar className="h-5 w-5 text-white/40" />} />
          <div className="grid grid-cols-7 gap-2">
            {WEEK.map((d, i) => {
              const done = i < 3
              const today_ = i === 3
              const rest = i >= 5
              return (
                <div key={d} className="flex flex-col items-center gap-2">
                  <span className="text-xs text-white/50">{d}</span>
                  <div
                    className={`grid h-12 w-full place-items-center rounded-2xl text-xs font-semibold transition ${
                      done
                        ? 'bg-secondary/20 text-secondary-300'
                        : today_
                        ? 'bg-primary/25 text-primary-200 ring-2 ring-primary/50'
                        : rest
                        ? 'bg-white/5 text-white/40'
                        : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {done ? <Flame className="h-4 w-4" /> : today_ ? <Dumbbell className="h-4 w-4" /> : rest ? <Moon className="h-3.5 w-3.5" /> : '—'}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* BMI + weight */}
        <div className="grid gap-4">
          <Card>
            <SectionHeader title="Body Metrics" />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <Weight className="h-5 w-5 text-accent-400" />
                <p className="mt-2 text-xs text-white/55">Weight</p>
                <p className="stat-value">{today.weight}<span className="text-sm text-white/50"> kg</span></p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <Activity className="h-5 w-5 text-secondary-400" />
                <p className="mt-2 text-xs text-white/55">BMI</p>
                <p className="stat-value">{bmi}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary/15 text-secondary-400">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-white/55">Today's Challenge</p>
                <p className="font-semibold">{DAILY_CHALLENGES[0].title}</p>
              </div>
            </div>
            <div className="mt-3">
              <ProgressBar value={120} max={DAILY_CHALLENGES[0].target} />
              <p className="mt-1 text-xs text-white/45">120 / {DAILY_CHALLENGES[0].target} • +{DAILY_CHALLENGES[0].xp} XP</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Badges + AI suggestions + quote */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <SectionHeader title="Achievement Badges" action={<Link to="/app/challenges" className="text-sm text-primary-300">View all</Link>} />
          <div className="grid grid-cols-3 gap-3">
            {ALL_BADGES.slice(0, 6).map((b, i) => {
              const earned = i < 3
              return (
                <div key={b.name} className={`flex flex-col items-center gap-2 rounded-2xl p-3 text-center ${earned ? 'bg-primary/10' : 'bg-white/5 opacity-50'}`}>
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${earned ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/40'}`}>
                    <Award className="h-6 w-6" />
                  </div>
                  <p className="text-[11px] font-medium leading-tight">{b.name}</p>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <SectionHeader title="AI Suggestions" action={<Bot className="h-5 w-5 text-accent-400" />} />
          <div className="space-y-3">
            {[
              { icon: Zap, text: 'Add 5kg to your squat — you hit 8 reps comfortably last session.' },
              { icon: Droplets, text: 'You\'re 3 glasses short on water. Hydrate before your workout.' },
              { icon: Moon, text: 'Aim for 8h sleep tonight to boost recovery.' },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl bg-white/5 p-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent-400">
                  <s.icon className="h-4 w-4" />
                </div>
                <p className="text-sm text-white/75">{s.text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col justify-center bg-gradient-to-br from-primary-600/20 to-accent-500/10">
          <Quote className="h-8 w-8 text-primary-300/60" />
          <p className="mt-3 font-display text-lg font-semibold leading-snug">"{quote}"</p>
          <p className="mt-3 text-sm text-white/50">— Daily Motivation</p>
        </Card>
      </div>
    </div>
  )
}
