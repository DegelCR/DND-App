import { Link } from 'react-router-dom'
import type { NavModule } from '@/types'
import { STATUS_LABELS } from '@/lib/navigation'
import { GlowCard } from '@/components/reactbits'

interface ModuleCardProps {
  module: NavModule
}

const statusStyles: Record<NavModule['status'], string> = {
  ready: 'border-emerald-500/30 bg-emerald-500/5',
  wip: 'border-amber-500/30 bg-amber-500/5',
  planned: 'border-table-600 bg-table-800/50',
}

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <GlowCard className="rounded-xl">
      <Link
        to={module.path}
        className={`group relative block rounded-xl border p-5 transition-all hover:border-gold-500/40 ${statusStyles[module.status]}`}
      >
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl" aria-hidden="true">
          {module.icon}
        </span>
        <span className="rounded-full bg-table-700 px-2 py-0.5 text-[10px] uppercase tracking-wider text-table-300">
          {STATUS_LABELS[module.status]}
        </span>
      </div>
      <h3 className="mt-4 font-display text-lg text-table-100 group-hover:text-gold-300">
        {module.label}
      </h3>
      <p className="mt-1 text-sm text-table-400">{module.description}</p>
      {module.status === 'planned' && (
        <p className="mt-3 text-xs text-table-500">Phase {module.phase}</p>
      )}
      </Link>
    </GlowCard>
  )
}
