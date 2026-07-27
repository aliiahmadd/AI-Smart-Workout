import { useEffect, useState } from 'react'
import { Trophy, Flame, Crown, Medal, Award, Target, Zap, Star } from 'lucide-react'
import { Card, SectionHeader, ProgressBar, EmptyState } from '../components/ui'
import { DAILY_CHALLENGES, WEEKLY_CHALLENGES, MONTHLY_CHALLENGES, ALL_BADGES } from '../lib/ai'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Challenge, Badge } from '../lib/types'

const LEADERBOARD = [
  { name: 'Sarah K.', xp: 4820, streak: 28, avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg' },
  { name: 'Mike R.', xp: 4100, streak: 21, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' },
  { name: 'You', xp: 3450, streak: 12, avatar: null },
  { name: 'Emma L.', xp: 3200, streak: 9, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' },
  { name: 'James T.', xp: 2900, streak: 7, avatar: 'https://images.pexels.com/photos/1222270/pexels-photo-1222270.jpeg' },
]

export default function Challenges() {
  const { profile } = useAuth()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [badges, setBadges] = useState<Badge[]>([])

  useEffect(() => {
    supabase.from('challenges').select('*').then(({ data }) => setChallenges((data as Challenge[]) || []))
    supabase.from('badges').select('*').then(({ data }) => setBadges((data as Badge[]) || []))
  }, [])

  const renderChallenge = (c: { title: string; target: number; xp: number }, type: 'daily' | 'weekly' | 'monthly', progress: number) => (
    <Card key={c.title}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 text-primary-300">
            {type === 'daily' ? <Flame className="h-5 w-5" /> : type === 'weekly' ? <Zap className="h-5 w-5" /> : <Trophy className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-xs text-white/50">+{c.xp} XP reward</p>
          </div>
        </div>
        <span className="chip bg-secondary/15 text-secondary-400">{type}</span>
      </div>
      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-sm">
          <span className="text-white/60">{progress} / {c.target}</span>
          <span className="font-semibold">{Math.round((progress / c.target) * 100)}%</span>
        </div>
        <ProgressBar value={progress} max={c.target} />
      </div>
    </Card>
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SectionHeader title="Challenges & Rewards" subtitle="Earn XP, build streaks, climb the ranks" action={<Trophy className="h-6 w-6 text-yellow-400" />} />

      {/* XP + streak summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow-500/15 text-yellow-400"><Star className="h-6 w-6" /></div>
          <div><p className="text-xs text-white/55">Total XP</p><p className="stat-value">{profile?.xp || 3450}</p></div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-500/15 text-orange-400"><Flame className="h-6 w-6" /></div>
          <div><p className="text-xs text-white/55">Day Streak</p><p className="stat-value">{profile?.streak || 12}</p></div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary/15 text-secondary-400"><Award className="h-6 w-6" /></div>
          <div><p className="text-xs text-white/55">Badges</p><p className="stat-value">{badges.length || 3}</p></div>
        </Card>
      </div>

      {/* Daily challenges */}
      <div>
        <h2 className="section-title mb-3">Daily Challenges</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {DAILY_CHALLENGES.map((c) => renderChallenge(c, 'daily', Math.round(c.target * 0.4)))}
        </div>
      </div>

      {/* Weekly */}
      <div>
        <h2 className="section-title mb-3">Weekly Challenges</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {WEEKLY_CHALLENGES.map((c) => renderChallenge(c, 'weekly', Math.round(c.target * 0.6)))}
        </div>
      </div>

      {/* Monthly */}
      <div>
        <h2 className="section-title mb-3">Monthly Challenges</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {MONTHLY_CHALLENGES.map((c) => renderChallenge(c, 'monthly', Math.round(c.target * 0.3)))}
        </div>
      </div>

      {/* Leaderboard */}
      <Card>
        <SectionHeader title="Leaderboard" subtitle="Top performers this month" action={<Crown className="h-5 w-5 text-yellow-400" />} />
        <div className="space-y-2">
          {LEADERBOARD.map((u, i) => (
            <div key={u.name} className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${u.name === 'You' ? 'bg-primary/15 ring-1 ring-primary/40' : 'bg-white/5'}`}>
              <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' : i === 1 ? 'bg-slate-400/20 text-slate-300' : i === 2 ? 'bg-orange-700/20 text-orange-600' : 'bg-white/10 text-white/60'}`}>
                {i < 3 ? <Medal className="h-4 w-4" /> : i + 1}
              </span>
              {u.avatar ? (
                <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/30 text-sm font-bold">{u.name[0]}</div>
              )}
              <div className="flex-1">
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-white/50">{u.streak} day streak</p>
              </div>
              <span className="font-display font-bold text-yellow-400">{u.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Badges */}
      <Card>
        <SectionHeader title="All Badges" subtitle="Achievements to unlock" action={<Award className="h-5 w-5 text-primary-300" />} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ALL_BADGES.map((b, i) => {
            const earned = i < 3
            return (
              <div key={b.name} className={`flex flex-col items-center gap-2 rounded-2xl p-4 text-center ${earned ? 'bg-primary/10' : 'bg-white/5 opacity-50'}`}>
                <div className={`grid h-14 w-14 place-items-center rounded-2xl ${earned ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white' : 'bg-white/10 text-white/40'}`}>
                  <Award className="h-7 w-7" />
                </div>
                <p className="text-xs font-semibold leading-tight">{b.name}</p>
                <p className="text-[10px] text-white/45">{b.description}</p>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
