import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: string
  actions?: ReactNode
}

export function PageHeader({
  title,
  description,
  icon,
  actions,
}: PageHeaderProps) {
  return (
    <header className="border-b border-table-700 bg-table-900/80 px-6 py-5 backdrop-blur-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {icon && (
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-table-800 text-2xl"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <div>
            <h1 className="font-display text-2xl text-table-100">{title}</h1>
            {description && (
              <p className="mt-1 max-w-2xl text-sm text-table-400">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}
