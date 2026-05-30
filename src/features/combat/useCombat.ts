import { useCallback, useEffect, useMemo, useState } from 'react'
import { db } from '@/db'
import {
  abilityModifier,
  advanceTurn,
  previousTurn,
  rollInitiative,
  sortCombatants,
} from '@/lib/combat'
import { fetchMonsterDetail } from '@/lib/srd-api'
import type { CombatCombatant, CombatEncounter, CombatLogEntry, PendingCombatMonster } from '@/types/combat'

const ACTIVE_ENCOUNTER_KEY = 'active_combat_encounter_id'
const PENDING_MONSTER_KEY = 'pending_combat_monster'

async function appendLog(encounterId: number, message: string) {
  await db.combatLog.add({
    encounterId,
    message,
    createdAt: new Date(),
  })
}

async function loadSortedCombatants(encounterId: number) {
  const rows = await db.combatCombatants.where('encounterId').equals(encounterId).toArray()
  return sortCombatants(rows)
}

async function syncSortOrder(combatants: CombatCombatant[]) {
  await Promise.all(
    combatants.map((c, index) =>
      db.combatCombatants.update(c.id!, { sortOrder: index }),
    ),
  )
}

export function useCombat() {
  const [encounters, setEncounters] = useState<CombatEncounter[]>([])
  const [activeEncounterId, setActiveEncounterId] = useState<number | null>(null)
  const [combatants, setCombatants] = useState<CombatCombatant[]>([])
  const [log, setLog] = useState<CombatLogEntry[]>([])
  const [pendingMonster, setPendingMonster] = useState<PendingCombatMonster | null>(null)
  const [loading, setLoading] = useState(true)

  const activeEncounter = useMemo(
    () => encounters.find((e) => e.id === activeEncounterId) ?? null,
    [encounters, activeEncounterId],
  )

  const refreshEncounters = useCallback(async () => {
    const rows = await db.combatEncounters.orderBy('updatedAt').reverse().toArray()
    setEncounters(rows)
    return rows
  }, [])

  const refreshCombatants = useCallback(async (encounterId: number) => {
    const rows = await loadSortedCombatants(encounterId)
    setCombatants(rows)
    return rows
  }, [])

  const refreshLog = useCallback(async (encounterId: number) => {
    const rows = await db.combatLog
      .where('encounterId')
      .equals(encounterId)
      .reverse()
      .sortBy('createdAt')
    setLog(rows)
  }, [])

  const refreshPending = useCallback(async () => {
    const row = await db.settings.get({ key: PENDING_MONSTER_KEY })
    if (!row?.value) {
      setPendingMonster(null)
      return
    }
    try {
      setPendingMonster(JSON.parse(row.value) as PendingCombatMonster)
    } catch {
      setPendingMonster(null)
    }
  }, [])

  const refreshAll = useCallback(
    async (encounterId: number | null) => {
      await refreshEncounters()
      if (encounterId != null) {
        await refreshCombatants(encounterId)
        await refreshLog(encounterId)
      } else {
        setCombatants([])
        setLog([])
      }
      await refreshPending()
    },
    [refreshEncounters, refreshCombatants, refreshLog, refreshPending],
  )

  useEffect(() => {
    let cancelled = false

    async function init() {
      const rows = await db.combatEncounters.orderBy('updatedAt').reverse().toArray()
      if (cancelled) return

      setEncounters(rows)

      const saved = await db.settings.get({ key: ACTIVE_ENCOUNTER_KEY })
      let activeId = saved?.value ? Number(saved.value) : null
      if (activeId != null && !rows.some((e) => e.id === activeId)) {
        activeId = rows[0]?.id ?? null
      }
      if (activeId == null && rows.length > 0) {
        activeId = rows[0].id!
      }

      setActiveEncounterId(activeId)

      if (activeId != null) {
        const sorted = await loadSortedCombatants(activeId)
        const logRows = await db.combatLog
          .where('encounterId')
          .equals(activeId)
          .reverse()
          .sortBy('createdAt')
        if (!cancelled) {
          setCombatants(sorted)
          setLog(logRows)
        }
      }

      await refreshPending()
      if (!cancelled) setLoading(false)
    }

    void init()
    return () => {
      cancelled = true
    }
  }, [refreshPending])

  const selectEncounter = useCallback(
    async (id: number) => {
      setActiveEncounterId(id)
      await db.settings.put({ key: ACTIVE_ENCOUNTER_KEY, value: String(id) })
      await refreshCombatants(id)
      await refreshLog(id)
    },
    [refreshCombatants, refreshLog],
  )

  const createEncounter = useCallback(
    async (name: string) => {
      const now = new Date()
      const id = await db.combatEncounters.add({
        name: name.trim() || 'New encounter',
        round: 1,
        activeIndex: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      })
      if (id === undefined) return
      await appendLog(id, `Encounter "${name.trim() || 'New encounter'}" created.`)
      await selectEncounter(id)
      await refreshEncounters()
    },
    [selectEncounter, refreshEncounters],
  )

  const renameEncounter = useCallback(
    async (id: number, name: string) => {
      const trimmed = name.trim()
      if (!trimmed) return
      await db.combatEncounters.update(id, { name: trimmed, updatedAt: new Date() })
      await appendLog(id, `Encounter renamed to "${trimmed}".`)
      await refreshAll(id)
    },
    [refreshAll],
  )

  const deleteEncounter = useCallback(
    async (id: number) => {
      await db.combatCombatants.where('encounterId').equals(id).delete()
      await db.combatLog.where('encounterId').equals(id).delete()
      await db.combatEncounters.delete(id)

      const rows = await refreshEncounters()
      if (activeEncounterId === id) {
        const nextId = rows[0]?.id ?? null
        setActiveEncounterId(nextId)
        if (nextId != null) {
          await db.settings.put({ key: ACTIVE_ENCOUNTER_KEY, value: String(nextId) })
          await refreshCombatants(nextId)
          await refreshLog(nextId)
        } else {
          const row = await db.settings.get({ key: ACTIVE_ENCOUNTER_KEY })
          if (row?.id) await db.settings.delete(row.id)
          setCombatants([])
          setLog([])
        }
      }
    },
    [activeEncounterId, refreshEncounters, refreshCombatants, refreshLog],
  )

  const addCombatant = useCallback(
    async (input: {
      name: string
      type: CombatCombatant['type']
      maxHp: number
      initiativeBonus: number
      armorClass?: number
      monsterIndex?: string
    }) => {
      if (activeEncounterId == null) return

      const count = await db.combatCombatants
        .where('encounterId')
        .equals(activeEncounterId)
        .count()

      const id = await db.combatCombatants.add({
        encounterId: activeEncounterId,
        name: input.name.trim(),
        type: input.type,
        initiative: null,
        initiativeBonus: input.initiativeBonus,
        maxHp: input.maxHp,
        currentHp: input.maxHp,
        armorClass: input.armorClass,
        isDefeated: false,
        hideHp: false,
        conditions: [],
        monsterIndex: input.monsterIndex,
        sortOrder: count,
        createdAt: new Date(),
      })

      await appendLog(
        activeEncounterId,
        `Added ${input.type.toUpperCase()} "${input.name.trim()}" (HP ${input.maxHp}).`,
      )
      await db.combatEncounters.update(activeEncounterId, { updatedAt: new Date() })
      await refreshCombatants(activeEncounterId)
      await refreshLog(activeEncounterId)
      return id
    },
    [activeEncounterId, refreshCombatants, refreshLog],
  )

  const addMonsterFromBestiary = useCallback(
    async (monsterIndex: string, displayName?: string) => {
      if (activeEncounterId == null) return

      let detail = await db.monsterDetails.get(monsterIndex)
      if (!detail) {
        try {
          detail = await fetchMonsterDetail(monsterIndex)
        } catch {
          return
        }
      }

      const name = displayName ?? detail.name
      const initBonus = abilityModifier(detail.dexterity)

      await addCombatant({
        name,
        type: 'monster',
        maxHp: detail.hitPoints,
        initiativeBonus: initBonus,
        armorClass: detail.armorClass,
        monsterIndex,
      })

      const row = await db.settings.get({ key: PENDING_MONSTER_KEY })
      if (row?.id) await db.settings.delete(row.id)
      setPendingMonster(null)
    },
    [activeEncounterId, addCombatant],
  )

  const dismissPendingMonster = useCallback(async () => {
    const row = await db.settings.get({ key: PENDING_MONSTER_KEY })
    if (row?.id) await db.settings.delete(row.id)
    setPendingMonster(null)
  }, [])

  const removeCombatant = useCallback(
    async (combatantId: number) => {
      if (activeEncounterId == null) return
      const target = combatants.find((c) => c.id === combatantId)
      await db.combatCombatants.delete(combatantId)
      if (target) {
        await appendLog(activeEncounterId, `Removed "${target.name}" from the encounter.`)
      }
      const sorted = await refreshCombatants(activeEncounterId)
      const encounter = await db.combatEncounters.get(activeEncounterId)
      if (encounter && sorted.length > 0 && encounter.activeIndex >= sorted.length) {
        await db.combatEncounters.update(activeEncounterId, {
          activeIndex: 0,
          updatedAt: new Date(),
        })
        await refreshEncounters()
      }
      await refreshLog(activeEncounterId)
    },
    [activeEncounterId, combatants, refreshCombatants, refreshEncounters, refreshLog],
  )

  const rollCombatantInitiative = useCallback(
    async (combatantId: number) => {
      if (activeEncounterId == null) return
      const target = combatants.find((c) => c.id === combatantId)
      if (!target) return

      const roll = rollInitiative(target.initiativeBonus)
      await db.combatCombatants.update(combatantId, { initiative: roll })
      await appendLog(
        activeEncounterId,
        `${target.name} rolled initiative: ${roll} (d20 + ${target.initiativeBonus >= 0 ? '+' : ''}${target.initiativeBonus}).`,
      )

      const sorted = await loadSortedCombatants(activeEncounterId)
      await syncSortOrder(sorted)
      await db.combatEncounters.update(activeEncounterId, { updatedAt: new Date() })
      await refreshCombatants(activeEncounterId)
      await refreshLog(activeEncounterId)
    },
    [activeEncounterId, combatants, refreshCombatants, refreshLog],
  )

  const rollAllInitiative = useCallback(async () => {
    if (activeEncounterId == null || combatants.length === 0) return

    for (const c of combatants) {
      const roll = rollInitiative(c.initiativeBonus)
      await db.combatCombatants.update(c.id!, { initiative: roll })
    }

    const sorted = await loadSortedCombatants(activeEncounterId)
    await syncSortOrder(sorted)
    await db.combatEncounters.update(activeEncounterId, {
      activeIndex: 0,
      round: 1,
      updatedAt: new Date(),
    })

    await appendLog(activeEncounterId, 'Initiative rolled for all combatants. Turn order set.')
    await refreshEncounters()
    await refreshCombatants(activeEncounterId)
    await refreshLog(activeEncounterId)
  }, [activeEncounterId, combatants, refreshEncounters, refreshCombatants, refreshLog])

  const nextTurn = useCallback(async () => {
    if (activeEncounterId == null || !activeEncounter || combatants.length === 0) return

    const { activeIndex, roundDelta } = advanceTurn(activeEncounter.activeIndex, combatants)
    const newRound = Math.max(1, activeEncounter.round + roundDelta)
    const current = combatants[activeIndex]

    await db.combatEncounters.update(activeEncounterId, {
      activeIndex,
      round: newRound,
      updatedAt: new Date(),
    })

    if (roundDelta > 0) {
      await appendLog(activeEncounterId, `Round ${newRound} begins.`)
    }
    if (current) {
      await appendLog(activeEncounterId, `Turn: ${current.name}.`)
    }

    await refreshEncounters()
    await refreshLog(activeEncounterId)
  }, [activeEncounterId, activeEncounter, combatants, refreshEncounters, refreshLog])

  const prevTurn = useCallback(async () => {
    if (activeEncounterId == null || !activeEncounter || combatants.length === 0) return

    const { activeIndex, roundDelta } = previousTurn(activeEncounter.activeIndex, combatants)
    const newRound = Math.max(1, activeEncounter.round + roundDelta)
    const current = combatants[activeIndex]

    await db.combatEncounters.update(activeEncounterId, {
      activeIndex,
      round: newRound,
      updatedAt: new Date(),
    })

    if (roundDelta < 0) {
      await appendLog(activeEncounterId, `Back to round ${newRound}.`)
    }
    if (current) {
      await appendLog(activeEncounterId, `Turn: ${current.name}.`)
    }

    await refreshEncounters()
    await refreshLog(activeEncounterId)
  }, [activeEncounterId, activeEncounter, combatants, refreshEncounters, refreshLog])

  const adjustHp = useCallback(
    async (combatantId: number, delta: number) => {
      if (activeEncounterId == null) return
      const target = combatants.find((c) => c.id === combatantId)
      if (!target) return

      const next = Math.max(0, Math.min(target.maxHp, target.currentHp + delta))
      await db.combatCombatants.update(combatantId, { currentHp: next })

      const sign = delta >= 0 ? '+' : ''
      await appendLog(
        activeEncounterId,
        `${target.name} HP ${sign}${delta} → ${next}/${target.maxHp}.`,
      )

      if (next === 0 && !target.isDefeated) {
        await db.combatCombatants.update(combatantId, { isDefeated: true })
        await appendLog(activeEncounterId, `${target.name} is defeated.`)
      }

      await db.combatEncounters.update(activeEncounterId, { updatedAt: new Date() })
      await refreshCombatants(activeEncounterId)
      await refreshLog(activeEncounterId)
    },
    [activeEncounterId, combatants, refreshCombatants, refreshLog],
  )

  const toggleDefeated = useCallback(
    async (combatantId: number) => {
      if (activeEncounterId == null) return
      const target = combatants.find((c) => c.id === combatantId)
      if (!target) return

      const next = !target.isDefeated
      await db.combatCombatants.update(combatantId, { isDefeated: next })
      await appendLog(
        activeEncounterId,
        next ? `${target.name} marked defeated.` : `${target.name} is active again.`,
      )
      await refreshCombatants(activeEncounterId)
      await refreshLog(activeEncounterId)
    },
    [activeEncounterId, combatants, refreshCombatants, refreshLog],
  )

  const toggleHideHp = useCallback(
    async (combatantId: number) => {
      if (activeEncounterId == null) return
      const target = combatants.find((c) => c.id === combatantId)
      if (!target) return

      await db.combatCombatants.update(combatantId, { hideHp: !target.hideHp })
      await refreshCombatants(activeEncounterId)
    },
    [activeEncounterId, combatants, refreshCombatants],
  )

  const toggleCondition = useCallback(
    async (combatantId: number, condition: string) => {
      if (activeEncounterId == null) return
      const target = combatants.find((c) => c.id === combatantId)
      if (!target) return

      const has = target.conditions.includes(condition)
      const conditions = has
        ? target.conditions.filter((c) => c !== condition)
        : [...target.conditions, condition]

      await db.combatCombatants.update(combatantId, { conditions })
      await appendLog(
        activeEncounterId,
        has
          ? `${target.name} no longer ${condition.toLowerCase()}.`
          : `${target.name} is ${condition.toLowerCase()}.`,
      )
      await refreshCombatants(activeEncounterId)
      await refreshLog(activeEncounterId)
    },
    [activeEncounterId, combatants, refreshCombatants, refreshLog],
  )

  const clearLog = useCallback(async () => {
    if (activeEncounterId == null) return
    await db.combatLog.where('encounterId').equals(activeEncounterId).delete()
    await refreshLog(activeEncounterId)
  }, [activeEncounterId, refreshLog])

  return {
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
  }
}
