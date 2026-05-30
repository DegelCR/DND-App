export interface PrepChecklist {
  reviewCharacters: boolean
  strongStart: boolean
  sceneOutline: boolean
  reviewSecrets: boolean
  locations: boolean
  keyNpcs: boolean
  monsters: boolean
  rewards: boolean
}

export const DEFAULT_PREP_CHECKLIST: PrepChecklist = {
  reviewCharacters: false,
  strongStart: false,
  sceneOutline: false,
  reviewSecrets: false,
  locations: false,
  keyNpcs: false,
  monsters: false,
  rewards: false,
}

export const PREP_CHECKLIST_ITEMS: {
  key: keyof PrepChecklist
  label: string
}[] = [
  { key: 'reviewCharacters', label: 'Review character sheets & goals' },
  { key: 'strongStart', label: 'Prepare a strong start' },
  { key: 'sceneOutline', label: 'Outline possible scenes' },
  { key: 'reviewSecrets', label: 'Review secrets & clues pool' },
  { key: 'locations', label: 'Sketch key locations' },
  { key: 'keyNpcs', label: 'Outline important NPCs' },
  { key: 'monsters', label: 'Choose relevant monsters' },
  { key: 'rewards', label: 'Select magic rewards / loot' },
]

export interface CampaignSecret {
  id?: number
  campaignId: number
  slot: number
  text: string
  revealed: boolean
}

export interface SessionQuickNote {
  id?: number
  sessionId: number
  text: string
  createdAt: Date
}

export type SessionTab = 'notes' | 'recap' | 'prep' | 'quick'

export const SECRET_SLOT_COUNT = 10

export function emptySecrets(campaignId: number): CampaignSecret[] {
  return Array.from({ length: SECRET_SLOT_COUNT }, (_, i) => ({
    campaignId,
    slot: i + 1,
    text: '',
    revealed: false,
  }))
}

export function normalizePrepChecklist(
  value?: PrepChecklist | string,
): PrepChecklist {
  if (!value) return { ...DEFAULT_PREP_CHECKLIST }
  if (typeof value === 'string') {
    try {
      return { ...DEFAULT_PREP_CHECKLIST, ...JSON.parse(value) }
    } catch {
      return { ...DEFAULT_PREP_CHECKLIST }
    }
  }
  return { ...DEFAULT_PREP_CHECKLIST, ...value }
}
