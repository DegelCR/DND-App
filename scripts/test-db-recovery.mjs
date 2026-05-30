import 'fake-indexeddb/auto'
import Dexie from 'dexie'

const DB_NAME = 'DndAppDatabaseRecoveryTest'

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

function createCurrentDb() {
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
  return db
}

function isIncompatibleSchemaError(error) {
  const message = error instanceof Error ? error.message : String(error)
  return message.includes('primary key') || message.includes('Not yet support')
}

async function openWithRecovery(db: Dexie) {
  try {
    await db.open()
  } catch (error) {
    if (!isIncompatibleSchemaError(error)) throw error
    await Dexie.delete(DB_NAME)
    await db.open()
  }
}

await createOldV2Db()
const db = createCurrentDb()
try {
  await openWithRecovery(db)
  console.log('[OK] recovery open succeeded, version=', db.verno)
  console.log('tables=', db.tables.map((t) => t.name))
} catch (error) {
  console.log('[FAIL]', error instanceof Error ? error.message : error)
}
