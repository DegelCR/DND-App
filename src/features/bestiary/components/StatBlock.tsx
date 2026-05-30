import { abilityRows, crLabel, formatModifier } from '@/lib/monster-utils'
import type { MonsterDetail } from '@/types/monster'

interface StatBlockProps {
  monster: MonsterDetail
  isFavorite: boolean
  onToggleFavorite: () => void
  onAddToCombat: () => void
}

function TraitList({
  title,
  traits,
}: {
  title: string
  traits: { name: string; desc: string }[]
}) {
  if (traits.length === 0) return null
  return (
    <section className="mt-6">
      <h3 className="font-display text-sm uppercase tracking-wide text-gold-400">
        {title}
      </h3>
      <div className="mt-3 space-y-3">
        {traits.map((trait) => (
          <div key={trait.name}>
            <p className="font-medium text-table-100">
              {trait.name}.{' '}
              <span className="font-normal text-table-300">{trait.desc}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function StatBlock({
  monster,
  isFavorite,
  onToggleFavorite,
  onAddToCombat,
}: StatBlockProps) {
  const abilities = abilityRows(monster)

  return (
    <article className="rounded-xl border border-table-700 bg-table-900/60 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-table-100">{monster.name}</h2>
          <p className="mt-1 text-sm capitalize text-table-400">
            {monster.size} {monster.type}, {monster.alignment}
          </p>
          <p className="mt-1 text-sm text-gold-400">
            {crLabel(monster.challengeRating)} · {monster.xp.toLocaleString()} XP
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onToggleFavorite}
            className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
              isFavorite
                ? 'border-gold-500/40 bg-gold-500/15 text-gold-300'
                : 'border-table-600 bg-table-800 text-table-300 hover:border-table-500'
            }`}
          >
            {isFavorite ? '★ Favorited' : '☆ Favorite'}
          </button>
          <button
            type="button"
            onClick={onAddToCombat}
            className="rounded-lg border border-table-600 bg-table-800 px-3 py-2 text-sm text-table-300 transition-colors hover:border-gold-500/40 hover:text-gold-300"
          >
            Add to combat
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <StatRow label="Armor Class" value={String(monster.armorClass)} />
        <StatRow
          label="Hit Points"
          value={`${monster.hitPoints} (${monster.hitDice})`}
        />
        <StatRow label="Speed" value={monster.speed} />
        <StatRow label="Languages" value={monster.languages} />
        <StatRow label="Senses" value={monster.senses} className="sm:col-span-2" />
        {monster.proficiencies.length > 0 && (
          <StatRow
            label="Skills"
            value={monster.proficiencies.join(', ')}
            className="sm:col-span-2"
          />
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-table-700">
        <table className="w-full min-w-[320px] text-sm">
          <thead>
            <tr className="border-b border-table-700 bg-table-800/80">
              {abilities.map((a) => (
                <th
                  key={a.label}
                  className="px-3 py-2 text-center font-medium text-table-400"
                >
                  {a.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-table-700">
              {abilities.map((a) => (
                <td key={a.label} className="px-3 py-2 text-center text-table-100">
                  {a.score}
                </td>
              ))}
            </tr>
            <tr>
              {abilities.map((a) => (
                <td key={a.label} className="px-3 py-2 text-center text-gold-400">
                  {formatModifier(a.mod)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <TraitList title="Traits" traits={monster.specialAbilities} />
      <TraitList title="Actions" traits={monster.actions} />
      <TraitList title="Legendary Actions" traits={monster.legendaryActions ?? []} />

      <p className="mt-6 text-xs text-table-500">
        Source: SRD · Cached locally
        {monster.source === 'homebrew' && ' · Homebrew'}
      </p>
    </article>
  )
}

function StatRow({
  label,
  value,
  className = '',
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={className}>
      <span className="font-medium text-table-100">{label}</span>{' '}
      <span className="text-table-300">{value}</span>
    </div>
  )
}
