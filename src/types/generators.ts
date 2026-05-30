export type NameCategory = 'character' | 'npc' | 'place' | 'tavern'

export type LootTier = '1' | '2' | '3' | '4'

export interface GeneratedName {
  category: NameCategory
  name: string
}

export interface GeneratedLoot {
  tier: LootTier
  label: string
  lines: string[]
}

export interface GeneratedNpc {
  name: string
  role: string
  trait: string
  quirk: string
  line: string
}

export interface GeneratedEncounter {
  partyLevel: number
  difficulty: 'easy' | 'medium' | 'hard'
  monsters: { name: string; count: number; cr: number }[]
  summary: string
}
