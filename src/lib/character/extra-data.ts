/**
 * Subclases y trasfondos ampliados (nombres de referencia PHB + SRD).
 */
import type { SubclassOption, SubraceOption } from "./types";

export interface LocalSubraceDefinition extends SubraceOption {
  desc?: string;
  ability_bonuses?: { ability_score: { index: string }; bonus: number }[];
  /** Use only subrace bonuses (e.g. Feral Tiefling replaces base ASI). */
  replaceBaseRaceBonuses?: boolean;
  /** SRD trait indices (fetched from API when rendering) */
  traitIndices?: string[];
  /** PHB-only trait blurbs when not in the SRD API */
  localTraits?: { name: string; desc: string }[];
}

const subracesByRace: Record<string, SubraceOption[]> = {
  dwarf: [
    { index: "hill-dwarf", name: "Hill Dwarf", source: "srd" },
    { index: "mountain-dwarf", name: "Mountain Dwarf", source: "phb" },
  ],
  elf: [
    { index: "high-elf", name: "High Elf", source: "srd" },
    { index: "wood-elf", name: "Wood Elf", source: "phb" },
    { index: "drow", name: "Drow", source: "phb" },
  ],
  halfling: [
    { index: "lightfoot-halfling", name: "Lightfoot Halfling", source: "srd" },
    { index: "stout-halfling", name: "Stout Halfling", source: "phb" },
  ],
  gnome: [
    { index: "rock-gnome", name: "Rock Gnome", source: "srd" },
    { index: "forest-gnome", name: "Forest Gnome", source: "phb" },
  ],
  dragonborn: [
    { index: "dragonborn-black", name: "Black Dragon", source: "phb" },
    { index: "dragonborn-blue", name: "Blue Dragon", source: "phb" },
    { index: "dragonborn-brass", name: "Brass Dragon", source: "phb" },
    { index: "dragonborn-bronze", name: "Bronze Dragon", source: "phb" },
    { index: "dragonborn-copper", name: "Copper Dragon", source: "phb" },
    { index: "dragonborn-gold", name: "Gold Dragon", source: "phb" },
    { index: "dragonborn-green", name: "Green Dragon", source: "phb" },
    { index: "dragonborn-red", name: "Red Dragon", source: "phb" },
    { index: "dragonborn-silver", name: "Silver Dragon", source: "phb" },
    { index: "dragonborn-white", name: "White Dragon", source: "phb" },
  ],
  human: [
    { index: "standard-human", name: "Standard Human", source: "phb" },
    { index: "variant-human", name: "Variant Human", source: "phb" },
  ],
  "half-elf": [
    { index: "half-elf-skills", name: "Skill Versatility", source: "srd" },
    { index: "half-elf-elf-weapons", name: "Elf Weapon Training", source: "phb" },
    { index: "half-elf-cantrip", name: "Wizard Cantrip", source: "phb" },
    { index: "half-elf-fleet-of-foot", name: "Fleet of Foot", source: "phb" },
    { index: "half-elf-mask-of-the-wild", name: "Mask of the Wild", source: "phb" },
    { index: "half-elf-drow-magic", name: "Drow Magic", source: "phb" },
  ],
  tiefling: [
    { index: "bloodline-of-asmodeus", name: "Bloodline of Asmodeus", source: "phb" },
    { index: "bloodline-of-baalzebul", name: "Bloodline of Baalzebul", source: "mtof" },
    { index: "bloodline-of-dispater", name: "Bloodline of Dispater", source: "mtof" },
    { index: "bloodline-of-fierna", name: "Bloodline of Fierna", source: "mtof" },
    { index: "bloodline-of-glasya", name: "Bloodline of Glasya", source: "mtof" },
    { index: "bloodline-of-levistus", name: "Bloodline of Levistus", source: "mtof" },
    { index: "bloodline-of-mammon", name: "Bloodline of Mammon", source: "mtof" },
    { index: "bloodline-of-mephistopheles", name: "Bloodline of Mephistopheles", source: "mtof" },
    { index: "bloodline-of-zariel", name: "Bloodline of Zariel", source: "mtof" },
    { index: "feral-tiefling", name: "Feral Tiefling", source: "scag" },
    { index: "devils-tongue-tiefling", name: "Devil's Tongue", source: "scag" },
    { index: "hellfire-tiefling", name: "Hellfire", source: "scag" },
    { index: "winged-tiefling", name: "Winged", source: "scag" },
    { index: "abyssal-tiefling", name: "Abyssal Tiefling", source: "ua" },
  ],
};

function dragonbornAncestry(
  color: string,
  damage: string,
  breath: string,
): LocalSubraceDefinition {
  const key = color.toLowerCase();
  return {
    index: `dragonborn-${key}`,
    name: `${color} Dragon`,
    source: "phb",
    desc: `Your draconic ancestry is ${color.toLowerCase()}.`,
    localTraits: [
      {
        name: "Damage Resistance",
        desc: `Resistance to ${damage.toLowerCase()} damage.`,
      },
      { name: "Breath Weapon", desc: breath },
    ],
  };
}

function tieflingBloodline(
  index: string,
  name: string,
  ability: string,
  legacyName: string,
  cantrip: string,
  thirdLevel: string,
  fifthLevel: string,
  desc: string,
  source: "phb" | "mtof",
): LocalSubraceDefinition {
  return {
    index,
    name,
    source,
    desc,
    ability_bonuses: [{ ability_score: { index: ability }, bonus: 1 }],
    localTraits: [
      {
        name: legacyName,
        desc: `${cantrip} cantrip; ${thirdLevel} at 3rd level; ${fifthLevel} at 5th level (Charisma, once per long rest each).`,
      },
    ],
  };
}

/** Full data for PHB subraces not served by the SRD API */
const localSubraceData: Record<string, LocalSubraceDefinition> = {
  "mountain-dwarf": {
    index: "mountain-dwarf",
    name: "Mountain Dwarf",
    source: "phb",
    desc: "As a mountain dwarf, you are strong and hardy, accustomed to a difficult life in rugged terrain.",
    ability_bonuses: [{ ability_score: { index: "str" }, bonus: 2 }],
    localTraits: [
      {
        name: "Dwarven Armor Training",
        desc: "Proficiency with light and medium armor.",
      },
    ],
  },
  "wood-elf": {
    index: "wood-elf",
    name: "Wood Elf",
    source: "phb",
    desc: "As a wood elf, you have keen senses and intuition, and your fleet feet carry you quickly through wild lands.",
    ability_bonuses: [{ ability_score: { index: "wis" }, bonus: 1 }],
    traitIndices: ["elf-weapon-training"],
    localTraits: [
      {
        name: "Fleet of Foot",
        desc: "Your base walking speed increases to 35 feet.",
      },
      {
        name: "Mask of the Wild",
        desc: "You can attempt to hide when lightly obscured by natural phenomena.",
      },
    ],
  },
  drow: {
    index: "drow",
    name: "Drow",
    source: "phb",
    desc: "As a drow, you are infused with the magic of the Underdark, an elite portion of a subterranean society.",
    ability_bonuses: [{ ability_score: { index: "cha" }, bonus: 1 }],
    localTraits: [
      {
        name: "Superior Darkvision",
        desc: "Your darkvision has a radius of 120 feet.",
      },
      {
        name: "Sunlight Sensitivity",
        desc: "Disadvantage on attack rolls and Perception when you or your target are in direct sunlight.",
      },
      {
        name: "Drow Magic",
        desc: "You know the dancing lights cantrip; at 3rd level faerie fire, at 5th level darkness (Charisma).",
      },
      {
        name: "Drow Weapon Training",
        desc: "Proficiency with rapiers, shortswords, and hand crossbows.",
      },
    ],
  },
  "stout-halfling": {
    index: "stout-halfling",
    name: "Stout Halfling",
    source: "phb",
    desc: "As a stout halfling, you are hardier than average and have some resistance to poison.",
    ability_bonuses: [{ ability_score: { index: "con" }, bonus: 1 }],
    localTraits: [
      {
        name: "Stout Resilience",
        desc: "Advantage on saving throws against poison, and resistance to poison damage.",
      },
    ],
  },
  "forest-gnome": {
    index: "forest-gnome",
    name: "Forest Gnome",
    source: "phb",
    desc: "As a forest gnome, you have a knack for illusion and an affinity for small woodland creatures.",
    ability_bonuses: [{ ability_score: { index: "dex" }, bonus: 1 }],
    localTraits: [
      {
        name: "Natural Illusionist",
        desc: "You know the minor illusion cantrip (Intelligence).",
      },
      {
        name: "Speak with Small Beasts",
        desc: "Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.",
      },
    ],
  },
  "dragonborn-black": dragonbornAncestry(
    "Black",
    "Acid",
    "5 by 30 ft. line (Dexterity save).",
  ),
  "dragonborn-blue": dragonbornAncestry(
    "Blue",
    "Lightning",
    "5 by 30 ft. line (Dexterity save).",
  ),
  "dragonborn-brass": dragonbornAncestry(
    "Brass",
    "Fire",
    "5 by 30 ft. line (Dexterity save).",
  ),
  "dragonborn-bronze": dragonbornAncestry(
    "Bronze",
    "Lightning",
    "5 by 30 ft. line (Dexterity save).",
  ),
  "dragonborn-copper": dragonbornAncestry(
    "Copper",
    "Acid",
    "5 by 30 ft. line (Dexterity save).",
  ),
  "dragonborn-gold": dragonbornAncestry(
    "Gold",
    "Fire",
    "15 ft. cone (Dexterity save).",
  ),
  "dragonborn-green": dragonbornAncestry(
    "Green",
    "Poison",
    "15 ft. cone (Constitution save).",
  ),
  "dragonborn-red": dragonbornAncestry(
    "Red",
    "Fire",
    "15 ft. cone (Dexterity save).",
  ),
  "dragonborn-silver": dragonbornAncestry(
    "Silver",
    "Cold",
    "15 ft. cone (Constitution save).",
  ),
  "dragonborn-white": dragonbornAncestry(
    "White",
    "Cold",
    "15 ft. cone (Constitution save).",
  ),
  "standard-human": {
    index: "standard-human",
    name: "Standard Human",
    source: "phb",
    desc: "Your ability scores each increase by 1.",
    localTraits: [
      {
        name: "Ability Score Increase",
        desc: "+1 to all ability scores.",
      },
    ],
  },
  "variant-human": {
    index: "variant-human",
    name: "Variant Human",
    source: "phb",
    desc: "Replaces the standard +1 to all abilities with two +1 ability choices, one skill, and one feat.",
    localTraits: [
      {
        name: "Ability Score Increase",
        desc: "Two different ability scores of your choice increase by 1.",
      },
      {
        name: "Skills",
        desc: "You gain proficiency in one skill of your choice.",
      },
      {
        name: "Feat",
        desc: "You gain one feat of your choice.",
      },
    ],
  },
  "half-elf-skills": {
    index: "half-elf-skills",
    name: "Skill Versatility",
    source: "srd",
    desc: "You gain proficiency in two skills of your choice.",
    traitIndices: ["skill-versatility"],
    localTraits: [
      {
        name: "Skill Versatility",
        desc: "You gain proficiency in two skills of your choice.",
      },
    ],
  },
  "half-elf-elf-weapons": {
    index: "half-elf-elf-weapons",
    name: "Elf Weapon Training",
    source: "phb",
    desc: "High or wood elf heritage — weapon proficiencies from elven tradition.",
    traitIndices: ["elf-weapon-training"],
    localTraits: [
      {
        name: "Elf Weapon Training",
        desc: "Proficiency with longsword, shortsword, shortbow, and longbow.",
      },
    ],
  },
  "half-elf-cantrip": {
    index: "half-elf-cantrip",
    name: "Wizard Cantrip",
    source: "phb",
    desc: "High elf heritage — one wizard cantrip of your choice.",
    localTraits: [
      {
        name: "Cantrip",
        desc: "You know one cantrip of your choice from the wizard spell list (Intelligence).",
      },
    ],
  },
  "half-elf-fleet-of-foot": {
    index: "half-elf-fleet-of-foot",
    name: "Fleet of Foot",
    source: "phb",
    desc: "Wood elf heritage — increased walking speed.",
    localTraits: [
      {
        name: "Fleet of Foot",
        desc: "Your base walking speed increases to 35 feet.",
      },
    ],
  },
  "half-elf-mask-of-the-wild": {
    index: "half-elf-mask-of-the-wild",
    name: "Mask of the Wild",
    source: "phb",
    desc: "Wood elf heritage — hide in natural obscurement.",
    localTraits: [
      {
        name: "Mask of the Wild",
        desc: "You can attempt to hide when lightly obscured by foliage, rain, snow, mist, and similar natural phenomena.",
      },
    ],
  },
  "half-elf-drow-magic": {
    index: "half-elf-drow-magic",
    name: "Drow Magic",
    source: "phb",
    desc: "Dark elf heritage — innate drow spellcasting.",
    localTraits: [
      {
        name: "Drow Magic",
        desc: "Dancing lights cantrip; faerie fire at 3rd level; darkness at 5th level (Charisma, once per long rest each).",
      },
    ],
  },
  "bloodline-of-asmodeus": tieflingBloodline(
    "bloodline-of-asmodeus",
    "Bloodline of Asmodeus",
    "int",
    "Infernal Legacy",
    "Thaumaturgy",
    "hellish rebuke (2nd-level)",
    "darkness",
    "The tieflings connected to Nessus command the power of fire and darkness.",
    "phb",
  ),
  "bloodline-of-baalzebul": tieflingBloodline(
    "bloodline-of-baalzebul",
    "Bloodline of Baalzebul",
    "int",
    "Legacy of Maladomini",
    "Thaumaturgy",
    "ray of sickness (2nd-level)",
    "crown of madness",
    "Tieflings linked to Baalzebul can corrupt others both physically and psychically.",
    "mtof",
  ),
  "bloodline-of-dispater": tieflingBloodline(
    "bloodline-of-dispater",
    "Bloodline of Dispater",
    "dex",
    "Legacy of Dis",
    "Thaumaturgy",
    "disguise self (2nd-level)",
    "detect thoughts",
    "Tieflings tied to Dispater excel as spies and infiltrators in the great city of Dis.",
    "mtof",
  ),
  "bloodline-of-fierna": tieflingBloodline(
    "bloodline-of-fierna",
    "Bloodline of Fierna",
    "wis",
    "Legacy of Phlegethos",
    "Friends",
    "charm person (2nd-level)",
    "suggestion",
    "Fierna grants tieflings tied to her forceful, manipulative personalities.",
    "mtof",
  ),
  "bloodline-of-glasya": tieflingBloodline(
    "bloodline-of-glasya",
    "Bloodline of Glasya",
    "dex",
    "Legacy of Malbolge",
    "Minor illusion",
    "disguise self (2nd-level)",
    "invisibility (2nd-level)",
    "Glasya grants magic useful for heists and covert schemes.",
    "mtof",
  ),
  "bloodline-of-levistus": tieflingBloodline(
    "bloodline-of-levistus",
    "Bloodline of Levistus",
    "con",
    "Legacy of Stygia",
    "Ray of frost",
    "armor of agathys (2nd-level)",
    "darkness",
    "Levistus offers bargains to those who face inescapable doom.",
    "mtof",
  ),
  "bloodline-of-mammon": tieflingBloodline(
    "bloodline-of-mammon",
    "Bloodline of Mammon",
    "int",
    "Legacy of Minauros",
    "Mage hand",
    "Tenser's floating disk (2nd-level)",
    "arcane lock",
    "Tieflings tied to Mammon excel at gathering and safeguarding wealth.",
    "mtof",
  ),
  "bloodline-of-mephistopheles": tieflingBloodline(
    "bloodline-of-mephistopheles",
    "Bloodline of Mephistopheles",
    "int",
    "Legacy of Cania",
    "Mage hand",
    "burning hands (2nd-level)",
    "flame blade (3rd-level)",
    "Mephistopheles offers arcane power to those who entreat with him.",
    "mtof",
  ),
  "bloodline-of-zariel": tieflingBloodline(
    "bloodline-of-zariel",
    "Bloodline of Zariel",
    "str",
    "Legacy of Avernus",
    "Thaumaturgy",
    "searing smite (2nd-level)",
    "branding smite (3rd-level)",
    "Tieflings with a blood tie to Zariel receive magical abilities that aid them in battle.",
    "mtof",
  ),
  "feral-tiefling": {
    index: "feral-tiefling",
    name: "Feral Tiefling",
    source: "scag",
    replaceBaseRaceBonuses: true,
    desc: "Some tieflings resemble their fiendish ancestors more strongly — replaces the standard ability score increase.",
    ability_bonuses: [
      { ability_score: { index: "int" }, bonus: 1 },
      { ability_score: { index: "dex" }, bonus: 2 },
    ],
    localTraits: [
      {
        name: "Feral",
        desc: "Your Intelligence score increases by 1 and your Dexterity score increases by 2 (replaces Charisma +2).",
      },
    ],
  },
  "devils-tongue-tiefling": {
    index: "devils-tongue-tiefling",
    name: "Devil's Tongue",
    source: "scag",
    desc: "A variant legacy of manipulation and mockery — replaces Infernal Legacy.",
    ability_bonuses: [{ ability_score: { index: "int" }, bonus: 1 }],
    localTraits: [
      {
        name: "Devil's Tongue",
        desc: "Vicious mockery cantrip; charm person at 3rd level; enthrall at 5th level (Charisma, once per long rest each).",
      },
    ],
  },
  "hellfire-tiefling": {
    index: "hellfire-tiefling",
    name: "Hellfire",
    source: "scag",
    desc: "Burning hands instead of hellish rebuke — replaces the hellish rebuke portion of Infernal Legacy.",
    ability_bonuses: [{ ability_score: { index: "int" }, bonus: 1 }],
    localTraits: [
      {
        name: "Hellfire",
        desc: "Thaumaturgy cantrip; burning hands at 3rd level (replaces hellish rebuke); darkness at 5th level (Charisma, once per long rest each).",
      },
    ],
  },
  "winged-tiefling": {
    index: "winged-tiefling",
    name: "Winged",
    source: "scag",
    desc: "Bat-like wings replace Infernal Legacy spellcasting.",
    ability_bonuses: [{ ability_score: { index: "int" }, bonus: 1 }],
    localTraits: [
      {
        name: "Winged",
        desc: "You have a flying speed of 30 feet while you aren't wearing heavy armor (replaces Infernal Legacy).",
      },
    ],
  },
  "abyssal-tiefling": {
    index: "abyssal-tiefling",
    name: "Abyssal Tiefling",
    source: "ua",
    desc: "Unearthed Arcana — tieflings whose bloodline traces to the demons of the Abyss.",
    ability_bonuses: [{ ability_score: { index: "con" }, bonus: 1 }],
    localTraits: [
      {
        name: "Abyssal Arcana",
        desc: "After each long rest, roll on the Abyssal Arcana table for random cantrips and spells (1st at 3rd level, 2nd at 5th level).",
      },
      {
        name: "Abyssal Fortitude",
        desc: "Your hit point maximum increases by half your level (minimum 1).",
      },
      {
        name: "Languages",
        desc: "You can speak, read, and write Abyssal in addition to Common and Infernal.",
      },
    ],
  },
};

export function getSubracesForRace(raceIndex: string) {
  return subracesByRace[raceIndex] || [];
}

export function getLocalSubraceData(index: string): LocalSubraceDefinition | null {
  return localSubraceData[index] ?? null;
}

export function localSubraceToRaw(def: LocalSubraceDefinition): Record<string, unknown> {
  return {
    index: def.index,
    name: def.name,
    desc: def.desc,
    ability_bonuses: def.ability_bonuses ?? [],
    racial_traits: (def.traitIndices ?? []).map((idx) => ({
      index: idx,
      name: idx.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    })),
    localTraits: def.localTraits ?? [],
    source: def.source ?? "phb",
  };
}

export function mergeSubraces(
  apiSubs: { index: string; name: string }[] | undefined,
  raceIndex: string,
): SubraceOption[] {
  const extra = getSubracesForRace(raceIndex);
  const seen = new Set<string>();
  const merged: SubraceOption[] = [];

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
