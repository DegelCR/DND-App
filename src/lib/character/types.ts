export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export interface ApiRef {
  index: string;
  name: string;
  url?: string;
}

export interface RaceSelection {
  index: string;
  name: string;
  subraces?: SubraceOption[];
  raw?: Record<string, unknown>;
}

export interface SubraceOption {
  index: string;
  name: string;
  source?: "srd" | "phb";
}

export interface ClassSelection {
  index: string;
  name: string;
  hitDie?: number;
  proficiencies?: ApiRef[];
  subclasses?: SubclassOption[];
  raw?: Record<string, unknown>;
}

export interface SubclassOption {
  index: string;
  name: string;
  source?: string;
}

export interface SubclassSelection {
  index: string;
  name: string;
  source?: string;
  local?: boolean;
  raw?: Record<string, unknown>;
}

export interface BackgroundSelection {
  index: string;
  name: string;
  source?: string;
  feature?: string;
  skills?: string[];
  local?: boolean;
  raw?: Record<string, unknown>;
}

export interface SpellRef {
  index: string;
  name: string;
  level: number;
  url?: string;
}

export interface SelectedSpells {
  cantrips: string[];
  known: string[];
  prepared: string[];
}

export interface Character {
  name: string;
  playerName: string;
  level: number;
  alignment: string;
  concept: string;
  race: RaceSelection | null;
  subrace: RaceSelection | null;
  raceBonuses: Partial<Record<AbilityKey, number>>;
  class: ClassSelection | null;
  subclass: SubclassSelection | null;
  background: BackgroundSelection | null;
  abilityScores: Record<AbilityKey, number>;
  equipment: string;
  personality: string;
  skillChoices: Record<string, string[]>;
  skillProficiencies: string[];
  /** Variant Human: one skill proficiency from racial trait */
  variantHumanSkill?: string;
  /** Variant Human: chosen feat name (reference only) */
  variantHumanFeat?: string;
  /** Half-Elf Skill Versatility: two skill proficiencies */
  halfElfVersatilitySkills?: string[];
  proficiencyNotes: string;
  selectedSpells: SelectedSpells;
  spellNotes: string;
  classSpellList: SpellRef[] | null;
  _levelCache: { key: string; data: LevelData } | null;
}

export interface LevelData {
  level: number;
  prof_bonus?: number;
  spellcasting?: Record<string, number>;
  features?: ApiRef[];
}

export interface ProficiencyChoiceGroup {
  id: string;
  desc: string;
  choose: number;
  options: { index: string; name: string }[];
}
