import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { initDatabase } from '@/db'
import { useAppStore } from '@/stores/appStore'
import './index.css'

function Root() {
  const [bootError, setBootError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)
  const setDbReady = useAppStore((s) => s.setDbReady)

  useEffect(() => {
    let cancelled = false

    initDatabase()
      .then(() => {
        if (!cancelled) setDbReady(true)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        const message =
          error instanceof Error ? error.message : 'Unknown error'
        setBootError(message)
      })

    return () => {
      cancelled = true
    }
  }, [setDbReady, retryKey])

  if (bootError) {
    return (
      <div className="flex min-h-full items-center justify-center bg-table-950 p-6">
        <div className="max-w-md rounded-xl border border-blood-500/40 bg-table-900 p-6 text-center">
          <p className="text-4xl">⚠️</p>
          <h1 className="mt-3 font-display text-xl text-table-100">
            Failed to start
          </h1>
          <p className="mt-2 text-sm text-table-400">{bootError}</p>
          <button
            type="button"
            onClick={() => {
              setBootError(null)
              setRetryKey((k) => k + 1)
            }}
            className="mt-4 rounded-lg border border-table-600 bg-table-800 px-4 py-2 text-sm text-table-200 hover:bg-table-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
