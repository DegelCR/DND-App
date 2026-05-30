import { useRef, useState } from 'react'
import { MAP_BACKGROUND_OPTIONS } from '@/lib/map/assets'
import type { BattleMapRecord, MapBackgroundType } from '@/types/map'

interface MapSidebarProps {
  maps: BattleMapRecord[]
  activeId: number | null
  onSelect: (id: number) => void
  onUpload: (file: File) => void
  onCreateBlank: (name: string, background: MapBackgroundType) => void
  onDelete: (id: number) => void
  onRename: (id: number, name: string) => void
}

export function MapSidebar({
  maps,
  activeId,
  onSelect,
  onUpload,
  onCreateBlank,
  onDelete,
  onRename,
}: MapSidebarProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [blankName, setBlankName] = useState('New map')
  const [blankBackground, setBlankBackground] = useState<MapBackgroundType>('grass')

  return (
    <aside className="flex flex-col gap-4 rounded-xl border border-table-700 bg-table-900/40 p-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-table-400">Maps</h2>
        <p className="mt-1 text-xs text-table-500">Upload an image or build with stamps</p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onUpload(file)
          e.target.value = ''
        }}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="w-full rounded-lg bg-gold-500 px-3 py-2 text-sm font-medium text-table-950 hover:bg-gold-400"
      >
        Upload map
      </button>

      <div className="rounded-lg border border-table-700 bg-table-950/50 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-table-500">New blank map</p>
        <input
          value={blankName}
          onChange={(e) => setBlankName(e.target.value)}
          placeholder="Map name"
          className="mt-2 w-full rounded border border-table-600 bg-table-900 px-2 py-1.5 text-sm text-table-100 outline-none focus:border-gold-500/50"
        />
        <select
          value={blankBackground}
          onChange={(e) => setBlankBackground(e.target.value as MapBackgroundType)}
          className="mt-2 w-full rounded border border-table-600 bg-table-900 px-2 py-1.5 text-sm text-table-100 outline-none focus:border-gold-500/50"
        >
          {MAP_BACKGROUND_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => onCreateBlank(blankName, blankBackground)}
          className="mt-2 w-full rounded-lg border border-table-500 bg-table-800 px-3 py-2 text-sm text-table-100 hover:border-gold-500/40 hover:bg-table-700"
        >
          Create blank map
        </button>
      </div>

      <ul className="flex max-h-[320px] flex-col gap-1 overflow-y-auto">
        {maps.length === 0 ? (
          <li className="rounded-lg border border-dashed border-table-700 px-3 py-6 text-center text-sm text-table-500">
            No maps yet
          </li>
        ) : (
          maps.map((map) => (
            <li key={map.id}>
              <div
                className={`group flex items-center gap-2 rounded-lg px-2 py-2 ${
                  map.id === activeId ? 'bg-gold-500/15 ring-1 ring-gold-500/40' : 'hover:bg-table-800'
                }`}
              >
                <button
                  type="button"
                  onClick={() => map.id != null && onSelect(map.id)}
                  className="min-w-0 flex-1 truncate text-left text-sm text-table-200"
                >
                  {map.source === 'builder' && <span className="mr-1 text-table-500">✏</span>}
                  {map.name}
                </button>
                <button
                  type="button"
                  title="Rename"
                  onClick={() => {
                    const next = window.prompt('Map name', map.name)
                    if (next != null && map.id != null) onRename(map.id, next)
                  }}
                  className="hidden text-xs text-table-500 group-hover:inline hover:text-table-300"
                >
                  ✎
                </button>
                <button
                  type="button"
                  title="Delete"
                  onClick={() => {
                    if (map.id != null && window.confirm(`Delete "${map.name}"?`)) {
                      onDelete(map.id)
                    }
                  }}
                  className="hidden text-xs text-red-400/70 group-hover:inline hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </aside>
  )
}
