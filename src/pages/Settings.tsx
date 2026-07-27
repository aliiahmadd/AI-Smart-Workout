import { useState } from 'react'
import { Bell, Lock, Moon, Sun, Globe, Shield, CreditCard, HelpCircle, Watch } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { Card, SectionHeader } from '../components/ui'

export default function Settings() {
  const { theme, toggle } = useTheme()
  const [notif, setNotif] = useState({ workout: true, water: true, sleep: false, challenges: true, community: false })
  const [privacy, setPrivacy] = useState({ profile: 'public', analytics: true, share: false })

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SectionHeader title="Settings" subtitle="Customize your experience" />

      {/* Appearance */}
      <Card>
        <SectionHeader title="Appearance" subtitle="Theme & display" action={theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />} />
        <Row icon={theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />} title="Dark Mode" subtitle="Toggle between dark and light themes">
          <Toggle on={theme === 'dark'} onClick={toggle} />
        </Row>
        <Row icon={<Globe className="h-5 w-5" />} title="Language" subtitle="App language">
          <select className="input w-32"><option>English</option><option>Spanish</option><option>French</option></select>
        </Row>
      </Card>

      {/* Notifications */}
      <Card>
        <SectionHeader title="Notifications" subtitle="Stay on track" action={<Bell className="h-5 w-5 text-primary-300" />} />
        {[
          { key: 'workout', title: 'Workout Reminders', sub: 'Daily workout notifications' },
          { key: 'water', title: 'Water Reminders', sub: 'Hydration alerts' },
          { key: 'sleep', title: 'Sleep Reminders', sub: 'Bedtime notifications' },
          { key: 'challenges', title: 'Challenge Updates', sub: 'New challenges & rewards' },
          { key: 'community', title: 'Community', sub: 'Likes, comments, follows' },
        ].map((n) => (
          <Row key={n.key} icon={<Bell className="h-5 w-5" />} title={n.title} subtitle={n.sub}>
            <Toggle on={notif[n.key as keyof typeof notif]} onClick={() => setNotif({ ...notif, [n.key]: !notif[n.key as keyof typeof notif] })} />
          </Row>
        ))}
      </Card>

      {/* Privacy */}
      <Card>
        <SectionHeader title="Privacy" subtitle="Control your data" action={<Shield className="h-5 w-5 text-secondary-400" />} />
        <Row icon={<Globe className="h-5 w-5" />} title="Profile Visibility" subtitle="Who can see your profile">
          <select className="input w-32" value={privacy.profile} onChange={(e) => setPrivacy({ ...privacy, profile: e.target.value })}>
            <option value="public">Public</option>
            <option value="friends">Friends</option>
            <option value="private">Private</option>
          </select>
        </Row>
        <Row icon={<Shield className="h-5 w-5" />} title="Analytics" subtitle="Share usage to improve AI">
          <Toggle on={privacy.analytics} onClick={() => setPrivacy({ ...privacy, analytics: !privacy.analytics })} />
        </Row>
        <Row icon={<Lock className="h-5 w-5" />} title="Share Progress" subtitle="Auto-share to community">
          <Toggle on={privacy.share} onClick={() => setPrivacy({ ...privacy, share: !privacy.share })} />
        </Row>
      </Card>

      {/* Subscription */}
      <Card>
        <SectionHeader title="Subscription" subtitle="Your plan" action={<CreditCard className="h-5 w-5 text-yellow-400" />} />
        <div className="rounded-2xl bg-gradient-to-br from-primary-600/25 to-accent-500/15 p-4">
          <p className="font-display text-lg font-bold">AI Pro</p>
          <p className="text-sm text-white/60">Unlimited AI plans, recipes & coach chats</p>
          <button className="btn-ghost mt-3">Manage Subscription</button>
        </div>
      </Card>

      {/* Devices */}
      <Card>
        <SectionHeader title="Connected Devices" subtitle="Wearables & integrations" action={<Watch className="h-5 w-5 text-accent-400" />} />
        {['Apple Health', 'Google Fit', 'Garmin Connect', 'Strava'].map((d) => (
          <Row key={d} icon={<Watch className="h-5 w-5" />} title={d} subtitle="Sync activity data">
            <button className="chip bg-primary/15 text-primary-300">Connect</button>
          </Row>
        ))}
      </Card>

      {/* Help */}
      <Card>
        <SectionHeader title="Help & Support" action={<HelpCircle className="h-5 w-5 text-white/50" />} />
        <Row icon={<HelpCircle className="h-5 w-5" />} title="FAQ" subtitle="Common questions">
          <button className="text-sm text-primary-300">Open</button>
        </Row>
        <Row icon={<Lock className="h-5 w-5" />} title="Privacy Policy" subtitle="How we handle your data">
          <button className="text-sm text-primary-300">Read</button>
        </Row>
      </Card>
    </div>
  )
}

function Row({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-t border-white/5 py-3 first:border-t-0">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/5 text-white/70">{icon}</div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-xs text-white/50">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`relative h-7 w-12 rounded-full transition ${on ? 'bg-primary' : 'bg-white/15'}`}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-6' : 'left-1'}`} />
    </button>
  )
}
