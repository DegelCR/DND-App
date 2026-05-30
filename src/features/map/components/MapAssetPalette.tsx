import { useState } from 'react'
import { MAP_ASSET_CATEGORIES, MAP_ASSETS } from '@/lib/map/assets'

interface MapAssetPaletteProps {
  selectedAssetId: string | null
  onSelectAsset: (assetId: string) => void
  snapToGrid: boolean
  onSnapToGridChange: (snap: boolean) => void
}

export function MapAssetPalette({
  selectedAssetId,
  onSelectAsset,
  snapToGrid,
  onSnapToGridChange,
}: MapAssetPaletteProps) {
  const [category, setCategory] = useState<(typeof MAP_ASSET_CATEGORIES)[number]['id']>('terrain')

  const assets = MAP_ASSETS.filter((a) => a.category === category)

  return (
    <div className="border-t border-table-700 bg-table-900/60 px-4 py-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-wide text-table-500">Asset palette</p>
        <label className="flex items-center gap-2 text-xs text-table-400">
          <input
            type="checkbox"
            checked={snapToGrid}
            onChange={(e) => onSnapToGridChange(e.target.checked)}
            className="rounded border-table-600"
          />
          Snap to grid
        </label>
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        {MAP_ASSET_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
              category === cat.id
                ? 'bg-gold-500/20 text-gold-300 ring-1 ring-gold-500/50'
                : 'border border-table-600 bg-table-800 text-table-300 hover:bg-table-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-10">
        {assets.map((asset) => (
          <button
            key={asset.id}
            type="button"
            title={asset.label}
            onClick={() => onSelectAsset(asset.id)}
            className={`flex flex-col items-center gap-1 rounded-lg p-1.5 transition-colors ${
              selectedAssetId === asset.id
                ? 'bg-gold-500/20 ring-2 ring-gold-500/60'
                : 'border border-table-700 bg-table-800 hover:border-table-500 hover:bg-table-700'
            }`}
          >
            <img
              src={asset.src}
              alt={asset.label}
              className="h-10 w-10 object-contain"
              draggable={false}
            />
            <span className="max-w-full truncate text-[10px] text-table-400">{asset.label}</span>
          </button>
        ))}
      </div>

      {!selectedAssetId && (
        <p className="mt-2 text-xs text-table-500">Select an asset, then click the map to place it.</p>
      )}
    </div>
  )
}
