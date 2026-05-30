import type { CombatLogEntry } from '@/types/combat'

interface CombatLogProps {
  entries: CombatLogEntry[]
  onClear: () => void
}

export function CombatLog({ entries, onClear }: CombatLogProps) {
  return (
    <section className="flex h-full flex-col rounded-xl border border-table-700 bg-table-900/60">
      <div className="flex items-center justify-between border-b border-table-700 px-4 py-3">
        <div>
          <h2 className="font-display text-lg text-table-100">Combat log</h2>
          <p className="text-xs text-table-500">Turn & HP events</p>
        </div>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-2 py-1 text-xs text-table-400 hover:bg-table-800 hover:text-table-200"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {entries.length === 0 ? (
          <p className="py-8 text-center text-sm text-table-500">
            No log entries yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-lg border border-table-700 bg-table-800/50 px-3 py-2 text-sm"
              >
                <p className="text-table-200">{entry.message}</p>
                <p className="mt-0.5 text-[10px] text-table-600">
                  {formatTime(entry.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date))
}
