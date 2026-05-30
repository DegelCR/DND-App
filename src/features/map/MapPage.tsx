import { useCallback, useRef, useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { MapCanvas } from './components/MapCanvas'
import { MapSidebar } from './components/MapSidebar'
import { MapToolbar } from './components/MapToolbar'
import { useBattleMaps } from './useBattleMaps'
import type { MapTool } from '@/types/map'

export function MapPage() {
  const {
    loading,
    error,
    maps,
    activeMap,
    activeMapId,
    selectMap,
    createMapFromFile,
    deleteMap,
    renameMap,
    updateTokens,
    updateGrid,
    saveFog,
    clearFog,
    setError,
  } = useBattleMaps()

  const [tool, setTool] = useState<MapTool>('pan')
  const [measureLabel, setMeasureLabel] = useState<string | null>(null)
  const resetViewRef = useRef<(() => void) | null>(null)

  const handleUpload = useCallback(
    async (file: File) => {
      await createMapFromFile(file)
    },
    [createMapFromFile],
  )

  const handleClearFog = useCallback(async () => {
    if (!activeMapId) return
    await clearFog()
  }, [activeMapId, clearFog])

  return (
    <>
      <PageHeader
        title="Battle map"
        description="Upload a map image, overlay a grid, drag tokens, paint fog, and measure distance."
        icon="🗺️"
      />

      {loading ? (
        <div className="p-6">
          <div className="h-96 animate-pulse rounded-xl bg-table-900/60" />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-4 p-6 lg:flex-row">
          <div className="w-full shrink-0 lg:w-56">
            <MapSidebar
              maps={maps}
              activeId={activeMapId}
              onSelect={(id) => void selectMap(id)}
              onUpload={(file) => void handleUpload(file)}
              onDelete={(id) => void deleteMap(id)}
              onRename={(id, name) => void renameMap(id, name)}
            />
            {error && (
              <p className="mt-3 rounded-lg border border-red-800/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">
                {error}
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="ml-2 text-red-400 hover:text-red-200"
                >
                  ✕
                </button>
              </p>
            )}
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            {activeMap ? (
              <>
                <MapToolbar
                  tool={tool}
                  showGrid={activeMap.showGrid}
                  gridSize={activeMap.gridSize}
                  feetPerSquare={activeMap.feetPerSquare}
                  measureLabel={measureLabel}
                  onToolChange={(next) => {
                    setTool(next)
                    if (next !== 'measure') setMeasureLabel(null)
                  }}
                  onToggleGrid={() =>
                    updateGrid({ showGrid: !activeMap.showGrid })
                  }
                  onGridSizeChange={(gridSize) => updateGrid({ gridSize })}
                  onFeetPerSquareChange={(feetPerSquare) => updateGrid({ feetPerSquare })}
                  onClearFog={() => void handleClearFog()}
                  onResetView={() => resetViewRef.current?.()}
                />
                <MapCanvas
                  key={activeMap.id}
                  map={activeMap}
                  tool={tool}
                  onTokensChange={updateTokens}
                  onGridChange={updateGrid}
                  onFogSave={(blob) => void saveFog(blob)}
                  onMeasureChange={setMeasureLabel}
                  onResetViewRef={(fn) => {
                    resetViewRef.current = fn
                  }}
                />
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-table-700 bg-table-900/30 p-12 text-center">
                <p className="text-4xl">🗺️</p>
                <p className="mt-4 text-lg font-medium text-table-200">No map loaded</p>
                <p className="mt-2 max-w-sm text-sm text-table-500">
                  Upload a battle map image from your sidebar to get started. Everything saves locally in your browser.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
