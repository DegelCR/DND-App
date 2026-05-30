import type { Character } from '@/lib/character/types'

export interface CharacterRecord {
  id?: number
  name: string
  playerName: string
  level: number
  className: string
  raceName: string
  data: Character
  updatedAt: Date
}

export function toCharacterRecord(data: Character): Omit<CharacterRecord, 'id'> {
  return {
    name: data.name.trim() || 'Unnamed',
    playerName: data.playerName,
    level: data.level,
    className: data.class?.name ?? '',
    raceName: data.race?.name ?? '',
    data,
    updatedAt: new Date(),
  }
}
