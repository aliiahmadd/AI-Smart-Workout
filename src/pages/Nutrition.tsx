import { useEffect, useMemo, useState } from 'react'
import {
  Salad, Sparkles, Apple, ShoppingCart, BookOpen, Pill, Calculator, Flame, Droplets, Download,
} from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { calcMacros, generateMeals, GROCERY_LIST, RECIPES, SUPPLEMENTS } from '../lib/ai'
import { Card, SectionHeader } from '../components/ui'
import type { MealPlan } from '../lib/types'

const MEAL_ICON: Record<string, string> = {
  Breakfast: '🍳', Lunch: '🥗', Dinner: '🍽️', Snacks: '🥤',
}
const MACRO_COLORS = ['#4F46E5', '#22C55E', '#06B6D4']

type Tab = 'planner' | 'macros' | 'grocery' | 'recipes' | 'supplements'

export default function Nutrition() {
  const { profile } = useAuth()
  const [tab, setTab] = useState<Tab>('planner')
  const [meals, setMeals] = useState<MealPlan[]>([])
  const [activity, setActivity] = useState(1.55)

  const weight = Number(profile?.weight_kg) || 78
  const goal = profile?.goal || 'build_muscle'
  const macros = useMemo(() => calcMacros(weight, goal, activity), [weight, goal, activity])
  const mealData = useMemo(() => generateMeals(macros.calories), [macros.calories])

  useEffect(() => {
    // Load or seed today's meals
    supabase.from('meal_plans').select('*').eq('date', new Date().toISOString().slice(0, 10)).then(({ data }) => {
      if (data && data.length) setMeals(data as MealPlan[])
      else setMeals(mealData as unknown as MealPlan[])
    })
  }, [mealData])

  const pieData = [
    { name: 'Protein', value: macros.protein * 4 },
    { name: 'Carbs', value: macros.carbs * 4 },
    { name: 'Fat', value: macros.fat * 9 },
  ]

  const tabs: { id: Tab; label: string; icon: typeof Salad }[] = [
    { id: 'planner', label: 'Meal Planner', icon: Salad },
    { id: 'macros', label: 'Macro Calculator', icon: Calculator },
    { id: 'grocery', label: 'Grocery List', icon: ShoppingCart },
    { id: 'recipes', label: 'Recipes', icon: BookOpen },
    { id: 'supplements', label: 'Supplements', icon: Pill },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SectionHeader title="Nutrition" subtitle="AI meal plans, macros & more" action={<Sparkles className="h-6 w-6 text-accent-400" />} />

      {/* Tabs */}
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`chip whitespace-nowrap px-4 py-2 ${tab === t.id ? 'bg-primary text-white' : 'bg-white/5 text-white/60'}`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'planner' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-secondary-500/15 to-accent-500/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-white/65">Today's AI Meal Plan</p>
                <p className="font-display text-2xl font-bold">{macros.calories} kcal target</p>
              </div>
              <button className="btn-ghost"><Download className="h-4 w-4" /> Export</button>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            {meals.map((m, i) => (
              <Card key={i} className="flex gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/5 text-3xl">
                  {MEAL_ICON[m.meal_type] || '🍽️'}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/50">{m.meal_type}</p>
                  <h3 className="font-semibold">{m.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/60">
                    <span className="flex items-center gap-1"><Flame className="h-3 w-3 text-primary-400" />{m.calories} kcal</span>
                    <span>P {m.protein}g</span>
                    <span>C {m.carbs}g</span>
                    <span>F {m.fat}g</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <SectionHeader title="Water Intake" subtitle="Stay hydrated" />
            <div className="flex items-center gap-4">
              <Droplets className="h-8 w-8 text-accent-400" />
              <div className="flex-1">
                <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent-500 to-primary-500" style={{ width: '62%' }} />
                </div>
              </div>
              <span className="font-semibold">5 / 8 glasses</span>
            </div>
          </Card>
        </div>
      )}

      {tab === 'macros' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <SectionHeader title="Your Stats" subtitle="Adjust to recalculate" />
            <div className="space-y-4">
              <div>
                <label className="label">Weight: {weight} kg</label>
                <input type="range" min={40} max={150} className="w-full accent-primary" defaultValue={weight} disabled />
              </div>
              <div>
                <label className="label">Activity Level: {activity}</label>
                <select className="input" value={activity} onChange={(e) => setActivity(+e.target.value)}>
                  <option value={1.2}>Sedentary (1.2)</option>
                  <option value={1.375}>Light (1.375)</option>
                  <option value={1.55}>Moderate (1.55)</option>
                  <option value={1.725}>Very Active (1.725)</option>
                  <option value={1.9}>Athlete (1.9)</option>
                </select>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-primary/10 p-4 text-center">
                <p className="text-xs text-white/55">Calories</p>
                <p className="stat-value text-primary-300">{macros.calories}</p>
              </div>
              <div className="rounded-2xl bg-secondary/10 p-4 text-center">
                <p className="text-xs text-white/55">Protein</p>
                <p className="stat-value text-secondary-400">{macros.protein}g</p>
              </div>
              <div className="rounded-2xl bg-accent/10 p-4 text-center">
                <p className="text-xs text-white/55">Carbs</p>
                <p className="stat-value text-accent-400">{macros.carbs}g</p>
              </div>
              <div className="rounded-2xl bg-yellow-500/10 p-4 text-center">
                <p className="text-xs text-white/55">Fat</p>
                <p className="stat-value text-yellow-400">{macros.fat}g</p>
              </div>
            </div>
          </Card>
          <Card>
            <SectionHeader title="Macro Distribution" subtitle="Calories from each macro" />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
                    {pieData.map((_, i) => <Cell key={i} fill={MACRO_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-sm">
              {pieData.map((p, i) => (
                <span key={p.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: MACRO_COLORS[i] }} /> {p.name}
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'grocery' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GROCERY_LIST.map((g) => (
            <Card key={g.category}>
              <h3 className="flex items-center gap-2 font-semibold"><Apple className="h-4 w-4 text-secondary-400" /> {g.category}</h3>
              <ul className="mt-3 space-y-2">
                {g.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/75">
                    <input type="checkbox" className="h-4 w-4 rounded accent-secondary" /> {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {tab === 'recipes' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {RECIPES.map((r) => (
            <Card key={r.name} className="overflow-hidden p-0">
              <img src={r.image} alt={r.name} className="h-40 w-full object-cover" loading="lazy" />
              <div className="p-4">
                <h3 className="font-display font-bold">{r.name}</h3>
                <div className="mt-2 flex items-center gap-3 text-xs text-white/60">
                  <span>{r.time}</span> • <span>{r.calories} kcal</span>
                </div>
                <div className="mt-3 flex gap-2">
                  {r.tags.map((t) => <span key={t} className="chip bg-primary/15 text-primary-300">{t}</span>)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'supplements' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUPPLEMENTS.map((s) => (
            <Card key={s.name}>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 text-primary-300">
                  <Pill className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="text-xs text-white/55">{s.use}</p>
                </div>
              </div>
              <p className="mt-3 rounded-xl bg-white/5 px-3 py-2 text-sm text-white/70">Dose: {s.dose}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
