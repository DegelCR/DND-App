import { useState } from 'react'
import {
  generateNames,
  NAME_CATEGORY_LABELS,
} from '@/lib/generators'
import type { GeneratedName, NameCategory } from '@/types/generators'

interface NameGeneratorProps {
  onResult?: (items: GeneratedName[]) => void
}

export function NameGenerator({ onResult }: NameGeneratorProps) {
  const [category, setCategory] = useState<NameCategory>('character')
  const [count, setCount] = useState(3)
  const [results, setResults] = useState<GeneratedName[]>([])

  function handleGenerate() {
    const items = generateNames(category, count)
    setResults(items)
    onResult?.(items)
  }

  async function copyAll() {
    const text = results.map((r) => r.name).join('\n')
    await navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-table-400">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as NameCategory)}
            className="rounded-lg border border-table-600 bg-table-900 px-3 py-2 text-table-100"
          >
            {(Object.keys(NAME_CATEGORY_LABELS) as NameCategory[]).map((key) => (
              <option key={key} value={key}>
                {NAME_CATEGORY_LABELS[key]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-table-400">Count</span>
          <input
            type="number"
            min={1}
            max={10}
            value={count}
            onChange={(e) => setCount(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
            className="w-20 rounded-lg border border-table-600 bg-table-900 px-3 py-2 text-table-100"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleGenerate}
          className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-table-950 hover:bg-gold-400"
        >
          Generate names
        </button>
        {results.length > 0 && (
          <button
            type="button"
            onClick={() => void copyAll()}
            className="rounded-lg border border-table-500 bg-table-800 px-4 py-2 text-sm text-table-100 hover:border-gold-500/40 hover:bg-table-700"
          >
            Copy all
          </button>
        )}
      </div>

      {results.length > 0 && (
        <ul className="space-y-2 rounded-lg border border-table-700 bg-table-900/50 p-4">
          {results.map((item, i) => (
            <li key={`${item.name}-${i}`} className="flex items-center justify-between gap-2">
              <span className="font-medium text-gold-300">{item.name}</span>
              <button
                type="button"
                onClick={() => void navigator.clipboard.writeText(item.name)}
                className="rounded px-2 py-0.5 text-xs text-table-300 ring-1 ring-table-600 hover:bg-table-800 hover:text-gold-300"
              >
                Copy
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
