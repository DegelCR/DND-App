export type CombatantType = 'pc' | 'monster' | 'npc'

export interface CombatEncounter {
  id?: number
  campaignId?: number
  name: string
  round: number
  activeIndex: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CombatCombatant {
  id?: number
  encounterId: number
  name: string
  type: CombatantType
  initiative: number | null
  initiativeBonus: number
  maxHp: number
  currentHp: number
  armorClass?: number
  isDefeated: boolean
  hideHp: boolean
  conditions: string[]
  monsterIndex?: string
  sortOrder: number
  createdAt: Date
}

export interface CombatLogEntry {
  id?: number
  encounterId: number
  message: string
  createdAt: Date
}

export interface PendingCombatMonster {
  monsterIndex: string
  name: string
  at: string
}
