import type { AbilityKey, Character } from "./types";
import { computeFinalScores, abilityModifier } from "./character";

const SPELLCASTING_ABILITY: Partial<Record<string, AbilityKey>> = {
  bard: "cha",
  cleric: "wis",
  druid: "wis",
  paladin: "cha",
  ranger: "wis",
  sorcerer: "cha",
  warlock: "cha",
  wizard: "int",
};

const FULL_CASTERS = ["bard", "cleric", "druid", "sorcerer", "wizard"];
const HALF_CASTERS = ["paladin", "ranger"];
const PACT_CASTERS = ["warlock"];
const KNOWN_CASTERS = ["bard", "sorcerer", "warlock", "ranger"];

export function isSpellcaster(classIndex?: string | null) {
  if (!classIndex) return false;
  return (
    FULL_CASTERS.includes(classIndex) ||
    HALF_CASTERS.includes(classIndex) ||
    PACT_CASTERS.includes(classIndex)
  );
}

export function usesSpellsKnown(classIndex: string) {
  return KNOWN_CASTERS.includes(classIndex) || PACT_CASTERS.includes(classIndex);
}

export function usesPreparedSpells(classIndex: string) {
  return ["cleric", "druid", "wizard"].includes(classIndex);
}

export function getSpellAbility(classIndex: string): AbilityKey | null {
  return SPELLCASTING_ABILITY[classIndex] ?? null;
}

export function maxSpellLevelFromSlots(spellcasting?: Record<string, number>) {
  if (!spellcasting) return 0;
  for (let lvl = 9; lvl >= 1; lvl--) {
    const slots = spellcasting[`spell_slots_level_${lvl}`];
    if (slots && slots > 0) return lvl;
  }
  return 0;
}

export function getSlotSummary(spellcasting?: Record<string, number>) {
  if (!spellcasting) return [];
  const rows: { level: number; slots: number }[] = [];
  for (let lvl = 1; lvl <= 9; lvl++) {
    const n = spellcasting[`spell_slots_level_${lvl}`];
    if (n > 0) rows.push({ level: lvl, slots: n });
  }
  return rows;
}

export function getPreparedLimit(character: Character, abilityKey: AbilityKey) {
  const level = character.level || 1;
  const scores = computeFinalScores(character);
  const mod = abilityModifier(scores[abilityKey] ?? 10);
  return Math.max(1, level + mod);
}
