import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

export function Card({
  children,
  className = '',
  hover = true,
}: {
  children: ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={hover ? { y: -3 } : undefined}
      className={`card ${className}`}
    >
      {children}
    </motion.div>
  )
}

export function StatCard({
  icon,
  label,
  value,
  unit,
  accent = 'primary',
  trend,
}: {
  icon: ReactNode
  label: string
  value: string | number
  unit?: string
  accent?: 'primary' | 'secondary' | 'accent'
  trend?: string
}) {
  const colors = {
    primary: 'from-primary-500/20 to-primary-500/5 text-primary-300',
    secondary: 'from-secondary-500/20 to-secondary-500/5 text-secondary-400',
    accent: 'from-accent-500/20 to-accent-500/5 text-accent-400',
  }
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${colors[accent]}`}>
          {icon}
        </div>
        {trend && <span className="chip bg-secondary/15 text-secondary-400">{trend}</span>}
      </div>
      <div>
        <p className="text-sm text-white/60 dark:text-white/60">{label}</p>
        <p className="stat-value mt-0.5">
          {value}
          {unit && <span className="ml-1 text-base font-medium text-white/50">{unit}</span>}
        </p>
      </div>
    </Card>
  )
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-white/55">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function ProgressBar({ value, max = 100, className = '' }: { value: number; max?: number; className?: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-white/10 ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
      />
    </div>
  )
}

export function EmptyState({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/5 text-white/40">{icon}</div>
      <p className="font-medium text-white/70">{title}</p>
      {subtitle && <p className="max-w-xs text-sm text-white/45">{subtitle}</p>}
    </div>
  )
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-primary ${className}`} />
  )
}
