import type { CombatCombatant, CombatEncounter, PendingCombatMonster } from '@/types/combat'
import { AddCombatantForm } from './AddCombatantForm'
import { CombatantRow } from './CombatantRow'
import { PendingMonsterBanner } from './PendingMonsterBanner'

interface CombatTrackerProps {
  encounter: CombatEncounter | null
  combatants: CombatCombatant[]
  pendingMonster: PendingCombatMonster | null
  onRename: (name: string) => void
  onAddCombatant: (input: {
    name: string
    type: CombatCombatant['type']
    maxHp: number
    initiativeBonus: number
    armorClass?: number
  }) => void
  onAddPendingMonster: () => void
  onDismissPending: () => void
  onRollAllInitiative: () => void
  onNextTurn: () => void
  onPrevTurn: () => void
  onRollInitiative: (id: number) => void
  onAdjustHp: (id: number, delta: number) => void
  onToggleDefeated: (id: number) => void
  onToggleHideHp: (id: number) => void
  onToggleCondition: (id: number, condition: string) => void
  onRemoveCombatant: (id: number) => void
}

export function CombatTracker({
  encounter,
  combatants,
  pendingMonster,
  onRename,
  onAddCombatant,
  onAddPendingMonster,
  onDismissPending,
  onRollAllInitiative,
  onNextTurn,
  onPrevTurn,
  onRollInitiative,
  onAdjustHp,
  onToggleDefeated,
  onToggleHideHp,
  onToggleCondition,
  onRemoveCombatant,
}: CombatTrackerProps) {
  if (!encounter) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-table-700 bg-table-900/20 p-8 text-center">
        <span className="text-4xl" aria-hidden="true">
          ⚔️
        </span>
        <p className="mt-4 text-table-300">Create an encounter to begin</p>
        <p className="mt-1 text-sm text-table-500">
          Add PCs, NPCs, or monsters from the Bestiary.
        </p>
      </div>
    )
  }

  const activeCombatant = combatants[encounter.activeIndex]

  function handleRename() {
    const name = window.prompt('Encounter name:', encounter!.name)
    if (name === null) return
    onRename(name)
  }

  return (
    <div className="space-y-4">
      {pendingMonster && (
        <PendingMonsterBanner
          pending={pendingMonster}
          hasEncounter={true}
          onAdd={onAddPendingMonster}
          onDismiss={onDismissPending}
        />
      )}

      <div className="rounded-xl border border-table-700 bg-table-900/60 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <button
              type="button"
              onClick={handleRename}
              className="font-display text-xl text-gold-300 hover:text-gold-200"
              title="Rename encounter"
            >
              {encounter.name} ✎
            </button>
            <p className="mt-1 text-sm text-table-400">
              Round {encounter.round}
              {activeCombatant && (
                <>
                  {' '}
                  · Turn:{' '}
                  <span className="text-table-200">{activeCombatant.name}</span>
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onPrevTurn}
              disabled={combatants.length === 0}
              className="rounded-lg border border-table-600 px-3 py-1.5 text-sm text-table-300 hover:bg-table-800 disabled:opacity-40"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={onNextTurn}
              disabled={combatants.length === 0}
              className="rounded-lg bg-gold-500/20 px-3 py-1.5 text-sm text-gold-300 ring-1 ring-gold-500/40 hover:bg-gold-500/30 disabled:opacity-40"
            >
              Next turn →
            </button>
            <button
              type="button"
              onClick={onRollAllInitiative}
              disabled={combatants.length === 0}
              className="rounded-lg border border-table-600 px-3 py-1.5 text-sm text-table-300 hover:bg-table-800 disabled:opacity-40"
            >
              Roll all initiative
            </button>
          </div>
        </div>
      </div>

      <AddCombatantForm onAdd={onAddCombatant} />

      {combatants.length === 0 ? (
        <p className="rounded-xl border border-dashed border-table-700 py-8 text-center text-sm text-table-500">
          No combatants yet. Add PCs, NPCs, or import from the Bestiary.
        </p>
      ) : (
        <ul className="space-y-3">
          {combatants.map((combatant, index) => (
            <CombatantRow
              key={combatant.id}
              combatant={combatant}
              isActive={index === encounter.activeIndex}
              onRollInitiative={() => onRollInitiative(combatant.id!)}
              onAdjustHp={(delta) => onAdjustHp(combatant.id!, delta)}
              onToggleDefeated={() => onToggleDefeated(combatant.id!)}
              onToggleHideHp={() => onToggleHideHp(combatant.id!)}
              onToggleCondition={(c) => onToggleCondition(combatant.id!, c)}
              onRemove={() => {
                if (window.confirm(`Remove "${combatant.name}"?`)) {
                  onRemoveCombatant(combatant.id!)
                }
              }}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
