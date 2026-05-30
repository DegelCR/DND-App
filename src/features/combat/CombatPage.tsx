import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { db } from '@/db'
import { CombatLog } from './components/CombatLog'
import { CombatTracker } from './components/CombatTracker'
import { EncounterSidebar } from './components/EncounterSidebar'
import { useCombat } from './useCombat'

export function CombatPage() {
  const {
    loading,
    encounters,
    activeEncounter,
    activeEncounterId,
    combatants,
    log,
    pendingMonster,
    selectEncounter,
    createEncounter,
    renameEncounter,
    deleteEncounter,
    addCombatant,
    addMonsterFromBestiary,
    dismissPendingMonster,
    removeCombatant,
    rollCombatantInitiative,
    rollAllInitiative,
    nextTurn,
    prevTurn,
    adjustHp,
    toggleDefeated,
    toggleHideHp,
    toggleCondition,
    clearLog,
  } = useCombat()

  const [combatantCounts, setCombatantCounts] = useState<Record<number, number>>({})

  useEffect(() => {
    async function loadCounts() {
      const counts: Record<number, number> = {}
      for (const encounter of encounters) {
        if (encounter.id == null) continue
        counts[encounter.id] = await db.combatCombatants
          .where('encounterId')
          .equals(encounter.id)
          .count()
      }
      setCombatantCounts(counts)
    }
    if (!loading) loadCounts()
  }, [encounters, loading, combatants.length])

  const sortedLog = useMemo(() => log, [log])

  return (
    <>
      <PageHeader
        title="Combat"
        description="Initiative tracker, HP, conditions, and combat log. Encounters save locally."
        icon="⚔️"
      />

      {loading ? (
        <div className="p-6">
          <div className="h-64 animate-pulse rounded-xl bg-table-900/60" />
        </div>
      ) : (
        <div className="grid flex-1 gap-6 p-6 lg:grid-cols-[260px_1fr_280px]">
          <EncounterSidebar
            encounters={encounters}
            activeId={activeEncounterId}
            combatantCounts={combatantCounts}
            onSelect={(id) => void selectEncounter(id)}
            onCreate={(name) => void createEncounter(name)}
            onDelete={(id) => void deleteEncounter(id)}
          />

          <CombatTracker
            encounter={activeEncounter}
            combatants={combatants}
            pendingMonster={pendingMonster}
            onRename={(name) => {
              if (activeEncounterId != null) void renameEncounter(activeEncounterId, name)
            }}
            onAddCombatant={(input) => void addCombatant(input)}
            onAddPendingMonster={() => {
              if (pendingMonster) {
                void addMonsterFromBestiary(
                  pendingMonster.monsterIndex,
                  pendingMonster.name,
                )
              }
            }}
            onDismissPending={() => void dismissPendingMonster()}
            onRollAllInitiative={() => void rollAllInitiative()}
            onNextTurn={() => void nextTurn()}
            onPrevTurn={() => void prevTurn()}
            onRollInitiative={(id) => void rollCombatantInitiative(id)}
            onAdjustHp={(id, delta) => void adjustHp(id, delta)}
            onToggleDefeated={(id) => void toggleDefeated(id)}
            onToggleHideHp={(id) => void toggleHideHp(id)}
            onToggleCondition={(id, c) => void toggleCondition(id, c)}
            onRemoveCombatant={(id) => void removeCombatant(id)}
          />

          <CombatLog entries={sortedLog} onClear={() => void clearLog()} />
        </div>
      )}
    </>
  )
}
