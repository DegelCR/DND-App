import type { CombatEncounter } from '@/types/combat'

interface EncounterSidebarProps {
  encounters: CombatEncounter[]
  activeId: number | null
  combatantCounts: Record<number, number>
  onSelect: (id: number) => void
  onCreate: (name: string) => void
  onDelete: (id: number) => void
}

export function EncounterSidebar({
  encounters,
  activeId,
  combatantCounts,
  onSelect,
  onCreate,
  onDelete,
}: EncounterSidebarProps) {
  function handleCreate() {
    const name = window.prompt('Encounter name:', 'New encounter')
    if (name === null) return
    onCreate(name)
  }

  return (
    <section className="flex h-full flex-col rounded-xl border border-table-700 bg-table-900/60">
      <div className="flex items-center justify-between border-b border-table-700 px-4 py-3">
        <div>
          <h2 className="font-display text-lg text-table-100">Encounters</h2>
          <p className="text-xs text-table-500">Saved locally</p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="rounded-lg bg-gold-500/20 px-2.5 py-1.5 text-xs font-medium text-gold-300 ring-1 ring-gold-500/40 hover:bg-gold-500/30"
        >
          + New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {encounters.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-table-500">
            No encounters yet. Create one to start tracking combat.
          </p>
        ) : (
          <ul className="space-y-1">
            {encounters.map((encounter) => {
              const isActive = encounter.id === activeId
              const count = combatantCounts[encounter.id!] ?? 0

              return (
                <li key={encounter.id}>
                  <div
                    className={`flex items-center gap-1 rounded-lg ${
                      isActive ? 'bg-gold-500/15 ring-1 ring-gold-500/30' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(encounter.id!)}
                      className={`min-w-0 flex-1 px-3 py-2.5 text-left text-sm transition-colors ${
                        isActive ? 'text-gold-300' : 'text-table-200 hover:bg-table-800'
                      }`}
                    >
                      <p className="truncate font-medium">{encounter.name}</p>
                      <p className="text-xs text-table-500">
                        Round {encounter.round} · {count} combatant{count === 1 ? '' : 's'}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete "${encounter.name}" and all its combatants?`,
                          )
                        ) {
                          onDelete(encounter.id!)
                        }
                      }}
                      className="shrink-0 px-2 py-2 text-xs text-table-500 hover:text-blood-400"
                      aria-label={`Delete ${encounter.name}`}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
