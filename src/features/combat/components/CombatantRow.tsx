import { COMMON_CONDITIONS, formatHp } from '@/lib/combat'
import type { CombatCombatant } from '@/types/combat'

interface CombatantRowProps {
  combatant: CombatCombatant
  isActive: boolean
  onRollInitiative: () => void
  onAdjustHp: (delta: number) => void
  onToggleDefeated: () => void
  onToggleHideHp: () => void
  onToggleCondition: (condition: string) => void
  onRemove: () => void
}

const TYPE_LABELS: Record<CombatCombatant['type'], string> = {
  pc: 'PC',
  npc: 'NPC',
  monster: 'Monster',
}

export function CombatantRow({
  combatant,
  isActive,
  onRollInitiative,
  onAdjustHp,
  onToggleDefeated,
  onToggleHideHp,
  onToggleCondition,
  onRemove,
}: CombatantRowProps) {
  return (
    <li
      className={`rounded-xl border p-4 transition-colors ${
        isActive
          ? 'border-gold-500/40 bg-gold-500/10'
          : combatant.isDefeated
            ? 'border-table-700 bg-table-900/30 opacity-60'
            : 'border-table-700 bg-table-900/50'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`font-display text-lg ${
                combatant.isDefeated ? 'text-table-500 line-through' : 'text-table-100'
              }`}
            >
              {combatant.name}
            </h3>
            <span className="rounded bg-table-800 px-1.5 py-0.5 text-[10px] uppercase text-table-400">
              {TYPE_LABELS[combatant.type]}
            </span>
            {isActive && (
              <span className="rounded bg-gold-500/20 px-1.5 py-0.5 text-[10px] font-medium text-gold-300">
                Active turn
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-table-400">
            Initiative:{' '}
            {combatant.initiative != null ? combatant.initiative : '—'}
            {combatant.armorClass != null && ` · AC ${combatant.armorClass}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={onRollInitiative}
            className="rounded-lg border border-table-600 px-2 py-1 text-xs text-table-300 hover:bg-table-800"
          >
            Roll init
          </button>
          <button
            type="button"
            onClick={onToggleDefeated}
            className={`rounded-lg border px-2 py-1 text-xs ${
              combatant.isDefeated
                ? 'border-emerald-500/40 text-emerald-400'
                : 'border-table-600 text-table-300 hover:bg-table-800'
            }`}
          >
            {combatant.isDefeated ? 'Revive' : 'Defeated'}
          </button>
          <button
            type="button"
            onClick={onToggleHideHp}
            className={`rounded-lg border px-2 py-1 text-xs ${
              combatant.hideHp
                ? 'border-gold-500/40 text-gold-400'
                : 'border-table-600 text-table-300 hover:bg-table-800'
            }`}
          >
            {combatant.hideHp ? 'Show HP' : 'Hide HP'}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg border border-table-600 px-2 py-1 text-xs text-table-500 hover:border-blood-500/40 hover:text-blood-400"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-table-400">HP</span>
        <button
          type="button"
          onClick={() => onAdjustHp(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-table-800 text-table-200 hover:bg-table-700"
          aria-label="Decrease HP"
        >
          −
        </button>
        <span className="min-w-[4rem] text-center font-display text-lg text-gold-400">
          {formatHp(combatant.currentHp, combatant.maxHp, combatant.hideHp)}
        </span>
        <button
          type="button"
          onClick={() => onAdjustHp(1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-table-800 text-table-200 hover:bg-table-700"
          aria-label="Increase HP"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => onAdjustHp(-5)}
          className="rounded-lg bg-table-800 px-2 py-1 text-xs text-table-400 hover:bg-table-700"
        >
          −5
        </button>
        <button
          type="button"
          onClick={() => onAdjustHp(5)}
          className="rounded-lg bg-table-800 px-2 py-1 text-xs text-table-400 hover:bg-table-700"
        >
          +5
        </button>
      </div>

      <div className="mt-3">
        <p className="mb-1.5 text-xs text-table-500">Conditions</p>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_CONDITIONS.map((condition) => {
            const active = combatant.conditions.includes(condition)
            return (
              <button
                key={condition}
                type="button"
                onClick={() => onToggleCondition(condition)}
                className={`rounded-full px-2.5 py-0.5 text-xs transition-colors ${
                  active
                    ? 'bg-blood-500/20 text-blood-400 ring-1 ring-blood-500/40'
                    : 'bg-table-800 text-table-500 hover:text-table-300'
                }`}
              >
                {condition}
              </button>
            )
          })}
        </div>
      </div>
    </li>
  )
}
