/**
 * Subclases y trasfondos ampliados (nombres de referencia PHB + SRD).
 */
import type { SubclassOption } from "./types";

const subclassesByClass: Record<string, SubclassOption[]> = {
    barbarian: [
      { index: "berserker", name: "Berserker", source: "srd" },
      { index: "totem-warrior", name: "Totem Warrior", source: "phb" },
      { index: "zealot", name: "Zealot", source: "phb" },
      { index: "ancestral-guardian", name: "Ancestral Guardian", source: "phb" },
      { index: "storm-herald", name: "Storm Herald", source: "phb" },
      { index: "wild-magic", name: "Wild Magic", source: "phb" },
    ],
    bard: [
      { index: "lore", name: "College of Lore", source: "srd" },
      { index: "valor", name: "College of Valor", source: "phb" },
      { index: "glamour", name: "College of Glamour", source: "phb" },
      { index: "swords", name: "College of Swords", source: "phb" },
      { index: "whispers", name: "College of Whispers", source: "phb" },
      { index: "eloquence", name: "College of Eloquence", source: "phb" },
    ],
    cleric: [
      { index: "life", name: "Life Domain", source: "srd" },
      { index: "knowledge", name: "Knowledge Domain", source: "phb" },
      { index: "light", name: "Light Domain", source: "phb" },
      { index: "nature", name: "Nature Domain", source: "phb" },
      { index: "tempest", name: "Tempest Domain", source: "phb" },
      { index: "trickery", name: "Trickery Domain", source: "phb" },
      { index: "war", name: "War Domain", source: "phb" },
      { index: "forge", name: "Forge Domain", source: "phb" },
      { index: "grave", name: "Grave Domain", source: "phb" },
      { index: "order", name: "Order Domain", source: "phb" },
    ],
    druid: [
      { index: "land", name: "Circle of the Land", source: "srd" },
      { index: "moon", name: "Circle of the Moon", source: "phb" },
      { index: "dreams", name: "Circle of Dreams", source: "phb" },
      { index: "shepherd", name: "Circle of the Shepherd", source: "phb" },
      { index: "spores", name: "Circle of Spores", source: "phb" },
      { index: "stars", name: "Circle of Stars", source: "phb" },
    ],
    fighter: [
      { index: "champion", name: "Champion", source: "srd" },
      { index: "battle-master", name: "Battle Master", source: "phb" },
      { index: "eldritch-knight", name: "Eldritch Knight", source: "phb" },
      { index: "arcane-archer", name: "Arcane Archer", source: "phb" },
      { index: "cavalier", name: "Cavalier", source: "phb" },
      { index: "samurai", name: "Samurai", source: "phb" },
      { index: "psi-warrior", name: "Psi Warrior", source: "phb" },
      { index: "rune-knight", name: "Rune Knight", source: "phb" },
    ],
    monk: [
      { index: "open-hand", name: "Way of the Open Hand", source: "srd" },
      { index: "shadow", name: "Way of Shadow", source: "phb" },
      { index: "four-elements", name: "Way of the Four Elements", source: "phb" },
      { index: "drunken-master", name: "Way of the Drunken Master", source: "phb" },
      { index: "kensei", name: "Way of the Kensei", source: "phb" },
      { index: "mercy", name: "Way of Mercy", source: "phb" },
      { index: "astral-self", name: "Way of the Astral Self", source: "phb" },
    ],
    paladin: [
      { index: "devotion", name: "Oath of Devotion", source: "srd" },
      { index: "ancients", name: "Oath of the Ancients", source: "phb" },
      { index: "vengeance", name: "Oath of Vengeance", source: "phb" },
      { index: "conquest", name: "Oath of Conquest", source: "phb" },
      { index: "redemption", name: "Oath of Redemption", source: "phb" },
      { index: "glory", name: "Oath of Glory", source: "phb" },
      { index: "watchers", name: "Oath of the Watchers", source: "phb" },
    ],
    ranger: [
      { index: "hunter", name: "Hunter", source: "srd" },
      { index: "beast-master", name: "Beast Master", source: "phb" },
      { index: "gloom-stalker", name: "Gloom Stalker", source: "phb" },
      { index: "horizon-walker", name: "Horizon Walker", source: "phb" },
      { index: "monster-slayer", name: "Monster Slayer", source: "phb" },
      { index: "fey-wanderer", name: "Fey Wanderer", source: "phb" },
      { index: "swarmkeeper", name: "Swarmkeeper", source: "phb" },
    ],
    rogue: [
      { index: "thief", name: "Thief", source: "srd" },
      { index: "assassin", name: "Assassin", source: "phb" },
      { index: "arcane-trickster", name: "Arcane Trickster", source: "phb" },
      { index: "mastermind", name: "Mastermind", source: "phb" },
      { index: "swashbuckler", name: "Swashbuckler", source: "phb" },
      { index: "scout", name: "Scout", source: "phb" },
      { index: "phantom", name: "Phantom", source: "phb" },
      { index: "soulknife", name: "Soulknife", source: "phb" },
    ],
    sorcerer: [
      { index: "draconic", name: "Draconic Bloodline", source: "srd" },
      { index: "wild-magic", name: "Wild Magic", source: "phb" },
      { index: "divine-soul", name: "Divine Soul", source: "phb" },
      { index: "shadow-magic", name: "Shadow Magic", source: "phb" },
      { index: "storm-sorcery", name: "Storm Sorcery", source: "phb" },
      { index: "aberrant-mind", name: "Aberrant Mind", source: "phb" },
      { index: "clockwork-soul", name: "Clockwork Soul", source: "phb" },
    ],
    warlock: [
      { index: "fiend", name: "The Fiend", source: "srd" },
      { index: "archfey", name: "The Archfey", source: "phb" },
      { index: "great-old-one", name: "The Great Old One", source: "phb" },
      { index: "hexblade", name: "The Hexblade", source: "phb" },
      { index: "celestial", name: "The Celestial", source: "phb" },
      { index: "fathomless", name: "The Fathomless", source: "phb" },
      { index: "genie", name: "The Genie", source: "phb" },
    ],
    wizard: [
      { index: "evocation", name: "School of Evocation", source: "srd" },
      { index: "abjuration", name: "School of Abjuration", source: "phb" },
      { index: "conjuration", name: "School of Conjuration", source: "phb" },
      { index: "divination", name: "School of Divination", source: "phb" },
      { index: "enchantment", name: "School of Enchantment", source: "phb" },
      { index: "illusion", name: "School of Illusion", source: "phb" },
      { index: "necromancy", name: "School of Necromancy", source: "phb" },
      { index: "transmutation", name: "School of Transmutation", source: "phb" },
      { index: "war-magic", name: "War Magic", source: "phb" },
      { index: "bladesinging", name: "Bladesinging", source: "phb" },
    ],
  };

  const backgrounds = [
    { index: "acolyte", name: "Acolyte", feature: "Shelter of the Faithful", skills: ["Insight", "Religion"], source: "srd" },
    { index: "charlatan", name: "Charlatan", feature: "False Identity", skills: ["Deception", "Sleight of Hand"], source: "phb" },
    { index: "criminal", name: "Criminal", feature: "Criminal Contact", skills: ["Deception", "Stealth"], source: "phb" },
    { index: "entertainer", name: "Entertainer", feature: "By Popular Demand", skills: ["Acrobatics", "Performance"], source: "phb" },
    { index: "folk-hero", name: "Folk Hero", feature: "Rustic Hospitality", skills: ["Animal Handling", "Survival"], source: "phb" },
    { index: "guild-artisan", name: "Guild Artisan", feature: "Guild Membership", skills: ["Insight", "Persuasion"], source: "phb" },
    { index: "hermit", name: "Hermit", feature: "Discovery", skills: ["Medicine", "Religion"], source: "phb" },
    { index: "noble", name: "Noble", feature: "Position of Privilege", skills: ["History", "Persuasion"], source: "phb" },
    { index: "outlander", name: "Outlander", feature: "Wanderer", skills: ["Athletics", "Survival"], source: "phb" },
    { index: "sage", name: "Sage", feature: "Researcher", skills: ["Arcana", "History"], source: "phb" },
    { index: "sailor", name: "Sailor", feature: "Ship's Passage", skills: ["Athletics", "Perception"], source: "phb" },
    { index: "soldier", name: "Soldier", feature: "Military Rank", skills: ["Athletics", "Intimidation"], source: "phb" },
    { index: "urchin", name: "Urchin", feature: "City Secrets", skills: ["Sleight of Hand", "Stealth"], source: "phb" },
    { index: "anthropologist", name: "Anthropologist", feature: "Cultural Chameleon", skills: ["Insight", "Religion"], source: "phb" },
    { index: "archaeologist", name: "Archaeologist", feature: "Historical Knowledge", skills: ["History", "Survival"], source: "phb" },
    { index: "haunted-one", name: "Haunted One", feature: "Heart of Darkness", skills: ["Investigation", "Religion"], source: "phb" },
  ];

export function getSubclassesForClass(classIndex: string) {
  return subclassesByClass[classIndex] || [];
}

export function getBackground(index: string) {
  return backgrounds.find((b) => b.index === index) || null;
}

export function listBackgrounds() {
  return backgrounds.map((b) => ({ index: b.index, name: b.name, source: b.source }));
}

export function mergeSubclasses(
  apiSubs: { index: string; name: string }[] | undefined,
  classIndex: string
): SubclassOption[] {
  const extra = getSubclassesForClass(classIndex);
  const seen = new Set<string>();
  const merged: SubclassOption[] = [];

  for (const s of apiSubs || []) {
    if (!seen.has(s.index)) {
      seen.add(s.index);
      merged.push({ ...s, source: "srd" });
    }
  }
  for (const s of extra) {
    if (!seen.has(s.index)) {
      seen.add(s.index);
      merged.push(s);
    }
  }
  return merged;
}
