import { useState } from 'react'
import type { CombatantType } from '@/types/combat'

interface AddCombatantFormProps {
  onAdd: (input: {
    name: string
    type: CombatantType
    maxHp: number
    initiativeBonus: number
    armorClass?: number
  }) => void
  disabled?: boolean
}

export function AddCombatantForm({ onAdd, disabled }: AddCombatantFormProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<CombatantType>('pc')
  const [maxHp, setMaxHp] = useState(20)
  const [initBonus, setInitBonus] = useState(0)
  const [ac, setAc] = useState<number | ''>('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({
      name: name.trim(),
      type,
      maxHp: Math.max(1, maxHp),
      initiativeBonus: initBonus,
      armorClass: ac === '' ? undefined : Number(ac),
    })
    setName('')
    setMaxHp(type === 'pc' ? 20 : 10)
    setInitBonus(0)
    setAc('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-table-700 bg-table-900/40 p-4"
    >
      <p className="mb-3 text-xs uppercase tracking-wide text-table-500">
        Add combatant
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs text-table-400">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Aragorn, Goblin #1…"
            disabled={disabled}
            className="w-full rounded-lg border border-table-600 bg-table-800 px-3 py-2 text-sm text-table-100 placeholder:text-table-500 focus:border-gold-500/50 focus:outline-none disabled:opacity-50"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs text-table-400">Type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CombatantType)}
            disabled={disabled}
            className="w-full rounded-lg border border-table-600 bg-table-800 px-3 py-2 text-sm text-table-100 focus:border-gold-500/50 focus:outline-none disabled:opacity-50"
          >
            <option value="pc">PC</option>
            <option value="npc">NPC</option>
            <option value="monster">Monster</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs text-table-400">Max HP</span>
          <input
            type="number"
            min={1}
            value={maxHp}
            onChange={(e) => setMaxHp(Number(e.target.value))}
            disabled={disabled}
            className="w-full rounded-lg border border-table-600 bg-table-800 px-3 py-2 text-sm text-table-100 focus:border-gold-500/50 focus:outline-none disabled:opacity-50"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs text-table-400">Initiative bonus</span>
          <input
            type="number"
            value={initBonus}
            onChange={(e) => setInitBonus(Number(e.target.value))}
            disabled={disabled}
            className="w-full rounded-lg border border-table-600 bg-table-800 px-3 py-2 text-sm text-table-100 focus:border-gold-500/50 focus:outline-none disabled:opacity-50"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs text-table-400">AC (optional)</span>
          <input
            type="number"
            min={1}
            value={ac}
            onChange={(e) =>
              setAc(e.target.value === '' ? '' : Number(e.target.value))
            }
            disabled={disabled}
            className="w-full rounded-lg border border-table-600 bg-table-800 px-3 py-2 text-sm text-table-100 focus:border-gold-500/50 focus:outline-none disabled:opacity-50"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={disabled || !name.trim()}
        className="mt-3 w-full rounded-lg bg-gold-500/20 py-2 text-sm font-medium text-gold-300 ring-1 ring-gold-500/40 transition-colors hover:bg-gold-500/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Add combatant
      </button>
    </form>
  )
}
