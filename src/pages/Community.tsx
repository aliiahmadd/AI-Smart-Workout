import { useEffect, useState } from 'react'
import { Heart, MessageCircle, Share2, Send, Image, Users, Star, Award, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import type { Post } from '../lib/types'
import { Card, SectionHeader, EmptyState, Spinner } from '../components/ui'

const TRAINERS = [
  { name: 'Coach Maya', specialty: 'Strength & Hypertrophy', followers: '12.4k', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg' },
  { name: 'Coach David', specialty: 'Endurance & Cardio', followers: '8.1k', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' },
  { name: 'Coach Lena', specialty: 'Yoga & Mobility', followers: '15.2k', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' },
]

const STORIES = [
  { name: 'Alex', text: 'Lost 12 kg in 4 months with AI plans!', avatar: 'https://images.pexels.com/photos/1222270/pexels-photo-1222270.jpeg' },
  { name: 'Priya', text: 'First half-marathon completed. AI coach kept me consistent.', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg' },
  { name: 'Tom', text: 'Bench pressed 100kg — goal achieved!', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' },
]

export default function Community() {
  const { profile } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [liked, setLiked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    supabase.from('posts').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setPosts((data as Post[]) || [])
      setLoading(false)
    })
  }, [])

  const post = async () => {
    if (!content.trim() || !profile) return
    const { data } = await supabase
      .from('posts')
      .insert({ content, author_name: profile.full_name || 'You' })
      .select('*')
      .single()
    if (data) setPosts([data as Post, ...posts])
    setContent('')
  }

  const toggleLike = (id: string) => {
    setLiked((l) => ({ ...l, [id]: !l[id] }))
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SectionHeader title="Community" subtitle="Share, inspire, and connect" action={<Users className="h-6 w-6 text-primary-300" />} />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Feed */}
        <div className="space-y-4">
          {/* Composer */}
          <Card>
            <div className="flex gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/25 text-sm font-bold text-primary-200">
                {profile?.full_name?.[0] || 'Y'}
              </div>
              <div className="flex-1">
                <textarea
                  className="input min-h-[80px] resize-none"
                  placeholder="Share your progress, ask a question, or motivate the community…"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="mt-2 flex items-center justify-between">
                  <button className="btn-ghost px-3 py-2"><Image className="h-4 w-4" /> Photo</button>
                  <button onClick={post} disabled={!content.trim()} className="btn-primary px-4 py-2">
                    <Send className="h-4 w-4" /> Post
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {loading ? (
            <div className="grid place-items-center py-12"><Spinner /></div>
          ) : posts.length === 0 ? (
            <EmptyState icon={<Users className="h-7 w-7" />} title="No posts yet" subtitle="Be the first to share something!" />
          ) : (
            posts.map((p) => (
              <Card key={p.id}>
                <div className="flex items-center gap-3">
                  {p.author_avatar ? (
                    <img src={p.author_avatar} alt={p.author_name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/25 text-sm font-bold text-primary-200">{p.author_name[0]}</div>
                  )}
                  <div>
                    <p className="font-semibold">{p.author_name}</p>
                    <p className="text-xs text-white/45">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {p.image_url && <img src={p.image_url} alt="" className="mt-3 rounded-2xl" />}
                <p className="mt-3 text-sm text-white/80">{p.content}</p>
                <div className="mt-4 flex items-center gap-6 text-sm text-white/55">
                  <button onClick={() => toggleLike(p.id)} className={`flex items-center gap-1.5 transition ${liked[p.id] ? 'text-red-400' : 'hover:text-red-400'}`}>
                    <Heart className={`h-4 w-4 ${liked[p.id] ? 'fill-current' : ''}`} /> {(p.likes + (liked[p.id] ? 1 : 0)).toString()}
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-white"><MessageCircle className="h-4 w-4" /> {p.comments}</button>
                  <button className="flex items-center gap-1.5 hover:text-white"><Share2 className="h-4 w-4" /> Share</button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <SectionHeader title="Trainers" subtitle="Follow the pros" />
            <div className="space-y-3">
              {TRAINERS.map((t) => (
                <div key={t.name} className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-white/50">{t.specialty} • {t.followers}</p>
                  </div>
                  <button className="chip bg-primary/15 text-primary-300 hover:bg-primary/25"><UserPlus className="h-3 w-3" /> Follow</button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Success Stories" subtitle="Real results" action={<Star className="h-5 w-5 text-yellow-400" />} />
            <div className="space-y-3">
              {STORIES.map((s) => (
                <div key={s.name} className="rounded-2xl bg-white/5 p-3">
                  <div className="flex items-center gap-2">
                    <img src={s.avatar} alt={s.name} className="h-8 w-8 rounded-full object-cover" />
                    <p className="text-sm font-semibold">{s.name}</p>
                    <Award className="ml-auto h-4 w-4 text-secondary-400" />
                  </div>
                  <p className="mt-2 text-sm text-white/70">"{s.text}"</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
