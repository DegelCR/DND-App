import type { CompendiumDetail } from '@/types/compendium'
import { getCategoryMeta } from '@/lib/compendium-api'

interface CompendiumDetailViewProps {
  detail: CompendiumDetail
}

function renderLine(line: string) {
  const boldMatch = line.match(/^\*\*(.+)\*\*$/)
  if (boldMatch) {
    return <p className="font-medium text-table-100">{boldMatch[1]}</p>
  }
  if (line.startsWith('  ')) {
    return <p className="pl-3 text-table-400">{line.trim()}</p>
  }
  return <p className="text-table-300">{line}</p>
}

export function CompendiumDetailView({ detail }: CompendiumDetailViewProps) {
  const meta = getCategoryMeta(detail.category)

  return (
    <article className="rounded-xl border border-table-700 bg-table-900/60 p-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-table-500">
          {meta.icon} {meta.label}
        </p>
        <h2 className="mt-1 font-display text-2xl text-table-100">{detail.name}</h2>
        {detail.subtitle && (
          <p className="mt-1 text-sm text-gold-400">{detail.subtitle}</p>
        )}
      </div>

      <div className="mt-6 space-y-6">
        {detail.sections.map((section) => (
          <section key={section.title}>
            <h3 className="font-display text-sm uppercase tracking-wide text-gold-400">
              {section.title}
            </h3>
            <div className="mt-3 space-y-2 text-sm">
              {section.lines.map((line, i) => (
                <div key={`${section.title}-${i}`}>{renderLine(line)}</div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}
