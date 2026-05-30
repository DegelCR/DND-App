import type { Character } from './types'
import { ABILITIES } from './constants'
import { extractSkillsFromProficiencyChoice } from './api'
import { getBackground } from './extra-data'
import {
  isSpellcaster,
  usesSpellsKnown,
  usesPreparedSpells,
  getSpellAbility,
  getPreparedLimit,
  maxSpellLevelFromSlots,
} from './class-rules'

export function buildProficiencyChoices(classData?: Record<string, unknown>) {
  const choices =
    (classData?.proficiency_choices as {
      desc: string
      choose: number
      from?: unknown
    }[]) || []
  return choices.map((choice, i) => ({
    id: `class-choice-${i}`,
    desc: choice.desc,
    choose: choice.choose,
    options: extractSkillsFromProficiencyChoice(
      choice as Parameters<typeof extractSkillsFromProficiencyChoice>[0],
    ),
  }))
}

export function validateProficiencies(character: Character) {
  const choices = buildProficiencyChoices(character.class?.raw)
  for (const group of choices) {
    const selected = character.skillChoices?.[group.id] || []
    if (selected.length !== group.choose) {
      return {
        ok: false as const,
        message: `Choose exactly ${group.choose} class skill(s).`,
      }
    }
  }
  return { ok: true as const }
}

export function validateSpells(character: Character) {
  const classIndex = character.class?.index
  if (!classIndex || !isSpellcaster(classIndex)) return { ok: true as const }

  const spellcasting = character._levelCache?.data?.spellcasting
  const cantripMax = spellcasting?.cantrips_known || 0
  const knownMax = spellcasting?.spells_known || 0
  const maxSpellLevel = maxSpellLevelFromSlots(spellcasting)

  if (maxSpellLevel === 0 && !cantripMax) return { ok: true as const }

  const sel = character.selectedSpells
  if (cantripMax && sel.cantrips.length !== cantripMax) {
    return { ok: false, message: `Choose exactly ${cantripMax} cantrip(s).` }
  }
  if (usesSpellsKnown(classIndex) && knownMax && sel.known.length !== knownMax) {
    return { ok: false, message: `Choose exactly ${knownMax} known spell(s).` }
  }
  if (usesPreparedSpells(classIndex)) {
    const abilityKey = getSpellAbility(classIndex)
    const preparedMax = abilityKey ? getPreparedLimit(character, abilityKey) : 0
    if (preparedMax && sel.prepared.length < 1) {
      return { ok: false, message: 'Prepare at least 1 spell.' }
    }
    if (preparedMax && sel.prepared.length > preparedMax) {
      return { ok: false, message: `You can prepare at most ${preparedMax} spells.` }
    }
  }
  return { ok: true as const }
}

export function validateStep(
  character: Character,
  step: number,
): { ok: boolean; message?: string } {
  switch (step) {
    case 1:
      if (!character.name.trim()) return { ok: false, message: 'Enter a character name.' }
      return { ok: true }
    case 2:
      if (!character.race) return { ok: false, message: 'Choose a race.' }
      return { ok: true }
    case 3:
      if (!character.class) return { ok: false, message: 'Choose a class.' }
      if (character.class.subclasses?.length && !character.subclass) {
        return { ok: false, message: 'Choose a subclass.' }
      }
      return { ok: true }
    case 4:
      if (!character.background) return { ok: false, message: 'Choose a background.' }
      return { ok: true }
    case 5: {
      const invalid = ABILITIES.find(({ key }) => {
        const v = character.abilityScores[key]
        return v < 3 || v > 20
      })
      if (invalid) return { ok: false, message: 'Each ability score must be between 3 and 20.' }
      return { ok: true }
    }
    case 6:
      return validateProficiencies(character)
    case 7:
      return validateSpells(character)
    default:
      return { ok: true }
  }
}

export function syncSkillProficiencies(
  character: Character,
  choices: ReturnType<typeof buildProficiencyChoices>,
  fixedClass: { name: string }[],
  fixedBg: string[],
) {
  const names = new Set<string>()
  fixedClass.forEach((s) => names.add(s.name))
  fixedBg.forEach((n) => names.add(n))
  choices.forEach((group) => {
    ;(character.skillChoices[group.id] || []).forEach((idx) => {
      const skill = group.options.find((o) => o.index === idx)
      if (skill) names.add(skill.name)
    })
  })
  character.skillProficiencies = [...names]
}

export function getFixedBackgroundSkills(character: Character) {
  if (character.background?.skills?.length) return character.background.skills
  const local = character.background ? getBackground(character.background.index) : null
  return local?.skills || []
}
