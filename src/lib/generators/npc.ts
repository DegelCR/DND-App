import type { GeneratedNpc } from '@/types/generators'
import { generateName } from './names'
import { pick } from './random'

const ROLES = [
  'Merchant', 'Guard', 'Innkeeper', 'Blacksmith', 'Priest', 'Scholar', 'Farmer',
  'Sailor', 'Bard', 'Hunter', 'Healer', 'Courier', 'Noble\'s aide', 'Dock worker',
  'Miner', 'Stable hand', 'Scribe', 'Tinker', 'Guide', 'Beggar', 'Soldier',
]

const TRAITS = [
  'Warm and talkative', 'Suspicious of strangers', 'Deeply superstitious',
  'Always chewing on something', 'Speaks in riddles', 'Unusually well-read',
  'Missing a finger on the left hand', 'Wears an eyepatch', 'Laughs at bad jokes',
  'Never makes eye contact', 'Smells faintly of sulfur', 'Carries a lucky charm',
  'Speaks with a rasp', 'Constantly taking notes', 'Overly formal manners',
  'Quick to anger', 'Unshakably calm', 'Hums old songs', 'Collects odd trinkets',
]

const QUIRKS = [
  'Owes money to the wrong people', 'Searching for a lost sibling',
  'Secretly feeds stray cats', 'Knows a rumor about the local lord',
  'Afraid of the dark', 'Will trade information for ale',
  'Once served in the army', 'Has a map they shouldn\'t have',
  'Believes the party is destined', 'Trying to leave town tonight',
  'Hiding from tax collectors', 'Wants adventurers to scare off bandits',
  'Collects debts for someone powerful', 'Swears they saw a dragon',
]

const OPENERS = [
  '"You look like you\'ve seen trouble — need a lead?"',
  '"Fresh news costs coin, friend."',
  '"Keep your voice down in here."',
  '"You\'re not from around here, are you?"',
  '"If it\'s work you want, I might know someone."',
  '"Bad time to be on the road after dark."',
]

export function generateNpc(): GeneratedNpc {
  const name = generateName('npc').name
  const role = pick(ROLES)
  const trait = pick(TRAITS)
  const quirk = pick(QUIRKS)
  const line = pick(OPENERS)

  return { name, role, trait, quirk, line }
}
