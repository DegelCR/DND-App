import type { MapTool } from '@/types/map'

interface MapToolbarProps {
  tool: MapTool
  showGrid: boolean
  gridSize: number
  feetPerSquare: number
  measureLabel: string | null
  onToolChange: (tool: MapTool) => void
  onToggleGrid: () => void
  onGridSizeChange: (size: number) => void
  onFeetPerSquareChange: (feet: number) => void
  onClearFog: () => void
  onResetView: () => void
}

const TOOLS: { id: MapTool; label: string; icon: string }[] = [
  { id: 'pan', label: 'Pan', icon: '✋' },
  { id: 'token', label: 'Token', icon: '⬤' },
  { id: 'fog', label: 'Fog', icon: '🌫️' },
  { id: 'erase', label: 'Reveal', icon: '👁️' },
  { id: 'measure', label: 'Measure', icon: '📏' },
]

export function MapToolbar({
  tool,
  showGrid,
  gridSize,
  feetPerSquare,
  measureLabel,
  onToolChange,
  onToggleGrid,
  onGridSizeChange,
  onFeetPerSquareChange,
  onClearFog,
  onResetView,
}: MapToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-table-700 bg-table-900/80 px-4 py-3">
      <div className="flex flex-wrap gap-1">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            title={t.label}
            onClick={() => onToolChange(t.id)}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              tool === t.id
                ? 'bg-gold-500/20 text-gold-300 ring-1 ring-gold-500/50'
                : 'border border-table-600 bg-table-800 text-table-200 hover:border-table-500 hover:bg-table-700'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-table-700" />

      <label className="flex items-center gap-2 text-sm text-table-300">
        <input
          type="checkbox"
          checked={showGrid}
          onChange={onToggleGrid}
          className="rounded border-table-600"
        />
        Grid
      </label>

      <label className="flex items-center gap-2 text-sm text-table-400">
        Size
        <input
          type="number"
          min={10}
          max={200}
          value={gridSize}
          onChange={(e) => onGridSizeChange(Math.min(200, Math.max(10, Number(e.target.value) || 50)))}
          className="w-16 rounded border border-table-600 bg-table-950 px-2 py-1 text-table-100"
        />
        px
      </label>

      <label className="flex items-center gap-2 text-sm text-table-400">
        Ft/sq
        <input
          type="number"
          min={1}
          max={30}
          value={feetPerSquare}
          onChange={(e) => onFeetPerSquareChange(Math.min(30, Math.max(1, Number(e.target.value) || 5)))}
          className="w-14 rounded border border-table-600 bg-table-950 px-2 py-1 text-table-100"
        />
      </label>

      {measureLabel && (
        <span className="rounded-lg bg-table-800 px-3 py-1 text-sm text-gold-300">{measureLabel}</span>
      )}

      <div className="ml-auto flex gap-2">
        <button
          type="button"
          onClick={onClearFog}
          className="rounded-lg border border-table-500 bg-table-800 px-3 py-1.5 text-sm text-table-100 hover:border-gold-500/40 hover:bg-table-700"
        >
          Clear fog
        </button>
        <button
          type="button"
          onClick={onResetView}
          className="rounded-lg border border-table-500 bg-table-800 px-3 py-1.5 text-sm text-table-100 hover:border-gold-500/40 hover:bg-table-700"
        >
          Reset view
        </button>
      </div>
    </div>
  )
}
