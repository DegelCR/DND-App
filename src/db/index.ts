import Dexie, { type EntityTable } from 'dexie'
import type {
  AppSettings,
  Campaign,
  CombatEncounter,
  DiceRollRecord,
  Session,
} from '@/types'
import type {
  CombatCombatant,
  CombatLogEntry,
} from '@/types/combat'
import type {
  CampaignSecret,
  SessionQuickNote,
} from '@/types/session'
import type { CharacterRecord } from '@/types/character'
import type { BattleMapRecord } from '@/types/map'
import type {
  CompendiumDetail,
  CompendiumSummary,
} from '@/types/compendium'
import type {
  MonsterDetail,
  MonsterFavorite,
  MonsterRecent,
  MonsterSummary,
} from '@/types/monster'

class DndDatabase extends Dexie {
  campaigns!: EntityTable<Campaign, 'id'>
  sessions!: EntityTable<Session, 'id'>
  diceRolls!: EntityTable<DiceRollRecord, 'id'>
  combatEncounters!: EntityTable<CombatEncounter, 'id'>
  combatCombatants!: EntityTable<CombatCombatant, 'id'>
  combatLog!: EntityTable<CombatLogEntry, 'id'>
  settings!: EntityTable<AppSettings, 'id'>
  monsterSummaries!: EntityTable<MonsterSummary, 'index'>
  monsterDetails!: EntityTable<MonsterDetail, 'index'>
  monsterFavorites!: EntityTable<MonsterFavorite, 'id'>
  monsterRecents!: EntityTable<MonsterRecent, 'id'>
  campaignSecrets!: EntityTable<CampaignSecret, 'id'>
  sessionQuickNotes!: EntityTable<SessionQuickNote, 'id'>
  compendiumSummaries!: EntityTable<CompendiumSummary, 'id'>
  compendiumDetails!: EntityTable<CompendiumDetail, 'id'>
  characters!: EntityTable<CharacterRecord, 'id'>
  battleMaps!: EntityTable<BattleMapRecord, 'id'>

  constructor() {
    super('DndAppDatabase')

    this.version(1).stores({
      campaigns: '++id, name, updatedAt',
      sessions: '++id, campaignId, number, updatedAt',
      diceRolls: '++id, createdAt',
      combatEncounters: '++id, campaignId, isActive, updatedAt',
      settings: '++id, &key',
    })

    this.version(2).stores({
      campaigns: '++id, name, updatedAt',
      sessions: '++id, campaignId, number, updatedAt',
      diceRolls: '++id, createdAt',
      combatEncounters: '++id, campaignId, isActive, updatedAt',
      settings: '++id, &key',
      monsterSummaries: '&index, name, challengeRating, type, source',
      monsterDetails: '&index, cachedAt, source',
      monsterFavorites: '++id, &monsterIndex, source, addedAt',
      monsterRecents: '++id, monsterIndex, viewedAt',
    })

    this.version(3).stores({
      campaigns: '++id, name, updatedAt',
      sessions: '++id, campaignId, number, updatedAt',
      diceRolls: '++id, createdAt',
      combatEncounters: '++id, campaignId, isActive, updatedAt',
      combatCombatants: '++id, encounterId, initiative',
      combatLog: '++id, encounterId, createdAt',
      settings: '++id, &key',
      monsterSummaries: '&index, name, challengeRating, type, source',
      monsterDetails: '&index, cachedAt, source',
      monsterFavorites: '++id, &monsterIndex, source, addedAt',
      monsterRecents: '++id, monsterIndex, viewedAt',
    })

    this.version(4).stores({
      campaigns: '++id, name, updatedAt',
      sessions: '++id, campaignId, number, updatedAt',
      diceRolls: '++id, createdAt',
      combatEncounters: '++id, campaignId, isActive, updatedAt',
      combatCombatants: '++id, encounterId, initiative',
      combatLog: '++id, encounterId, createdAt',
      settings: '++id, &key',
      monsterSummaries: '&index, name, challengeRating, type, source',
      monsterDetails: '&index, cachedAt, source',
      monsterFavorites: '++id, &monsterIndex, source, addedAt',
      monsterRecents: '++id, monsterIndex, viewedAt',
      campaignSecrets: '++id, campaignId, slot',
      sessionQuickNotes: '++id, sessionId, createdAt',
    })

    this.version(5).stores({
      campaigns: '++id, name, updatedAt',
      sessions: '++id, campaignId, number, updatedAt',
      diceRolls: '++id, createdAt',
      combatEncounters: '++id, campaignId, isActive, updatedAt',
      combatCombatants: '++id, encounterId, initiative',
      combatLog: '++id, encounterId, createdAt',
      settings: '++id, &key',
      monsterSummaries: '&index, name, challengeRating, type, source',
      monsterDetails: '&index, cachedAt, source',
      monsterFavorites: '++id, &monsterIndex, source, addedAt',
      monsterRecents: '++id, monsterIndex, viewedAt',
      campaignSecrets: '++id, campaignId, slot',
      sessionQuickNotes: '++id, sessionId, createdAt',
      compendiumSummaries: '&id, category, index, name, level, source',
      compendiumDetails: '&id, category, index, cachedAt, source',
    })

    this.version(6).stores({
      campaigns: '++id, name, updatedAt',
      sessions: '++id, campaignId, number, updatedAt',
      diceRolls: '++id, createdAt',
      combatEncounters: '++id, campaignId, isActive, updatedAt',
      combatCombatants: '++id, encounterId, initiative',
      combatLog: '++id, encounterId, createdAt',
      settings: '++id, &key',
      monsterSummaries: '&index, name, challengeRating, type, source',
      monsterDetails: '&index, cachedAt, source',
      monsterFavorites: '++id, &monsterIndex, source, addedAt',
      monsterRecents: '++id, monsterIndex, viewedAt',
      campaignSecrets: '++id, campaignId, slot',
      sessionQuickNotes: '++id, sessionId, createdAt',
      compendiumSummaries: '&id, category, index, name, level, source',
      compendiumDetails: '&id, category, index, cachedAt, source',
      characters: '++id, name, level, className, raceName, updatedAt',
    })

    this.version(7).stores({
      campaigns: '++id, name, updatedAt',
      sessions: '++id, campaignId, number, updatedAt',
      diceRolls: '++id, createdAt',
      combatEncounters: '++id, campaignId, isActive, updatedAt',
      combatCombatants: '++id, encounterId, initiative',
      combatLog: '++id, encounterId, createdAt',
      settings: '++id, &key',
      monsterSummaries: '&index, name, challengeRating, type, source',
      monsterDetails: '&index, cachedAt, source',
      monsterFavorites: '++id, &monsterIndex, source, addedAt',
      monsterRecents: '++id, monsterIndex, viewedAt',
      campaignSecrets: '++id, campaignId, slot',
      sessionQuickNotes: '++id, sessionId, createdAt',
      compendiumSummaries: '&id, category, index, name, level, source',
      compendiumDetails: '&id, category, index, cachedAt, source',
      characters: '++id, name, level, className, raceName, updatedAt',
      battleMaps: '++id, name, updatedAt',
    })
  }
}

export const db = new DndDatabase()

let initPromise: Promise<void> | null = null

async function performInit(): Promise<void> {
  await db.open()

  const existing = await db.settings.get({ key: 'app_initialized' })
  if (existing) return

  try {
    await db.settings.add({
      key: 'app_initialized',
      value: new Date().toISOString(),
    })
  } catch (error) {
    // React StrictMode runs effects twice in dev; parallel inits can race on add.
    if (error instanceof Dexie.ConstraintError) return
    throw error
  }
}

export async function initDatabase(): Promise<void> {
  if (!initPromise) {
    initPromise = performInit().catch((error) => {
      initPromise = null
      throw error
    })
  }
  return initPromise
}
