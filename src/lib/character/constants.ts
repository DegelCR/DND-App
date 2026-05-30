export const SRD_WIKI = 'https://www.dndbeyond.com/srd'

export const ABILITIES = [
  { key: 'str' as const, label: 'STR', name: 'Strength', color: '#b83434', bg: '#fde8e8' },
  { key: 'dex' as const, label: 'DEX', name: 'Dexterity', color: '#2d8a4e', bg: '#e6f5eb' },
  { key: 'con' as const, label: 'CON', name: 'Constitution', color: '#c4761a', bg: '#fdf3e3' },
  { key: 'int' as const, label: 'INT', name: 'Intelligence', color: '#2f5fae', bg: '#e8eef9' },
  { key: 'wis' as const, label: 'WIS', name: 'Wisdom', color: '#6b4c9e', bg: '#f0eaf8' },
  { key: 'cha' as const, label: 'CHA', name: 'Charisma', color: '#9e3d6e', bg: '#fae8f1' },
]

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8]

export const STEPS = [
  { id: 1, label: 'Basics' },
  { id: 2, label: 'Race' },
  { id: 3, label: 'Class' },
  { id: 4, label: 'Background' },
  { id: 5, label: 'Stats' },
  { id: 6, label: 'Skills' },
  { id: 7, label: 'Spells' },
  { id: 8, label: 'Gear' },
  { id: 9, label: 'Sheet' },
]

export const ALIGNMENTS = [
  { value: 'LG', label: 'Lawful Good' },
  { value: 'NG', label: 'Neutral Good' },
  { value: 'CG', label: 'Chaotic Good' },
  { value: 'LN', label: 'Lawful Neutral' },
  { value: 'N', label: 'Neutral' },
  { value: 'CN', label: 'Chaotic Neutral' },
  { value: 'LE', label: 'Lawful Evil' },
  { value: 'NE', label: 'Neutral Evil' },
  { value: 'CE', label: 'Chaotic Evil' },
]
