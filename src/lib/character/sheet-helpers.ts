import type { Character, SpellRef } from "./types";

export function getSpellNamesFromCharacter(character: Character): SpellRef[] {
  const list = character.classSpellList || [];
  const sel = character.selectedSpells || { cantrips: [], known: [], prepared: [] };
  const allIdx = [...sel.cantrips, ...sel.known, ...sel.prepared];
  const unique = [...new Set(allIdx)];
  return unique
    .map((idx) => list.find((s) => s.index === idx))
    .filter((s): s is SpellRef => Boolean(s))
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
}
