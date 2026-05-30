/** SRD today; homebrew/import planned for a future phase */
export type ContentSource = 'srd' | 'homebrew'

export interface MonsterListItem {
  index: string
  name: string
  url: string
}

export interface MonsterSummary {
  index: string
  name: string
  challengeRating: number
  type: string
  size: string
  source: ContentSource
}

export interface MonsterTrait {
  name: string
  desc: string
}

export interface MonsterDetail extends MonsterSummary {
  alignment: string
  armorClass: number
  hitPoints: number
  hitDice: string
  speed: string
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  proficiencies: string[]
  senses: string
  languages: string
  xp: number
  specialAbilities: MonsterTrait[]
  actions: MonsterTrait[]
  legendaryActions: MonsterTrait[]
  cachedAt: Date
}

export interface MonsterFavorite {
  id?: number
  monsterIndex: string
  source: ContentSource
  addedAt: Date
}

export interface MonsterRecent {
  id?: number
  monsterIndex: string
  source: ContentSource
  viewedAt: Date
}
