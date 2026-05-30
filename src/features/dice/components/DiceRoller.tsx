import { lazy, Suspense, useState, type ReactNode } from 'react'
import {
  rollDice,
  rollFromExpression,
  STANDARD_DICE,
  type RollMode,
  type RollResult,
} from '@/lib/dice'

const FumbleAnimation = lazy(() =>
  import('./FumbleAnimation').then((m) => ({ default: m.FumbleAnimation })),
)

const CriticalAnimation = lazy(() =>
  import('./CriticalAnimation').then((m) => ({ default: m.CriticalAnimation })),
)

interface DiceRollerProps {
  onRoll: (result: RollResult) => void
}

const SHAKE_MS = 450

const QUICK_ROLLS: Array<{
  label: string
  sides: number
  count: number
  mode: RollMode
  withCurrentModifier?: boolean
}> = [
  { label: 'd20', sides: 20, count: 1, mode: 'normal' },
  { label: 'd20 + mod', sides: 20, count: 1, mode: 'normal', withCurrentModifier: true },
  { label: 'Advantage', sides: 20, count: 1, mode: 'advantage' },
  { label: 'Disadvantage', sides: 20, count: 1, mode: 'disadvantage' },
  { label: 'd100', sides: 100, count: 1, mode: 'normal' },
  { label: '2d6', sides: 6, count: 2, mode: 'normal' },
]

export function DiceRoller({ onRoll }: DiceRollerProps) {
  const [sides, setSides] = useState(20)
  const [count, setCount] = useState(1)
  const [modifier, setModifier] = useState(0)
  const [mode, setMode] = useState<RollMode>('normal')
  const [customExpr, setCustomExpr] = useState('')
  const [lastResult, setLastResult] = useState<RollResult | null>(null)
  const [rolling, setRolling] = useState(false)

  const performRoll = (result: RollResult) => {
    setRolling(true)
    setLastResult(result)

    window.setTimeout(() => {
      setRolling(false)
      onRoll(result)
    }, SHAKE_MS)
  }

  const showFumbleAnimation =
    lastResult?.isFumble && !rolling && !lastResult.isCritical

  const showCriticalAnimation =
    lastResult?.isCritical && !rolling && !lastResult.isFumble

  const handleRoll = () => {
    performRoll(
      rollDice({
        sides,
        count,
        modifier,
        mode: sides === 20 && count === 1 ? mode : 'normal',
      }),
    )
  }

  const handleCustomRoll = () => {
    const result = rollFromExpression(
      customExpr,
      sides === 20 ? mode : 'normal',
    )
    if (result) performRoll(result)
  }

  const handleQuickRoll = (preset: (typeof QUICK_ROLLS)[number]) => {
    const mod = preset.withCurrentModifier ? modifier : 0
    performRoll(
      rollDice({
        sides: preset.sides,
        count: preset.count,
        modifier: mod,
        mode: preset.mode,
        label: preset.label,
      }),
    )
  }

  return (
    <div className="space-y-6">
      <div
        className={`relative overflow-hidden rounded-2xl border px-6 py-10 text-center transition-all duration-300 ${
          rolling ? 'dice-shake border-gold-500/50 bg-gold-500/5' : ''
        } ${
          lastResult?.isCritical
            ? 'border-emerald-500/50 bg-emerald-500/10'
            : lastResult?.isFumble
              ? 'border-blood-500/50 bg-blood-500/10'
              : 'border-table-700 bg-table-900/80'
        }`}
      >
        {lastResult ? (
          <>
            {lastResult.d20Rolls && lastResult.mode !== 'normal' && (
              <p className="mb-2 text-sm text-table-400">
                Rolled: {lastResult.d20Rolls[0]} and {lastResult.d20Rolls[1]}
                <span className="text-table-300">
                  {' '}
                  → {lastResult.rolls[0]} (
                  {lastResult.mode === 'advantage' ? 'advantage' : 'disadvantage'})
                </span>
              </p>
            )}
            {showFumbleAnimation ? (
              <div className="flex flex-col items-center gap-2">
                <Suspense
                  fallback={
                    <span className="inline-block text-6xl sm:text-7xl">😈</span>
                  }
                >
                  <FumbleAnimation />
                </Suspense>
                <p className="font-display text-4xl text-blood-400">
                  {lastResult.result}
                </p>
              </div>
            ) : showCriticalAnimation ? (
              <div className="flex flex-col items-center gap-2">
                <Suspense fallback={<span className="text-6xl">✨</span>}>
                  <CriticalAnimation />
                </Suspense>
                <p className="font-display text-4xl text-emerald-400">
                  {lastResult.result}
                </p>
              </div>
            ) : (
              <p
                className={`font-display text-6xl transition-transform duration-300 sm:text-7xl ${
                  rolling ? 'scale-110 opacity-70' : 'scale-100'
                } ${
                  lastResult.isCritical
                    ? 'text-emerald-400'
                    : lastResult.isFumble
                      ? 'text-blood-400'
                      : 'text-gold-400'
                }`}
              >
                {rolling ? '🎲' : lastResult.result}
              </p>
            )}
            <p className="mt-3 text-sm text-table-400">{lastResult.expression}</p>
            {lastResult.isCritical && (
              <p className="mt-2 text-sm font-medium text-emerald-400">
                Natural 20!
              </p>
            )}
            {lastResult.isFumble && (
              <p className="mt-2 text-sm font-medium text-blood-400">
                Natural 1!
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-5xl" aria-hidden="true">
              🎲
            </p>
            <p className="mt-3 text-table-400">Set up and roll</p>
          </>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-table-500">
          Quick rolls
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_ROLLS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleQuickRoll(preset)}
              className="rounded-lg border border-table-600 bg-table-800 px-3 py-2 text-sm text-table-200 transition-colors hover:border-gold-500/40 hover:bg-table-700"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Die type">
          <div className="flex flex-wrap gap-2">
            {STANDARD_DICE.map((die) => (
              <button
                key={die}
                type="button"
                onClick={() => setSides(die)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  sides === die
                    ? 'bg-gold-500/20 text-gold-300 ring-1 ring-gold-500/40'
                    : 'bg-table-800 text-table-300 hover:bg-table-700'
                }`}
              >
                d{die}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Count">
          <div className="flex items-center gap-2">
            <StepButton
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              label="−"
            />
            <span className="w-10 text-center font-display text-xl text-table-100">
              {count}
            </span>
            <StepButton
              onClick={() => setCount((c) => Math.min(20, c + 1))}
              label="+"
            />
          </div>
        </Field>

        <Field label="Modifier">
          <div className="flex items-center gap-2">
            <StepButton
              onClick={() => setModifier((m) => m - 1)}
              label="−"
            />
            <span className="w-12 text-center font-display text-xl text-table-100">
              {modifier >= 0 ? `+${modifier}` : modifier}
            </span>
            <StepButton
              onClick={() => setModifier((m) => m + 1)}
              label="+"
            />
          </div>
        </Field>

        {sides === 20 && count === 1 && (
          <Field label="d20 mode">
            <div className="flex gap-2">
              {(
                [
                  ['normal', 'Normal'],
                  ['advantage', 'Advantage'],
                  ['disadvantage', 'Disadvantage'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  className={`flex-1 rounded-lg px-2 py-2 text-xs font-medium transition-colors sm:text-sm ${
                    mode === value
                      ? 'bg-gold-500/20 text-gold-300 ring-1 ring-gold-500/40'
                      : 'bg-table-800 text-table-400 hover:bg-table-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>
        )}
      </div>

      <button
        type="button"
        onClick={handleRoll}
        className="w-full rounded-xl bg-gold-500/20 py-4 font-display text-lg text-gold-300 ring-1 ring-gold-500/40 transition-all hover:bg-gold-500/30 active:scale-[0.98]"
      >
        Roll {count}d{sides}
        {modifier !== 0 && (modifier > 0 ? ` + ${modifier}` : ` − ${Math.abs(modifier)}`)}
      </button>

      <div className="rounded-xl border border-table-700 bg-table-900/40 p-4">
        <Field label="Custom expression (e.g. 2d6+3)">
          <div className="flex gap-2">
            <input
              type="text"
              value={customExpr}
              onChange={(e) => setCustomExpr(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomRoll()}
              placeholder="1d20+5"
              className="flex-1 rounded-lg border border-table-600 bg-table-800 px-3 py-2 text-sm text-table-100 placeholder:text-table-500 focus:border-gold-500/50 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCustomRoll}
              className="rounded-lg bg-table-700 px-4 py-2 text-sm text-table-200 transition-colors hover:bg-table-600"
            >
              Roll
            </button>
          </div>
        </Field>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-wide text-table-500">
        {label}
      </p>
      {children}
    </div>
  )
}

function StepButton({
  onClick,
  label,
}: {
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-lg bg-table-800 text-lg text-table-200 transition-colors hover:bg-table-700"
      aria-label={label === '+' ? 'Increase' : 'Decrease'}
    >
      {label}
    </button>
  )
}
