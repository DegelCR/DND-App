import type { ReactNode } from 'react'
import { PageHeader } from './PageHeader'

interface PlaceholderPageProps {
  title: string
  description: string
  icon: string
  phase: number
  children?: ReactNode
}

export function PlaceholderPage({
  title,
  description,
  icon,
  phase,
  children,
}: PlaceholderPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} icon={icon} />
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl border border-dashed border-table-600 bg-table-900/50 p-10 text-center">
          <p className="text-5xl" aria-hidden="true">
            {icon}
          </p>
          <h2 className="mt-4 font-display text-xl text-table-200">
            Coming soon
          </h2>
          <p className="mt-2 text-sm text-table-400">
            This module will ship in <strong>Phase {phase}</strong> of the
            roadmap.
          </p>
          {children && <div className="mt-6 text-left">{children}</div>}
        </div>
      </div>
    </>
  )
}
