import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { EncounterGenerator } from './components/EncounterGenerator'
import { LootGenerator } from './components/LootGenerator'
import { NameGenerator } from './components/NameGenerator'
import { NpcGenerator } from './components/NpcGenerator'

type GeneratorTab = 'names' | 'loot' | 'npc' | 'encounter'

const TABS: { id: GeneratorTab; label: string; icon: string }[] = [
  { id: 'names', label: 'Names', icon: '✨' },
  { id: 'loot', label: 'Loot', icon: '💰' },
  { id: 'npc', label: 'Quick NPC', icon: '👤' },
  { id: 'encounter', label: 'Encounter', icon: '⚔️' },
]

export function GeneratorsPage() {
  const [tab, setTab] = useState<GeneratorTab>('names')

  return (
    <>
      <PageHeader
        title="Generators"
        description="Names, treasure hoards, quick NPCs, and random encounters for session prep."
        icon="🎲"
      />

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex flex-wrap gap-2 border-b border-table-700 pb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-gold-500/20 text-gold-300 ring-1 ring-gold-500/50'
                  : 'border border-table-600 bg-table-800 text-table-200 hover:border-table-500 hover:bg-table-700'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <section className="max-w-2xl rounded-xl border border-table-700 bg-table-900/30 p-6">
          {tab === 'names' && <NameGenerator />}
          {tab === 'loot' && <LootGenerator />}
          {tab === 'npc' && <NpcGenerator />}
          {tab === 'encounter' && <EncounterGenerator />}
        </section>
      </div>
    </>
  )
}
