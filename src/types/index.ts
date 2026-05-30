export interface Campaign {
  id?: number
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id?: number
  campaignId: number
  number: number
  title: string
  date: string
  notes: string
  recap?: string
  strongStart?: string
  prepChecklist?: import('@/types/session').PrepChecklist
  createdAt: Date
  updatedAt: Date
}

export interface DiceRollRecord {
  id?: number
  expression: string
  result: number
  rolls: number[]
  modifier: number
  label?: string
  mode?: 'normal' | 'advantage' | 'disadvantage'
  isCritical?: boolean
  isFumble?: boolean
  d20Rolls?: [number, number]
  createdAt: Date
}

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

export type {
  CombatantType,
  CombatCombatant,
  CombatLogEntry,
  PendingCombatMonster,
} from '@/types/combat'

export type {
  CampaignSecret,
  PrepChecklist,
  SessionQuickNote,
  SessionTab,
} from '@/types/session'

export interface AppSettings {
  id?: number
  key: string
  value: string
}

export type ModuleStatus = 'ready' | 'planned' | 'wip'

export interface NavModule {
  id: string
  path: string
  label: string
  description: string
  icon: string
  status: ModuleStatus
  phase: number
}
