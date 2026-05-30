import type { GeneratedLoot, LootTier } from '@/types/generators'
import { chance, pick, rollDice } from './random'

const GEMS = [
  'Azurite (10 gp)', 'Banded agate (10 gp)', 'Blue quartz (10 gp)', 'Eye agate (10 gp)',
  'Hematite (10 gp)', 'Malachite (10 gp)', 'Moss agate (10 gp)', 'Obsidian (10 gp)',
  'Rhodochrosite (10 gp)', 'Tiger eye (10 gp)', 'Turquoise (10 gp)',
  'Bloodstone (50 gp)', 'Carnelian (50 gp)', 'Chalcedony (50 gp)', 'Jasper (50 gp)',
  'Moonstone (50 gp)', 'Onyx (50 gp)', 'Quartz (50 gp)', 'Sardonyx (50 gp)',
  'Star rose quartz (50 gp)', 'Zircon (50 gp)',
  'Amber (100 gp)', 'Amethyst (100 gp)', 'Chrysoberyl (100 gp)', 'Coral (100 gp)',
  'Garnet (100 gp)', 'Jade (100 gp)', 'Jet (100 gp)', 'Pearl (100 gp)',
  'Spinel (100 gp)', 'Tourmaline (100 gp)',
]

const ART = [
  'Silver ewer (100 gp)', 'Carved bone statuette (25 gp)', 'Gold bracelet (250 gp)',
  'Cloth-of-gold vestments (25 gp)', 'Black velvet mask (25 gp)', 'Copper chalice (25 gp)',
  'Carved ivory statuette (250 gp)', 'Fine gold chain (250 gp)', 'Silk robe (250 gp)',
  'Painted portrait (250 gp)', 'Gold ring (250 gp)', 'Ornate sarcophagus (250 gp)',
]

const MUNDANE = [
  'Bag of caltrops', 'Block and tackle', 'Climber\'s kit', 'Healer\'s kit',
  'Hunting trap', 'Lantern', 'Manacles', 'Mirror, steel', 'Oil (flask)',
  'Potion of healing', 'Rope, hempen (50 ft.)', 'Spyglass', 'Tinderbox',
  'Waterskin', '10 torches', '5 rations (1 day each)',
]

const MAGIC_ITEMS = [
  'Potion of healing', 'Potion of climbing', 'Spell scroll (cantrip)',
  'Spell scroll (1st level)', 'Potion of greater healing', 'Bag of holding',
  'Boots of elvenkind', 'Cloak of elvenkind', 'Gauntlets of ogre power',
  'Ring of protection', 'Wand of magic detection', '+1 weapon', '+1 shield',
]

export const LOOT_TIER_LABELS: Record<LootTier, string> = {
  '1': 'Tier 1 — CR 0–4',
  '2': 'Tier 2 — CR 5–10',
  '3': 'Tier 3 — CR 11–16',
  '4': 'Tier 4 — CR 17+',
}

function coinLine(tier: LootTier): string {
  switch (tier) {
    case '1': {
      const cp = rollDice(6, 6) * 100
      const sp = rollDice(3, 6) * 100
      const gp = rollDice(2, 6) * 10
      return `${cp} cp, ${sp} sp, ${gp} gp`
    }
    case '2': {
      const gp = rollDice(2, 6) * 100 + rollDice(2, 6) * 10
      const pp = rollDice(2, 6)
      return `${gp} gp${pp ? `, ${pp} pp` : ''}`
    }
    case '3': {
      const gp = rollDice(2, 6) * 1000 + rollDice(2, 6) * 100
      const pp = rollDice(2, 6) * 10
      return `${gp} gp, ${pp} pp`
    }
    case '4': {
      const gp = rollDice(2, 6) * 10000 + rollDice(2, 6) * 1000
      const pp = rollDice(2, 6) * 100
      return `${gp} gp, ${pp} pp`
    }
  }
}

export function generateLoot(tier: LootTier): GeneratedLoot {
  const lines: string[] = [`Coins: ${coinLine(tier)}`]

  const gemCount = tier === '1' ? rollDice(2, 4) : tier === '2' ? rollDice(2, 6) : rollDice(3, 6)
  if (gemCount > 0) {
    lines.push(`Gems (${gemCount}): ${Array.from({ length: gemCount }, () => pick(GEMS)).join('; ')}`)
  }

  if (tier !== '1' || chance(50)) {
    const artCount = tier === '1' ? 1 : rollDice(1, 4)
    lines.push(`Art objects (${artCount}): ${Array.from({ length: artCount }, () => pick(ART)).join('; ')}`)
  }

  if (tier === '1' && chance(60)) {
    lines.push(`Mundane: ${pick(MUNDANE)}`)
  }

  const magicChance = tier === '1' ? 15 : tier === '2' ? 35 : tier === '3' ? 55 : 75
  if (chance(magicChance)) {
    const magicCount = tier === '4' ? rollDice(1, 4) : 1
    lines.push(
      `Magic (${magicCount}): ${Array.from({ length: magicCount }, () => pick(MAGIC_ITEMS)).join('; ')}`,
    )
  }

  return {
    tier,
    label: LOOT_TIER_LABELS[tier],
    lines,
  }
}
