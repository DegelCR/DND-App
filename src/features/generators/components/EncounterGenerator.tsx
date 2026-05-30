import { useState } from 'react'
import { generateEncounter } from '@/lib/generators'
import type { EncounterDifficulty } from '@/lib/generators'
import type { GeneratedEncounter } from '@/types/generators'

interface EncounterGeneratorProps {
  onResult?: (encounter: GeneratedEncounter) => void
}

export function EncounterGenerator({ onResult }: EncounterGeneratorProps) {
  const [partyLevel, setPartyLevel] = useState(5)
  const [difficulty, setDifficulty] = useState<EncounterDifficulty>('medium')
  const [result, setResult] = useState<GeneratedEncounter | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    const outcome = await generateEncounter(partyLevel, difficulty)
    setLoading(false)

    if ('error' in outcome) {
      setError(outcome.error)
      setResult(null)
      return
    }

    setResult(outcome)
    onResult?.(outcome)
  }

  async function copyResult() {
    if (!result) return
    const text = [
      `Level ${result.partyLevel} party — ${result.difficulty}`,
      result.summary,
      ...result.monsters.map((m) => `  ${m.count}× ${m.name} (CR ${m.cr})`),
    ].join('\n')
    await navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-table-400">Party level</span>
          <input
            type="number"
            min={1}
            max={20}
            value={partyLevel}
            onChange={(e) => setPartyLevel(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
            className="w-20 rounded-lg border border-table-600 bg-table-900 px-3 py-2 text-table-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-table-400">Difficulty</span>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as EncounterDifficulty)}
            className="rounded-lg border border-table-600 bg-table-900 px-3 py-2 text-table-100"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      </div>

      <p className="text-xs text-table-500">
        Uses SRD monsters cached from Bestiary. Open Bestiary once while online if empty.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleGenerate()}
          disabled={loading}
          className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-table-950 hover:bg-gold-400 disabled:opacity-50"
        >
          {loading ? 'Generating…' : 'Generate encounter'}
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

      {error && (
        <p className="rounded-lg border border-amber-700/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
          {error}
        </p>
      )}

      {result && (
        <div className="rounded-lg border border-table-700 bg-table-900/50 p-4">
          <p className="mb-2 text-sm text-table-400">
            Level {result.partyLevel} party · {result.difficulty}
          </p>
          <p className="mb-3 font-medium text-gold-300">{result.summary}</p>
          <ul className="space-y-1 text-sm text-table-200">
            {result.monsters.map((m) => (
              <li key={m.name}>
                {m.count}× {m.name} <span className="text-table-500">(CR {m.cr})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
