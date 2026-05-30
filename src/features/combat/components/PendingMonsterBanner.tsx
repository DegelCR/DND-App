import type { PendingCombatMonster } from '@/types/combat'

interface PendingMonsterBannerProps {
  pending: PendingCombatMonster
  hasEncounter: boolean
  onAdd: () => void
  onDismiss: () => void
}

export function PendingMonsterBanner({
  pending,
  hasEncounter,
  onAdd,
  onDismiss,
}: PendingMonsterBannerProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-3">
      <p className="text-sm text-gold-300">
        <span className="font-medium">{pending.name}</span> queued from Bestiary
      </p>
      <div className="flex gap-2">
        {hasEncounter ? (
          <button
            type="button"
            onClick={onAdd}
            className="rounded-lg bg-gold-500/20 px-3 py-1.5 text-sm text-gold-300 ring-1 ring-gold-500/40 hover:bg-gold-500/30"
          >
            Add to encounter
          </button>
        ) : (
          <span className="text-xs text-table-400">Create an encounter first</span>
        )}
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg px-3 py-1.5 text-sm text-table-400 hover:bg-table-800 hover:text-table-200"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
