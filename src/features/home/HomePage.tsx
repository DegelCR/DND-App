import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { ModuleCard } from '@/components/ui/ModuleCard'
import { NAV_MODULES } from '@/lib/navigation'
import { useAppStore } from '@/stores/appStore'

export function HomePage() {
  const dbReady = useAppStore((s) => s.dbReady)

  return (
    <>
      <PageHeader
        title="Campaign Table"
        description="Your toolkit for D&D 5e sessions. Everything is saved locally in your browser."
        icon="🛡️"
      />

      <div className="flex-1 space-y-8 p-6">
        <section className="rounded-xl border border-table-700 bg-linear-to-br from-table-900 to-table-950 p-6">
          <div className="flex flex-wrap items-center gap-4">
              <div
                className={`h-3 w-3 rounded-full ${
                  dbReady ? 'bg-emerald-500' : 'animate-pulse bg-amber-500'
                }`}
              />
              <div>
                <p className="font-medium text-table-100">
                  {dbReady
                    ? 'All 8 modules ready — MVP complete'
                    : 'Initializing local storage…'}
                </p>
                <p className="text-sm text-table-400">
                  IndexedDB · No server · Data stays on your PC
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <StatCard label="Ready modules" value="8" />
              <StatCard label="Roadmap" value="Done" />
              <StatCard label="Cost" value="$0" />
            </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-xl text-table-100">Modules</h2>
              <p className="text-sm text-table-400">
                Hover cards for the glow effect
              </p>
            </div>
            <Link
              to="/characters/new"
              className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-table-950 transition-colors hover:bg-gold-400"
            >
              Create character →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {NAV_MODULES.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-table-700 bg-table-900/40 p-6">
          <h2 className="font-display text-lg text-table-100">SRD content</h2>
          <p className="mt-2 text-sm leading-relaxed text-table-400">
            This app uses data from the System Reference Document (SRD) under
            the Creative Commons license. It is not affiliated with or endorsed
            by Wizards of the Coast.
          </p>
          <p className="mt-3 text-xs text-table-500">
            UI animations adapted from{' '}
            <a
              href="https://reactbits.dev"
              target="_blank"
              rel="noreferrer"
              className="text-table-400 underline hover:text-gold-400"
            >
              React Bits
            </a>{' '}
            (MIT + Commons Clause) · Fumble animation by{' '}
            <a
              href="https://lottiefiles.com/free-animation/devil-d20-fumble-rEH73ips20"
              target="_blank"
              rel="noreferrer"
              className="text-table-400 underline hover:text-gold-400"
            >
              Holli Lozinguez
            </a>{' '}
            via LottieFiles
          </p>
        </section>
      </div>
    </>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-table-800/80 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-table-500">{label}</p>
      <p className="mt-1 font-display text-2xl text-gold-400">{value}</p>
    </div>
  )
}
