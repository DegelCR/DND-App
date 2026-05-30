import { useState } from 'react'
import { generateLoot, LOOT_TIER_LABELS } from '@/lib/generators'
import type { GeneratedLoot, LootTier } from '@/types/generators'

interface LootGeneratorProps {
  onResult?: (loot: GeneratedLoot) => void
}

export function LootGenerator({ onResult }: LootGeneratorProps) {
  const [tier, setTier] = useState<LootTier>('1')
  const [result, setResult] = useState<GeneratedLoot | null>(null)

  function handleGenerate() {
    const loot = generateLoot(tier)
    setResult(loot)
    onResult?.(loot)
  }

  async function copyResult() {
    if (!result) return
    const text = [result.label, ...result.lines].join('\n')
    await navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-table-400">Treasure tier</span>
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value as LootTier)}
          className="max-w-md rounded-lg border border-table-600 bg-table-900 px-3 py-2 text-table-100"
        >
          {(Object.keys(LOOT_TIER_LABELS) as LootTier[]).map((key) => (
            <option key={key} value={key}>
              {LOOT_TIER_LABELS[key]}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleGenerate}
          className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-table-950 hover:bg-gold-400"
        >
          Generate hoard
        </button>
        {result && (
          <button
            type="button"
            onClick={() => void copyResult()}
            className="rounded-lg border border-table-500 bg-table-800 px-4 py-2 text-sm text-table-100 hover:border-gold-500/40 hover:bg-table-700"
          >
            Copy
          </button>
        )}
      </div>

      {result && (
        <div className="rounded-lg border border-table-700 bg-table-900/50 p-4">
          <p className="mb-3 text-sm font-medium text-gold-400">{result.label}</p>
          <ul className="space-y-2 text-sm text-table-200">
            {result.lines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
