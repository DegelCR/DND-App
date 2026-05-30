import type { Session } from '@/types'

interface SessionListPanelProps {
  sessions: Session[]
  activeId: number | null
  campaignSelected: boolean
  onSelect: (id: number) => void
  onCreate: () => void
  onDelete: (id: number) => void
}

export function SessionListPanel({
  sessions,
  activeId,
  campaignSelected,
  onSelect,
  onCreate,
  onDelete,
}: SessionListPanelProps) {
  return (
    <aside className="flex flex-col rounded-xl border border-table-700 bg-table-900/40">
      <div className="flex items-center justify-between border-b border-table-700 px-4 py-3">
        <div>
          <h2 className="font-display text-lg text-table-100">Sessions</h2>
          <p className="text-xs text-table-500">Numbered chronologically</p>
        </div>
        <button
          type="button"
          disabled={!campaignSelected}
          onClick={onCreate}
          className="rounded-lg bg-gold-500/20 px-3 py-1.5 text-sm text-gold-300 hover:bg-gold-500/30 disabled:opacity-40"
        >
          + New
        </button>
      </div>

      <ul className="flex-1 overflow-y-auto p-2">
        {!campaignSelected ? (
          <li className="px-2 py-4 text-center text-xs text-table-500">
            Select a campaign first
          </li>
        ) : sessions.length === 0 ? (
          <li className="px-2 py-4 text-center text-xs text-table-500">
            Add session 1 to start taking notes
          </li>
        ) : (
          sessions.map((session) => {
            if (session.id == null) return null
            const active = session.id === activeId
            return (
              <li key={session.id} className="group mb-1">
                <div
                  className={`flex items-center gap-1 rounded-lg ${
                    active ? 'bg-gold-500/15' : 'hover:bg-table-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(session.id!)}
                    className={`min-w-0 flex-1 px-3 py-2.5 text-left text-sm ${
                      active ? 'text-gold-300' : 'text-table-200'
                    }`}
                  >
                    <span className="block truncate font-medium">
                      #{session.number} — {session.title}
                    </span>
                    <span className="text-xs text-table-500">{session.date}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete session ${session.number}?`)) {
                        onDelete(session.id!)
                      }
                    }}
                    className="px-2 py-2 text-xs text-table-500 opacity-0 hover:text-blood-400 group-hover:opacity-100"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              </li>
            )
          })
        )}
      </ul>
    </aside>
  )
}
