import { useState } from 'react'
import { generateNpc } from '@/lib/generators'
import type { GeneratedNpc } from '@/types/generators'

interface NpcGeneratorProps {
  onResult?: (npc: GeneratedNpc) => void
}

export function NpcGenerator({ onResult }: NpcGeneratorProps) {
  const [npc, setNpc] = useState<GeneratedNpc | null>(null)

  function handleGenerate() {
    const result = generateNpc()
    setNpc(result)
    onResult?.(result)
  }

  async function copyNpc() {
    if (!npc) return
    const text = [
      `${npc.name} — ${npc.role}`,
      `Trait: ${npc.trait}`,
      `Hook: ${npc.quirk}`,
      `Says: ${npc.line}`,
    ].join('\n')
    await navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleGenerate}
          className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-table-950 hover:bg-gold-400"
        >
          Generate NPC
        </button>
        {npc && (
          <button
            type="button"
            onClick={() => void copyNpc()}
            className="rounded-lg border border-table-500 bg-table-800 px-4 py-2 text-sm text-table-100 hover:border-gold-500/40 hover:bg-table-700"
          >
            Copy
          </button>
        )}
      </div>

      {npc && (
        <div className="rounded-lg border border-table-700 bg-table-900/50 p-4 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gold-300">{npc.name}</h3>
            <p className="text-sm text-table-400">{npc.role}</p>
          </div>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-table-500">Trait</dt>
              <dd className="text-table-200">{npc.trait}</dd>
            </div>
            <div>
              <dt className="text-table-500">Hook</dt>
              <dd className="text-table-200">{npc.quirk}</dd>
            </div>
          </dl>
          <p className="border-t border-table-700 pt-3 text-sm italic text-table-300">{npc.line}</p>
        </div>
      )}
    </div>
  )
}
