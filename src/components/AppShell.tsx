import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard,
  Dumbbell,
  Salad,
  TrendingUp,
  Trophy,
  Users,
  Bot,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Menu,
  X,
  Flame,
  Home,
  User,
  Shield,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

const sidebarLinks = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/workouts', label: 'Workouts', icon: Dumbbell },
  { to: '/app/ai-generator', label: 'AI Generator', icon: Bot },
  { to: '/app/nutrition', label: 'Nutrition', icon: Salad },
  { to: '/app/progress', label: 'Progress', icon: TrendingUp },
  { to: '/app/challenges', label: 'Challenges', icon: Trophy },
  { to: '/app/community', label: 'Community', icon: Users },
  { to: '/app/ai-coach', label: 'AI Coach', icon: Bot },
  { to: '/app/profile', label: 'Profile', icon: User },
  { to: '/app/settings', label: 'Settings', icon: SettingsIcon },
  { to: '/app/admin', label: 'Admin', icon: Shield },
]

const bottomLinks = [
  { to: '/app/dashboard', label: 'Home', icon: Home },
  { to: '/app/workouts', label: 'Workouts', icon: Dumbbell },
  { to: '/app/ai-coach', label: 'AI Coach', icon: Bot },
  { to: '/app/progress', label: 'Progress', icon: TrendingUp },
  { to: '/app/profile', label: 'Profile', icon: User },
]

export function AppShell() {
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col gap-2 border-r border-white/10 bg-card/40 p-4 backdrop-blur-xl lg:flex">
        <Brand />
        <nav className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto no-scrollbar">
          {sidebarLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary/15 text-primary-300 shadow-glow'
                    : 'text-white/65 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <l.icon className="h-5 w-5" />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-2 flex items-center gap-2 rounded-2xl bg-white/5 p-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/20 text-primary-300">
            <Flame className="h-4 w-4" />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-semibold">12 day streak</p>
            <p className="text-white/50">3450 XP</p>
          </div>
          <button onClick={toggle} className="rounded-xl bg-white/5 p-2 hover:bg-white/10" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-bg/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Brand compact />
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="rounded-xl bg-white/5 p-2" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button onClick={() => setOpen(true)} className="rounded-xl bg-white/5 p-2" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="absolute left-0 top-0 flex h-full w-72 flex-col gap-2 border-r border-white/10 bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <Brand />
                <button onClick={() => setOpen(false)} className="rounded-xl bg-white/5 p-2">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto">
                {sidebarLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition ${
                        isActive ? 'bg-primary/15 text-primary-300' : 'text-white/65 hover:bg-white/5'
                      }`
                    }
                  >
                    <l.icon className="h-5 w-5" />
                    {l.label}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="min-h-screen px-4 pb-28 pt-4 lg:px-8 lg:pb-8 lg:pt-6">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/10 bg-card/80 px-2 py-2 backdrop-blur-xl lg:hidden">
        {bottomLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] font-medium transition ${
                isActive ? 'text-primary-300' : 'text-white/55'
              }`
            }
          >
            <l.icon className="h-5 w-5" />
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-glow">
        <Dumbbell className="h-5 w-5" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="font-display text-sm font-bold">AI Smart Workout</p>
          <p className="text-[10px] text-white/45">Train smarter</p>
        </div>
      )}
    </div>
  )
}
