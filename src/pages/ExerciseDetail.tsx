import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Flame, Clock, Dumbbell, Target, Play, Bot, Star, Heart, Share2, Bookmark,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Exercise } from '../lib/types'
import { Card, Spinner } from '../components/ui'

export default function ExerciseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ex, setEx] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)
  const [fav, setFav] = useState(false)

  useEffect(() => {
    supabase.from('exercises').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      setEx(data as Exercise | null)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="grid place-items-center py-20"><Spinner /></div>
  if (!ex) return <p className="py-20 text-center text-white/60">Exercise not found.</p>

  const steps = ex.instructions.split(/(?<=\.)\s+/).filter(Boolean)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <Card className="overflow-hidden p-0">
        <div className="relative h-72">
          <img src={ex.image_url} alt={ex.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="chip bg-primary/80 text-white">{ex.category}</span>
            <h1 className="mt-2 font-display text-3xl font-bold">{ex.name}</h1>
            <p className="text-white/65">{ex.target_muscle}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 p-4">
          <button onClick={() => setFav(!fav)} className={`btn-ghost ${fav ? 'text-red-400' : ''}`}>
            <Heart className={`h-4 w-4 ${fav ? 'fill-current' : ''}`} /> {fav ? 'Saved' : 'Save'}
          </button>
          <button className="btn-ghost"><Share2 className="h-4 w-4" /> Share</button>
          <button className="btn-ghost"><Bookmark className="h-4 w-4" /> Favourite</button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="flex flex-col items-center gap-1 text-center">
          <Flame className="h-6 w-6 text-primary-400" />
          <p className="stat-value">{ex.calories}</p>
          <p className="text-xs text-white/55">Calories</p>
        </Card>
        <Card className="flex flex-col items-center gap-1 text-center">
          <Clock className="h-6 w-6 text-accent-400" />
          <p className="stat-value">{ex.duration_min}</p>
          <p className="text-xs text-white/55">Minutes</p>
        </Card>
        <Card className="flex flex-col items-center gap-1 text-center">
          <Target className="h-6 w-6 text-secondary-400" />
          <p className="stat-value text-base">{ex.target_muscle}</p>
          <p className="text-xs text-white/55">Target</p>
        </Card>
        <Card className="flex flex-col items-center gap-1 text-center">
          <Dumbbell className="h-6 w-6 text-primary-300" />
          <p className="stat-value text-base">{ex.equipment}</p>
          <p className="text-xs text-white/55">Equipment</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="section-title">Instructions</h2>
          <ol className="mt-4 space-y-3">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary-300">{i + 1}</span>
                <p className="text-sm text-white/75">{s}</p>
              </li>
            ))}
          </ol>
          <button className="btn-primary mt-6 w-full">
            <Play className="h-4 w-4" /> {ex.video_url ? 'Watch Video' : 'Start Exercise'}
          </button>
        </Card>

        <Card className="bg-gradient-to-br from-accent-500/15 to-primary-500/10">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-accent-400" />
            <h2 className="section-title">AI Tip</h2>
          </div>
          <p className="mt-3 text-sm text-white/80">{ex.ai_tip}</p>
          <Link to="/app/ai-coach" className="btn-ghost mt-4 w-full">Ask AI Coach more</Link>
        </Card>
      </div>
    </div>
  )
}
