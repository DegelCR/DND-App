import 'fake-indexeddb/auto'
import Dexie from 'dexie'

const DB_NAME = 'DndAppDatabaseTest'

async function createOldV2Db() {
  await Dexie.delete(DB_NAME)
  const db = new Dexie(DB_NAME)
  db.version(1).stores({
    campaigns: '++id, name, updatedAt',
    sessions: '++id, campaignId, number, updatedAt',
    diceRolls: '++id, createdAt',
    combatEncounters: '++id, campaignId, isActive, updatedAt',
    settings: '++id, &key',
  })
  db.version(2).stores({
    campaigns: '++id, name, updatedAt',
    sessions: '++id, campaignId, number, updatedAt',
    diceRolls: '++id, createdAt',
    combatEncounters: '++id, campaignId, isActive, updatedAt',
    settings: '++id, &key',
    monsterIndex: '&index, name, challengeRating',
    monsters: '&index, name, challengeRating',
    monsterFavorites: '&index, addedAt',
    monsterRecents: '&index, viewedAt',
  })
  await db.open()
  await db.close()
}

async function openCurrentSchema() {
  const db = new Dexie(DB_NAME)
  db.version(1).stores({
    campaigns: '++id, name, updatedAt',
    sessions: '++id, campaignId, number, updatedAt',
    diceRolls: '++id, createdAt',
    combatEncounters: '++id, campaignId, isActive, updatedAt',
    settings: '++id, &key',
  })
  db.version(2).stores({
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
  db.version(3).stores({
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
  await db.open()
  await db.close()
}

async function scenario(name, setup, open) {
  try {
    await setup()
    await open()
    console.log(`[OK] ${name}`)
  } catch (error) {
    console.log(`[FAIL] ${name}: ${error instanceof Error ? error.message : error}`)
  }
}

await scenario('old v2 -> current v3', createOldV2Db, openCurrentSchema)

// Intermediate: v2 with &monsterIndex PK on favorites (hypothesis)
async function createIntermediateV2Db() {
  await Dexie.delete(DB_NAME)
  const db = new Dexie(DB_NAME)
  db.version(1).stores({
    campaigns: '++id, name, updatedAt',
    sessions: '++id, campaignId, number, updatedAt',
    diceRolls: '++id, createdAt',
    combatEncounters: '++id, campaignId, isActive, updatedAt',
    settings: '++id, &key',
  })
  db.version(2).stores({
    campaigns: '++id, name, updatedAt',
    sessions: '++id, campaignId, number, updatedAt',
    diceRolls: '++id, createdAt',
    combatEncounters: '++id, campaignId, isActive, updatedAt',
    settings: '++id, &key',
    monsterSummaries: '&index, name, challengeRating, type, source',
    monsterDetails: '&index, cachedAt, source',
    monsterFavorites: '&monsterIndex, source, addedAt',
    monsterRecents: '&monsterIndex, viewedAt',
  })
  await db.open()
  await db.close()
}

await scenario('intermediate v2 (&monsterIndex PK) -> current v3', createIntermediateV2Db, openCurrentSchema)

// v2 with ++id favorites then v3 changes to &monsterIndex (reverse)
async function openBadV3Migration() {
  const db = new Dexie(DB_NAME)
  db.version(1).stores({
    campaigns: '++id, name, updatedAt',
    sessions: '++id, campaignId, number, updatedAt',
    diceRolls: '++id, createdAt',
    combatEncounters: '++id, campaignId, isActive, updatedAt',
    settings: '++id, &key',
  })
  db.version(2).stores({
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
  db.version(3).stores({
    campaigns: '++id, name, updatedAt',
    sessions: '++id, campaignId, number, updatedAt',
    diceRolls: '++id, createdAt',
    combatEncounters: '++id, campaignId, isActive, updatedAt',
    combatCombatants: '++id, encounterId, initiative',
    combatLog: '++id, encounterId, createdAt',
    settings: '++id, &key',
    monsterSummaries: '&index, name, challengeRating, type, source',
    monsterDetails: '&index, cachedAt, source',
    monsterFavorites: '&monsterIndex, source, addedAt',
    monsterRecents: '&monsterIndex, viewedAt',
  })
  await db.open()
  await db.close()
}

async function createCurrentV2Db() {
  await Dexie.delete(DB_NAME)
  const db = new Dexie(DB_NAME)
  db.version(1).stores({
    campaigns: '++id, name, updatedAt',
    sessions: '++id, campaignId, number, updatedAt',
    diceRolls: '++id, createdAt',
    combatEncounters: '++id, campaignId, isActive, updatedAt',
    settings: '++id, &key',
  })
  db.version(2).stores({
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
  await db.open()
  await db.close()
}

await scenario('current v2 -> bad v3 (PK change)', createCurrentV2Db, openBadV3Migration)

async function openCurrentV2Only() {
  const db = new Dexie(DB_NAME)
  db.version(1).stores({
    campaigns: '++id, name, updatedAt',
    sessions: '++id, campaignId, number, updatedAt',
    diceRolls: '++id, createdAt',
    combatEncounters: '++id, campaignId, isActive, updatedAt',
    settings: '++id, &key',
  })
  db.version(2).stores({
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
  await db.open()
  await db.close()
}

await scenario('old v2 -> current v2 only (no v3)', createOldV2Db, openCurrentV2Only)

async function openCurrentV2ThenV3() {
  await openCurrentV2Only()
  await openCurrentSchema()
}

await scenario('fresh current v2 -> current v3', createCurrentV2Db, openCurrentSchema)

async function openV4MigrationSchema() {
  const db = new Dexie(DB_NAME)
  db.version(1).stores({
    campaigns: '++id, name, updatedAt',
    sessions: '++id, campaignId, number, updatedAt',
    diceRolls: '++id, createdAt',
    combatEncounters: '++id, campaignId, isActive, updatedAt',
    settings: '++id, &key',
  })
  db.version(2).stores({
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
  db.version(3).stores({
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
  db.version(4).stores({
    campaigns: '++id, name, updatedAt',
    sessions: '++id, campaignId, number, updatedAt',
    diceRolls: '++id, createdAt',
    combatEncounters: '++id, campaignId, isActive, updatedAt',
    combatCombatants: '++id, encounterId, initiative',
    combatLog: '++id, encounterId, createdAt',
    settings: '++id, &key',
    monsterSummaries: '&index, name, challengeRating, type, source',
    monsterDetails: '&index, cachedAt, source',
    monsterIndex: null,
    monsters: null,
    monsterFavorites: null,
    monsterRecents: null,
  })
  db.version(5).stores({
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
  await db.open()
  await db.close()
}

await scenario('old v2 -> v5 drop/recreate migration', createOldV2Db, openV4MigrationSchema)
