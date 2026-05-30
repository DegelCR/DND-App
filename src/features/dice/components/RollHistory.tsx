import type { DiceRollRecord } from '@/types'

interface RollHistoryProps {
  history: DiceRollRecord[]
  loading: boolean
  onClear: () => void
}

export function RollHistory({ history, loading, onClear }: RollHistoryProps) {
  return (
    <section className="flex h-full flex-col rounded-xl border border-table-700 bg-table-900/60">
      <div className="flex items-center justify-between border-b border-table-700 px-4 py-3">
        <div>
          <h2 className="font-display text-lg text-table-100">History</h2>
          <p className="text-xs text-table-500">Last 20 rolls</p>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-2 py-1 text-xs text-table-400 transition-colors hover:bg-table-800 hover:text-table-200"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {loading && (
          <p className="py-8 text-center text-sm text-table-500">Loading…</p>
        )}

        {!loading && history.length === 0 && (
          <p className="py-8 text-center text-sm text-table-500">
            No rolls yet. Throw the first die!
          </p>
        )}

        <ul className="space-y-2">
          {history.map((roll) => (
            <li
              key={roll.id}
              className={`rounded-lg border px-3 py-2.5 ${
                roll.isCritical
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : roll.isFumble
                    ? 'border-blood-500/40 bg-blood-500/10'
                    : 'border-table-700 bg-table-800/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-table-200">
                    {roll.label ?? roll.expression}
                  </p>
                  <p className="text-xs text-table-500">
                    [{roll.rolls.join(', ')}]
                    {roll.modifier !== 0 &&
                      (roll.modifier > 0
                        ? ` + ${roll.modifier}`
                        : ` − ${Math.abs(roll.modifier)}`)}
                    {roll.mode === 'advantage' && ' · Advantage'}
                    {roll.mode === 'disadvantage' && ' · Disadvantage'}
                  </p>
                </div>
                <span
                  className={`shrink-0 font-display text-xl ${
                    roll.isCritical
                      ? 'text-emerald-400'
                      : roll.isFumble
                        ? 'text-blood-400'
                        : 'text-gold-400'
                  }`}
                >
                  {roll.result}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-table-600">
                {formatTime(roll.createdAt)}
              </p>
            </li>
          ))}
        </ul>
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
