import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, SlidersHorizontal, Flame, Clock, Dumbbell, ChevronRight, Star, Mic } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Exercise } from '../lib/types'
import { Card, SectionHeader, EmptyState, Spinner } from '../components/ui'

const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Yoga', 'HIIT', 'Stretching']

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: 'bg-secondary/15 text-secondary-400',
  Intermediate: 'bg-accent/15 text-accent-400',
  Advanced: 'bg-red-500/15 text-red-300',
}

export default function Workouts() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [difficulty, setDifficulty] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    supabase
      .from('exercises')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setExercises((data as Exercise[]) || [])
        setLoading(false)
      })
  }, [])

  const filtered = useMemo(() => {
    return exercises.filter((e) => {
      if (category !== 'All' && e.category !== category) return false
      if (difficulty !== 'All' && e.difficulty !== difficulty) return false
      if (query && !e.name.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [exercises, query, category, difficulty])

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <SectionHeader title="Workout Library" subtitle="Explore exercises by muscle group" />

      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-white/40" />
          <input
            className="input pl-11 pr-12"
            placeholder="Search exercises…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="absolute right-3 top-3 rounded-xl bg-white/5 p-1.5 text-white/40 hover:text-primary-300" aria-label="Voice search">
            <Mic className="h-4 w-4" />
          </button>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="btn-ghost">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      {/* Category chips */}
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`chip whitespace-nowrap px-4 py-2 transition ${
              category === c ? 'bg-primary text-white' : 'bg-white/5 text-white/65 hover:bg-white/10'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="card flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/55">Difficulty:</span>
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`chip px-3 py-1.5 ${difficulty === d ? 'bg-accent text-white' : 'bg-white/5 text-white/60'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid place-items-center py-20"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Dumbbell className="h-7 w-7" />} title="No exercises found" subtitle="Try a different category or search term." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <Link key={e.id} to={`/app/workouts/${e.id}`}>
              <Card className="group h-full overflow-hidden p-0">
                <div className="relative h-44 overflow-hidden">
                  <img src={e.image_url} alt={e.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <span className={`chip absolute right-3 top-3 ${DIFFICULTY_COLOR[e.difficulty]}`}>{e.difficulty}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold">{e.name}</h3>
                    <ChevronRight className="h-4 w-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-primary-300" />
                  </div>
                  <p className="mt-1 text-xs text-white/50">{e.target_muscle}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-white/60">
                    <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-primary-400" /> {e.calories} kcal</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-accent-400" /> {e.duration_min} min</span>
                    <span className="flex items-center gap-1"><Dumbbell className="h-3.5 w-3.5 text-secondary-400" /> {e.equipment}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
