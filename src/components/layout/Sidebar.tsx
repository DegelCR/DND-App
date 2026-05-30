import { NavLink } from 'react-router-dom'
import { LetterGlitch } from '@/components/reactbits'
import { NAV_MODULES } from '@/lib/navigation'
import { useAppStore } from '@/stores/appStore'

const SIDEBAR_GLITCH_COLORS = ['#e8cc6e', '#dbb84a', '#c9a227', '#d9cfc0', '#b8aa98']

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, dbReady } = useAppStore()

  return (
    <aside
      className={`relative flex shrink-0 flex-col overflow-hidden border-r border-table-700 transition-all duration-200 ${
        sidebarCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <LetterGlitch
          glitchColors={SIDEBAR_GLITCH_COLORS}
          glitchSpeed={45}
          outerVignette={false}
          centerVignette={false}
          opacity={0.95}
          characters="DNDd20⚔🎲ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-linear-to-b from-table-950/35 via-table-950/55 to-table-950/75"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-table-700/80 bg-table-900/40 px-4 py-5 backdrop-blur-sm">
          <span className="text-2xl" aria-hidden="true">
            🛡️
          </span>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="font-display text-lg leading-tight text-table-100">
                DND App
              </p>
              <p className="truncate text-xs text-table-300">Campaign table</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 p-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm backdrop-blur-sm transition-colors ${
                isActive
                  ? 'bg-gold-500/25 text-gold-300 ring-1 ring-gold-500/30'
                  : 'bg-table-900/45 text-table-200 hover:bg-table-800/70 hover:text-table-100'
              }`
            }
          >
            <span className="text-lg" aria-hidden="true">
              🏠
            </span>
            {!sidebarCollapsed && <span>Home</span>}
          </NavLink>

          {NAV_MODULES.map((module) => (
            <NavLink
              key={module.id}
              to={module.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm backdrop-blur-sm transition-colors ${
                  isActive
                    ? 'bg-gold-500/25 text-gold-300 ring-1 ring-gold-500/30'
                    : 'bg-table-900/45 text-table-200 hover:bg-table-800/70 hover:text-table-100'
                }`
              }
            >
              <span className="text-lg" aria-hidden="true">
                {module.icon}
              </span>
              {!sidebarCollapsed && (
                <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <span>{module.label}</span>
                  {module.status !== 'ready' && (
                    <span className="rounded bg-table-700 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-table-400">
                      {module.status === 'planned' ? 'F' + module.phase : 'WIP'}
                    </span>
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-2 border-t border-table-700/80 bg-table-900/30 p-3 backdrop-blur-sm">
          {!sidebarCollapsed && (
            <div className="rounded-lg bg-table-900/60 px-3 py-2 text-xs text-table-300">
              <p className="flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    dbReady ? 'bg-emerald-500' : 'animate-pulse bg-amber-500'
                  }`}
                />
                {dbReady ? 'Local data ready' : 'Starting database…'}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={toggleSidebar}
            className="flex w-full items-center justify-center rounded-lg bg-table-900/50 px-3 py-2 text-sm text-table-300 backdrop-blur-sm transition-colors hover:bg-table-800/70 hover:text-table-100"
            aria-label={sidebarCollapsed ? 'Expand menu' : 'Collapse menu'}
          >
            {sidebarCollapsed ? '→' : '← Collapse'}
          </button>
        </div>
      </div>
    </aside>
  )
}
