import { useEffect, useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area,
} from 'recharts'
import { Users, Dumbbell, Salad, Bot, BarChart3, FileText, MessageSquare, Bell, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Card, SectionHeader, Spinner } from '../components/ui'

type Tab = 'users' | 'exercises' | 'nutrition' | 'prompts' | 'analytics' | 'reports' | 'feedback'

export default function Admin() {
  const [tab, setTab] = useState<Tab>('analytics')
  const [stats, setStats] = useState({ users: 0, exercises: 0, meals: 0, messages: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('exercises').select('*', { count: 'exact', head: true }),
      supabase.from('meal_plans').select('*', { count: 'exact', head: true }),
      supabase.from('chat_messages').select('*', { count: 'exact', head: true }),
    ]).then(([u, e, m, c]) => {
      setStats({
        users: u.count || 0,
        exercises: e.count || 0,
        meals: m.count || 0,
        messages: c.count || 0,
      })
      setLoading(false)
    })
  }, [])

  const growthData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m, i) => ({
    month: m,
    users: 120 + i * 45 + Math.round(Math.random() * 30),
    revenue: 2400 + i * 900 + Math.round(Math.random() * 200),
  }))

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'exercises', label: 'Exercises', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition DB', icon: Salad },
    { id: 'prompts', label: 'AI Prompts', icon: Bot },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SectionHeader title="Admin Dashboard" subtitle="Manage your platform" action={<span className="chip bg-primary/15 text-primary-300">Admin</span>} />

      {loading ? (
        <div className="grid place-items-center py-20"><Spinner /></div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <AdminStat icon={<Users className="h-5 w-5" />} label="Total Users" value={stats.users} color="primary" />
            <AdminStat icon={<Dumbbell className="h-5 w-5" />} label="Exercises" value={stats.exercises} color="secondary" />
            <AdminStat icon={<Salad className="h-5 w-5" />} label="Meal Plans" value={stats.meals} color="accent" />
            <AdminStat icon={<Bot className="h-5 w-5" />} label="AI Chats" value={stats.messages} color="primary" />
          </div>

          {/* Tabs */}
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`chip whitespace-nowrap px-4 py-2 ${tab === t.id ? 'bg-primary text-white' : 'bg-white/5 text-white/60'}`}>
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </div>

          {tab === 'analytics' && (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <SectionHeader title="User Growth" subtitle="New signups per month" />
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22C55E" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }} />
                      <Area type="monotone" dataKey="users" stroke="#22C55E" strokeWidth={2.5} fill="url(#g1)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card>
                <SectionHeader title="Revenue" subtitle="Monthly (USD)" />
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }} />
                      <Bar dataKey="revenue" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {tab === 'users' && (
            <Card>
              <SectionHeader title="User Management" subtitle="View and manage users" action={<div className="relative"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-white/40" /><input className="input w-48 py-2 pl-9 text-sm" placeholder="Search…" /></div>} />
              <Table headers={['Name', 'Email', 'XP', 'Streak', 'Status']} rows={[
                ['Sarah K.', 'sarah@example.com', '4820', '28', 'Active'],
                ['Mike R.', 'mike@example.com', '4100', '21', 'Active'],
                ['Emma L.', 'emma@example.com', '3200', '9', 'Active'],
                ['James T.', 'james@example.com', '2900', '7', 'Inactive'],
              ]} />
            </Card>
          )}

          {tab === 'exercises' && (
            <Card>
              <SectionHeader title="Exercise Management" subtitle="Curate the library" action={<button className="btn-primary px-4 py-2">+ Add</button>} />
              <Table headers={['Name', 'Category', 'Difficulty', 'Calories', 'Duration']} rows={[
                ['Bench Press', 'Chest', 'Intermediate', '90', '15 min'],
                ['Squats', 'Legs', 'Beginner', '100', '10 min'],
                ['Pull-Ups', 'Back', 'Advanced', '80', '10 min'],
              ]} />
            </Card>
          )}

          {tab === 'nutrition' && (
            <Card>
              <SectionHeader title="Nutrition Database" subtitle="Manage foods & macros" action={<button className="btn-primary px-4 py-2">+ Add Food</button>} />
              <Table headers={['Food', 'Calories', 'Protein', 'Carbs', 'Fat']} rows={[
                ['Chicken Breast (100g)', '165', '31', '0', '3.6'],
                ['Brown Rice (100g)', '123', '2.7', '26', '1'],
                ['Salmon (100g)', '208', '20', '0', '13'],
              ]} />
            </Card>
          )}

          {tab === 'prompts' && (
            <Card>
              <SectionHeader title="AI Prompt Management" subtitle="Tune the AI coach" action={<Bot className="h-5 w-5 text-accent-400" />} />
              <div className="space-y-3">
                {[
                  { name: 'Workout Advice Prompt', version: 'v2.1' },
                  { name: 'Nutrition Advice Prompt', version: 'v1.8' },
                  { name: 'Motivation Prompt', version: 'v1.3' },
                ].map((p) => (
                  <div key={p.name} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <div><p className="font-medium">{p.name}</p><p className="text-xs text-white/50">{p.version}</p></div>
                    <button className="chip bg-primary/15 text-primary-300">Edit</button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === 'reports' && (
            <Card>
              <SectionHeader title="Reports" subtitle="Platform insights" action={<FileText className="h-5 w-5 text-white/50" />} />
              <div className="grid gap-3 sm:grid-cols-2">
                {['Monthly Active Users', 'Workout Completion Rate', 'AI Plan Generation', 'Retention Rate', 'Revenue Report', 'Top Exercises'].map((r) => (
                  <div key={r} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <span className="text-sm">{r}</span>
                    <button className="text-sm text-primary-300">Export</button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === 'feedback' && (
            <Card>
              <SectionHeader title="User Feedback" subtitle="Recent submissions" action={<MessageSquare className="h-5 w-5 text-white/50" />} />
              <div className="space-y-3">
                {[
                  { user: 'Sarah K.', text: 'Love the AI meal plans! Could use more vegetarian options.', rating: 5 },
                  { user: 'Mike R.', text: 'Workout generator is spot on. Would like video demos.', rating: 4 },
                  { user: 'Emma L.', text: 'App crashes sometimes on the progress page.', rating: 3 },
                ].map((f, i) => (
                  <div key={i} className="rounded-2xl bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{f.user}</p>
                      <span className="text-yellow-400">{'★'.repeat(f.rating)}</span>
                    </div>
                    <p className="mt-1 text-sm text-white/70">{f.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

function AdminStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: 'primary' | 'secondary' | 'accent' }) {
  const colors = { primary: 'from-primary-500/20 to-primary-500/5 text-primary-300', secondary: 'from-secondary-500/20 to-secondary-500/5 text-secondary-400', accent: 'from-accent-500/20 to-accent-500/5 text-accent-400' }
  return (
    <Card className="flex items-center gap-3">
      <div className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${colors[color]}`}>{icon}</div>
      <div><p className="text-xs text-white/55">{label}</p><p className="stat-value">{value.toLocaleString()}</p></div>
    </Card>
  )
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-white/55">
            {headers.map((h) => <th key={h} className="pb-2 pr-4 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5">
              {row.map((cell, j) => <td key={j} className="py-3 pr-4">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
